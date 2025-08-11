from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Response
from passlib.context import CryptContext
from pydantic import EmailStr
from app.auth.auth import auth_jwt
import jwt

from app.auth.dao import UserDAO
from app.auth.schemas import SUserAuth


pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_pw(password: str) -> str:
    return pwd_context.hash(password)

def verify_pw(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)

TOKEN_TYPE = 'type'
ACCESS_TOKEN = 'access'
REFRESH_TOKEN = 'refresh'
VERIFY_TOKEN = 'verify'

def encode_jwt(token_type: str, payload = dict, private_key: str = auth_jwt.private_key, algorithm=auth_jwt.algorithm):
    to_encode = payload.copy()
    now = datetime.now(timezone.utc)

    if token_type == ACCESS_TOKEN:
        expire = now + timedelta(minutes=auth_jwt.access_token_expire_minutes)
    elif token_type == REFRESH_TOKEN:
        expire = now + timedelta(days=auth_jwt.refresh_token_expire_days)
    elif token_type == VERIFY_TOKEN:
        expire = now + timedelta(minutes=auth_jwt.verify_token_expire_minutes)


    to_encode.update(
        exp=expire,
        iat=now,
        type=token_type
    )

    encoded = jwt.encode(
        payload=to_encode,
        key=private_key,
        algorithm=algorithm
    )
    return encoded


async def create_jwt(token_data: dict, token_type: str):
    payload = {TOKEN_TYPE: token_type}
    payload.update(token_data)
    return encode_jwt(token_type=token_type, payload=payload)

async def create_access_token(response: Response, user_email: EmailStr):
    user = await UserDAO.find_user_by_email(user_email)
    if not user:
        raise HTTPException(status_code=401, detail='Вы не зарегистрированы!')
    payload = {
        'sub': str(user.id),
        'email': user.email,
        'username': user.username,
    }
    token = await create_jwt(token_data=payload, token_type=ACCESS_TOKEN)
    response.set_cookie(
        key='access',
        value=token,
        httponly=True,
        max_age=900
    )


async def create_refresh_token(response: Response, user_data: SUserAuth):
    user = await UserDAO.find_user_by_email(user_data.email)
    if not user:
        raise HTTPException(status_code=401, detail='Вы не зарегистрированы!')
    payload = {
        'sub': str(user.id),
        'email': user.email,
        'username': user.username,
    }
    token = await create_jwt(token_data=payload, token_type=REFRESH_TOKEN)
    response.set_cookie(
        key='refresh',
        value=token,
        httponly=True,
        max_age=2592000
    )

async def create_verify_token(response: Response, email: EmailStr, username: str, password: str):

    hashed_pw = hash_pw(password)

    payload = {
        'email': email,
        'username': username,
        'password': hashed_pw,
        'purpose': 'email_verification'
    }
    token = await create_jwt(token_data=payload, token_type=VERIFY_TOKEN)
    response.set_cookie(
        key='verify',
        value=token,
        httponly=True,
        max_age=600
    )


def decode_jwt(token: str, public_key: str = auth_jwt.public_key, algorithm: str = auth_jwt.algorithm):
    try:
        decoded = jwt.decode(
            token,
            key=public_key,
            algorithms=[algorithm]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Время действия токена истекло")
    return decoded


