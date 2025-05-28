import grpc
import uuid

from src.infrastructure.messaging.message_builder import build_create_user_profile_message
from src.shared.logger import get_logger
from src.business.services.grpc.compiled_protos import user_auth_pb2
from src.business.services.grpc.compiled_protos import user_auth_pb2_grpc

logger = get_logger(__name__)

class UserAuthServer(user_auth_pb2_grpc.UserAuthenticationServicer):
    def __init__(self, user_repo, jwt_service, event_bus, saga_manager):
        self.user_repo = user_repo
        self.jwt_service = jwt_service
        self.event_bus = event_bus
        self.saga_manager = saga_manager

    async def LogIn(self, request, context):
        email, password = request.email, request.password
        logger.info(f"Received LogIn request for email: {email}")

        user = self.user_repo.validate_credentials(email, password)
        if not user:
            logger.warning(f"Authentication failed for email: {email}.")
            return user_auth_pb2.LogInResponse(jwt="", sub="", role="", error_message="Invalid email or password!")

        access_token = self.jwt_service.generate_token(user, expires_in=900)
        refresh_token = self.jwt_service.generate_token(user, expires_in=604800, refresh=True)

        await context.send_initial_metadata((
            ('set-cookie', f'refresh_token={refresh_token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax'),
        ))

        logger.info(f"Authentication successful for {email}")
        return user_auth_pb2.LogInResponse(
            jwt=access_token,
            sub=str(user.id),
            role=user.role,
            error_message=""
        )

    async def SignUp(self, request, context):
        email, password, role = request.email, request.password, request.role
        logger.info(f"Received SignUp request for {email}")

        try:
            user = self.user_repo.create_user(email, password, role)
            if not user:
                raise ValueError("User creation failed")

            correlation_id = str(uuid.uuid4())
            await self.saga_manager.start_saga(correlation_id, user.id)
            logger.info(f"Saga started with correlationId={correlation_id}")

            message = build_create_user_profile_message(user.id, request)

            await self.event_bus.publish(
                message=message,
                correlation_id=correlation_id,
                message_type="user_management_microservice.Infrastructure.EventBus.Messages:CreateUserProfileMessage"
            )

            return user_auth_pb2.SignUpResponse(
                success=True,
                error_message="",
                correlation_id=correlation_id
            )

        except ValueError as ve:
            logger.warning(f"Validation error during signup for {email}: {ve}")
            return user_auth_pb2.SignUpResponse(
                success=False,
                error_message=str(ve),
                correlation_id=""
            )

        except Exception as e:
            logger.error(f"Unexpected error during signup for {email}: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return user_auth_pb2.SignUpResponse(
                success=False,
                error_message="Internal server error!",
                correlation_id=""
            )

    async def ValidateJwt(self, request, context):
        jwt = request.jwt
        logger.info("Received JWT validation request.")

        try:
            result = self.jwt_service.validate_token(jwt)
            return user_auth_pb2.ValidateJwtResponse(**result)
        except Exception as e:
            logger.error(f"JWT validation error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            return user_auth_pb2.ValidateJwtResponse(
                is_valid=False,
                sub="",
                role="",
                error_message="Unexpected error!"
            )

    async def RefreshToken(self, request, context):
        logger.info("Received RefreshToken request")

        try:
            metadata = dict(context.invocation_metadata())
            cookie = metadata.get("cookie", "")
            token = None

            for part in cookie.split(";"):
                if part.strip().startswith("refresh_token="):
                    token = part.strip().split("=", 1)[1]

            if not token:
                logger.warning("No refresh token found in cookie.")
                context.set_code(grpc.StatusCode.UNAUTHENTICATED)
                return user_auth_pb2.LogInResponse(jwt="", sub="", role="", error_message="Missing refresh token")

            result = self.jwt_service.validate_token(token, refresh=True)
            if not result.get("is_valid"):
                raise ValueError(result.get("error_message"))

            user_id = result["sub"]
            user = self.user_repo.get_user_by_id(user_id)
            if not user:
                raise ValueError("User not found")

            new_access_token = self.jwt_service.generate_token(user)

            return user_auth_pb2.LogInResponse(
                jwt=new_access_token,
                sub=str(user.id),
                role=user.role,
                error_message=""
            )

        except Exception as e:
            logger.error(f"Refresh token validation failed: {e}")
            context.set_code(grpc.StatusCode.UNAUTHENTICATED)
            return user_auth_pb2.LogInResponse(jwt="", sub="", role="", error_message="Refresh token invalid")

    async def LogOut(self, request, context):
        await context.send_initial_metadata((
            ('set-cookie', 'refresh_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax'),
        ))
        logger.info("User logged out. Refresh token cleared.")
        return user_auth_pb2.Empty()
