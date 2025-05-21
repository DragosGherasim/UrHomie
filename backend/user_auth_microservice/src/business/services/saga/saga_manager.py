import redis.asyncio as redis

from shared.env_config import Settings

class SagaManager:
    def __init__(self):
        self.client = redis.Redis(host=Settings.REDIS_HOST, port=Settings.REDIS_PORT, decode_responses=True)

    async def start_saga(self, correlation_id, user_id):
        await self.client.hset(f"saga:{correlation_id}", mapping={
            "user_id": user_id,
            "status": "pending",
            "error": ""
        })

    async def mark_success(self, correlation_id):
        await self.client.hset(f"saga:{correlation_id}", "status", "completed")

    async def mark_failed(self, correlation_id, error_msg):
        await self.client.hset(f"saga:{correlation_id}", mapping={
            "status": "failed",
            "error": error_msg
        })

    async def get_status(self, correlation_id):
        return await self.client.hgetall(f"saga:{correlation_id}")
