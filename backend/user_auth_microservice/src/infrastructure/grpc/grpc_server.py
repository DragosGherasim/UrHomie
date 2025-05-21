import grpc

from src.shared.logger import get_logger
from src.business.services.grpc.user_auth_service import UserAuthServer
from src.persistence.repositories.user_account_repo import UserAccountRepository
from src.business.services.jwt.jwt_service import JwtService
from src.infrastructure.messaging.profile_event_bus import ProfileEventBus
from src.business.services.saga.saga_manager import SagaManager
from src.business.services.grpc.compiled_protos import user_auth_pb2_grpc

logger = get_logger(__name__)

grpc_server = None
event_bus = None

async def start_grpc():
    global grpc_server, event_bus

    event_bus = ProfileEventBus()
    await event_bus.connect()

    grpc_server = grpc.aio.server()
    auth_service = UserAuthServer(
        user_repo=UserAccountRepository(),
        jwt_service=JwtService(),
        event_bus=event_bus,
        saga_manager=SagaManager()
    )

    user_auth_pb2_grpc.add_UserAuthenticationServicer_to_server(auth_service, grpc_server)
    grpc_server.add_insecure_port('[::]:50051')

    logger.info("gRPC server starting on port 50051...")
    await grpc_server.start()
    await grpc_server.wait_for_termination()

async def stop_grpc():
    if grpc_server:
        await grpc_server.stop(5)
        logger.info("gRPC server stopped.")

    if event_bus:
        await event_bus.close()
        logger.info("RabbitMQ connection closed.")
