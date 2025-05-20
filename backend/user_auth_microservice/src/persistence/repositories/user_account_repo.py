import bcrypt
from peewee import IntegrityError

from src.persistence.config.user_auth_db_config import  db
from src.persistence.models.user_account_model import UserAccount

class UserAccountRepository:
    def validate_credentials(self, email: str, password: str) -> UserAccount | None:
        user = (
            UserAccount.select()
            .where(UserAccount.email == email)
            .first()
        )

        if user and bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            return user
        return None

    def get_user_by_id(self, user_id: int) -> UserAccount | None:
        return (
            UserAccount.select()
            .where(UserAccount.id == user_id)
            .first()
        )

    def create_user(self, email: str, password: str, role: str) -> UserAccount:
        hashed_pass = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        try:
            with db.atomic():
                return UserAccount.create(
                    email=email,
                    password=hashed_pass,
                    role=role
                )
        except IntegrityError as e:
            raise ValueError("Already used email!") from e

    def delete_user(self, user_id: int):
        user = UserAccount.get(UserAccount.id == user_id)

        user.delete_instance()