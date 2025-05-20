from peewee import BigIntegerField, CharField
from enum import Enum

from .base_model import BaseModel

class RoleEnum(str, Enum):
    ADMIN = "ADMIN"
    CLIENT = "CLIENT"
    SERVICE_PROVIDER = "SERVICE_PROVIDER"

class UserAccount(BaseModel):
    id = BigIntegerField(primary_key=True)
    email = CharField(max_length=128, unique=True, null=False)
    password = CharField(max_length=256, null=False)
    role = CharField(max_length=128, null=False)

    class Meta:
        table_name = "user_account"

    def set_role(self, value: RoleEnum):
        if not isinstance(value, RoleEnum):
            raise ValueError(f"Invalid role: {value}")
        self.role = value.value


