

from pathlib import Path
from pydantic import BaseModel


class AuthJWT(BaseModel):
    private_key_path: Path = Path('app/certs/private.key')
    public_key_path: Path = Path('app/certs/public.key')
    algorithm: str = 'RS256'
    access_token_expire_minutes: int = 15
    resfresh_token_expire_days: int = 30

auth_jwt = AuthJWT()