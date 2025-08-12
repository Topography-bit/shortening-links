from datetime import datetime, timedelta, timezone
from os import access
from fastapi import Cookie, HTTPException, Response

from app.auth.utils import create_access_token, decode_jwt


async def refresh_access_tokens(
        response: Response,
        access_token: str | None = Cookie(None, alias='access'), 
        refresh_token: str | None = Cookie(None, alias='refresh')
        ):
    
    if not refresh_token:
        raise HTTPException(status_code=401, detail='Пожалуйста, перезайдите')
    
    payload = decode_jwt(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail='Некорректный payload resresh token')

    token_type = payload.get('type')

    if token_type != 'refresh':
        raise HTTPException(status_code=401, detail='Недействительный тип токена для обновления')

    email = payload.get('email')

    await create_access_token(response, user_email=email)


    return 'Ещё не время обновлять токены'
