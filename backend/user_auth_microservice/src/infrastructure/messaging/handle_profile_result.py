import json
import asyncio
from aio_pika.abc import AbstractIncomingMessage

from src.shared.logger import get_logger
from src.business.services.saga.saga_manager import SagaManager
from src.persistence.repositories.user_account_repo import UserAccountRepository

logger = get_logger(__name__)
saga_manager = SagaManager()
user_repo = UserAccountRepository()

async def handle_profile_result(msg: AbstractIncomingMessage):
    async with msg.process():
        try:
            data = json.loads(msg.body)

            logger.info(f"Received {data}")

            message_type = data.get("messageType", [""])[0]
            correlation_id = data.get("correlationId")

            if not correlation_id:
                logger.warning("Received message without correlationId.")
                return

            logger.info(f"Handling event {message_type} for correlationId={correlation_id}")

            saga = await saga_manager.get_status(correlation_id)
            if not saga:
                logger.warning(f"No saga found for correlationId {correlation_id}")
                return

            if "UserProfileCreated" in message_type:
                await saga_manager.mark_success(correlation_id)
                logger.info(f"Saga {correlation_id} marked as completed.")

            elif "UserProfileCreationFailed" in message_type:
                error_message = (
                        data.get("message", {}).get("errorMessage")
                        or data.get("Message", {}).get("errorMessage")
                        or "Unknown error"
                )
                await saga_manager.mark_failed(correlation_id, error_message)

                user_id = saga.get("user_id")
                if user_id:
                    await asyncio.to_thread(user_repo.delete_user, int(user_id))
                    logger.info(f"User {user_id} deleted due to failed profile creation.")
                else:
                    logger.error(f"User ID missing in saga for correlationId {correlation_id}")

            else:
                logger.warning(f"Unhandled message type: {message_type}")

        except Exception as e:
            logger.exception(f"Error handling profile result message: {e}")
