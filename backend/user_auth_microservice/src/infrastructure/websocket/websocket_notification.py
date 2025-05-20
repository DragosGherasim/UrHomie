from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import redis.asyncio as redis
import asyncio

from shared.env_config import Settings
from src.shared.logger import get_logger

logger = get_logger(__name__)

app = FastAPI()

redis_client = redis.Redis(host=Settings.REDIS_HOST, port=Settings.REDIS_PORT, decode_responses=True)

@app.websocket("/user-auth/registration-status")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        correlation_id = websocket.query_params.get("correlation_id")

        if not correlation_id:
            await websocket.close(code=1008)
            logger.warning("WebSocket connection rejected: missing correlation_id")
            return

        logger.info(f"WebSocket connected for correlationId={correlation_id}")

        while True:
            saga = await redis_client.hgetall(f"saga:{correlation_id}")

            if saga:
                status = saga.get("status")

                if status and status in ("completed", "failed"):
                    await websocket.send_json(saga)
                    logger.info(f"Notified frontend: {saga}")

                    if status == "completed":
                        await redis_client.delete(f"saga:{correlation_id}")
                        logger.info(f"Deleted saga from Redis for correlationId={correlation_id}")
                    break

            await asyncio.sleep(1)

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for correlationId={correlation_id}")
    except Exception as e:
        logger.exception(f"WebSocket error: {e}")
