

from pathlib import Path
from pydantic import BaseModel


class AuthJWT(BaseModel):
    private_key_path: Path = Path('app/certs/private_key.pem')
    public_key_path: Path = Path('app/certs/public_key.pem')
    algorithm: str = 'RS256'
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30
    verify_token_expire_minutes: int = 10

    @property
    def private_key(self) -> str:
        return self.private_key_path.read_text()

    @property
    def public_key(self) -> str:
        return self.public_key_path.read_text()



auth_jwt = AuthJWT()