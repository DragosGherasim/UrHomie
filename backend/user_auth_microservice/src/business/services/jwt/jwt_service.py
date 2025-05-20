import jwt
import datetime
import uuid
from jwt import ExpiredSignatureError, InvalidSignatureError, InvalidTokenError

from src.persistence.models.user_account_model import UserAccount
from src.persistence.repositories.user_account_repo import UserAccountRepository
from src.shared.env_config import Settings

class JwtService:
    def __init__(self, secret_key=Settings.JWT_SECRET_KEY, issuer=Settings.JWT_ISSUER):
        if not secret_key:
            raise RuntimeError("JWT_SECRET_KEY is not set in environment!")
        self.secret_key = secret_key
        self.issuer = issuer
        self.user_repo = UserAccountRepository()

    def generate_token(self, user: UserAccount, expires_in: int = 3600, refresh: bool = False) -> str:
        expiration_time = datetime.datetime.now(datetime.UTC) + datetime.timedelta(seconds=expires_in)
        jti = str(uuid.uuid4())

        payload = {
            "iss": self.issuer,
            "sub": str(user.id),
            "exp": expiration_time,
            "jti": jti,
            "role": user.role,
            "type": "refresh" if refresh else "access"
        }

        return jwt.encode(payload, self.secret_key, algorithm="HS256")

    def validate_token(self, token: str, refresh: bool = False) -> dict:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])

            token_type = payload.get("type", "access")
            if refresh and token_type != "refresh":
                return self._error_response("Expected a refresh token")
            if not refresh and token_type != "access":
                return self._error_response("Expected an access token")

            return {
                "is_valid": True,
                "sub": payload.get("sub", ""),
                "role": payload.get("role", ""),
                "error_message": ""
            }

        except ExpiredSignatureError:
            return self._error_response("Token has expired!")

        except InvalidSignatureError:
            return self._error_response("Invalid token signature!")

        except InvalidTokenError:
            return self._error_response("Invalid token!")

    @staticmethod
    def _error_response(message: str) -> dict:
        return {
            "is_valid": False,
            "sub": "",
            "role": "",
            "error_message": message
        }