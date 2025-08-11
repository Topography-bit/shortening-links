from datetime import datetime, timedelta, timezone
from os import access
from fastapi import Cookie, HTTPException, Response

from app.auth.utils import create_access_token, decode_jwt


async def refresh_access_tokens(
        response: Response,
        access_token: str | None = Cookie(None, alias='access'), 
        refresh_token: str | None = Cookie(None, alias='refresh')
        ):
    
    if not access_token or not refresh_token:
        raise HTTPException(status_code=401, detail='Пожалуйста, перезайдите')
    
    payload = decode_jwt(access_token)


    now = datetime.now(timezone.utc)

    timestamp_expire_access_token = payload.get('exp')
    email = payload.get('email')

    expire_access_token = datetime.fromtimestamp(timestamp_expire_access_token, timezone.utc)

    if now >= expire_access_token - timedelta(minutes=5):
        await create_access_token(response, user_email=email)
        return 'Ваш access токен успешно обновлен'
    
    return 'Ещё не время обновлять токены'
