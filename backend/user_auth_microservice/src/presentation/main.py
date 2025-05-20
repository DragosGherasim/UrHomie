import asyncio
import uvicorn
from uvicorn.config import Config
from uvicorn.server import Server

from infrastructure.messaging.handle_profile_result import handle_profile_result
from infrastructure.messaging.profile_event_bus import ProfileEventBus
from infrastructure.grpc.grpc_server import start_grpc, stop_grpc
from infrastructure.websocket.websocket_notification import app as ws_app
from src.shared.logger import get_logger

logger = get_logger(__name__)
event_bus = ProfileEventBus()

async def start_services():
    await event_bus.connect()

    await event_bus.consume(
        queue_name="user_profile_result_queue",
        callback=handle_profile_result,
        bind_exchanges=[
            "user_profile_created_event",
            "user_profile_failed_event"
        ]
    )

    await start_grpc()

async def start_websocket_server():
    logger.info("Starting WebSocket server on port 8001...")
    config = Config(app=ws_app, host="0.0.0.0", port=8001, log_level="info")
    server = Server(config)
    await server.serve()

async def main():
    try:
        await asyncio.gather(
            start_services(),
            start_websocket_server(),
        )
    except asyncio.CancelledError:
        logger.warning("Tasks cancelled.")
    finally:
        await shutdown()

async def shutdown():
    logger.info("Initiating graceful shutdown...")
    await stop_grpc()
    await event_bus.close()
    logger.info("Shutdown complete.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Interrupted manually (Ctrl+C).")
