from peewee import Model

from src.persistence.config.user_auth_db_config import db

class BaseModel(Model):
    class Meta:
        database = db