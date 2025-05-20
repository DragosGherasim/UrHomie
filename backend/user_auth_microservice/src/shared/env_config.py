import os
from dotenv import load_dotenv

env = os.getenv("ENVIRONMENT", "development")
dotenv_path = f".env.{env}"

if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

class Settings:
    # Database
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "user-auth")
    MYSQL_USER = os.getenv("MYSQL_USER", "user-auth-manager")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "manager-pass")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))

    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = os.getenv("REDIS_PORT", 6379)

    # RabbitMQ
    RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ISSUER = os.getenv("JWT_ISSUER", "grpc://user_auth_microservice")