import aio_pika
import json
from typing import Any, Dict, Callable, Awaitable, List
from aio_pika.abc import AbstractIncomingMessage
from aio_pika.exceptions import AMQPConnectionError

from shared.env_config import Settings
from src.shared.logger import get_logger

logger = get_logger(__name__)

class ProfileEventBus:
    def __init__(self):
        self.connection = None
        self.channel = None
        self.exchange = None
        self.exchange_name = "create_user_profile_event"

    async def connect(self):
        try:
            self.connection = await aio_pika.connect_robust(Settings.RABBITMQ_URL)
            self.channel = await self.connection.channel()

            self.exchange = await self.channel.declare_exchange(
                self.exchange_name,
                aio_pika.ExchangeType.FANOUT,
                durable=True
            )

            logger.info("Connected to RabbitMQ and declared exchange.")

        except AMQPConnectionError as e:
            logger.error(f"RabbitMQ connection failed: {e}")
            raise

    async def close(self):
        if self.connection:
            await self.connection.close()
            logger.info("RabbitMQ connection closed.")

    async def publish(self, message: Dict[str, Any], correlation_id: str, message_type: str):
        if not self.exchange:
            raise RuntimeError("Exchange not declared. Did you forget to call connect()?")

        envelope = {
            "messageType": [f"urn:message:{message_type}"],
            "message": message,
            "correlationId": correlation_id
        }

        amqp_message = aio_pika.Message(
            body=json.dumps(envelope).encode(),
            content_type="application/vnd.masstransit+json"
        )

        await self.exchange.publish(amqp_message, routing_key="")
        logger.info(f"Published MassTransit-style envelope with CorrelationId={correlation_id}")

    async def consume(
        self,
        queue_name: str,
        callback: Callable[[AbstractIncomingMessage], Awaitable[None]],
        bind_exchanges: List[str] = None
    ):
        if not self.channel:
            raise RuntimeError("Channel not initialized. Call connect() first.")

        queue = await self.channel.declare_queue(queue_name, durable=True)

        if bind_exchanges:
            for exchange_name in bind_exchanges:
                ext_exchange = await self.channel.declare_exchange(
                    exchange_name,
                    aio_pika.ExchangeType.FANOUT,
                    durable=True
                )

                await queue.bind(ext_exchange)
                logger.info(f"Bound queue '{queue_name}' to external exchange '{exchange_name}'")

        await queue.consume(callback)
        logger.info(f"Started consuming from queue '{queue_name}'")