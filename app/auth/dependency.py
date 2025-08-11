



from os import access
from fastapi import Cookie, HTTPException, Response
from pydantic import EmailStr

from app.auth.dao import UserDAO
from app.auth.utils import decode_jwt


async def get_current_user(access_token: str | None = Cookie(None, alias='access')):
    if not access_token:
        raise HTTPException(status_code=401, detail='Сначала войдите в аккаунт')
    

    payload = decode_jwt(access_token)

    user_id = payload.get('sub')
    email = payload.get('email')

    if not user_id or not email:
        raise HTTPException(status_code=401, detail="Неверные данные в токене")

    return int(user_id)