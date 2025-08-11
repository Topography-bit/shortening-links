from fastapi import APIRouter, Cookie, HTTPException, Response

from app.auth.dao import UserDAO
from app.auth.redisdao import RedisUsersDAO
from app.auth.refresh_tokens_service import refresh_access_tokens
from app.auth.schemas import SUserAuth
from app.auth.utils import create_access_token, create_refresh_token, create_verify_token, decode_jwt, hash_pw, verify_pw
from app.auth.emailservice import send_verify_email

router = APIRouter(tags=['Вход и регистрация'])


@router.post('/register')
async def register(user_data: SUserAuth, response: Response):
    user_email = await UserDAO.find_user_by_email(email=user_data.email)
    if user_email:
        raise HTTPException(status_code=401, detail='Человек с таким адресом электронной почты уже зарегистрирован')
    
    user_username = await UserDAO.find_user_by_username(username=user_data.username)
    if user_username:
        raise HTTPException(status_code=401, detail='Человек с таким именем уже зарегистрирован!')

    await create_verify_token(response=response, email=user_data.email, username=user_data.username, password=user_data.password)

    await send_verify_email(email_to=user_data.email)

    return f'Код успешно отправлен на ваш почтовый ящик: {user_data.email}'


@router.post('/log_in')
async def login(response: Response, user_data: SUserAuth):
    user = await UserDAO.find_user_by_email(email=user_data.email)
    if not user:
        raise HTTPException(status_code=401, detail='Вы не зарегистрированы!')
    if user.username != user_data.username:
        raise HTTPException(status_code=401, detail='Неверный логин или пароль!')
    
    verify = verify_pw(user_data.password, user.hashed_password)

    if not verify:
        raise HTTPException(status_code=401, detail='Неверный логин или пароль!')
    
    await create_access_token(response, user_data.email)
    await create_refresh_token(response, user_data)

    return 'Успешный вход'

@router.post('/verify_email')
async def verify_email(verification_code: str, verification_token: str | None = Cookie(None, alias='verify')):

    if not verification_token:
        raise HTTPException(status_code=400, detail="Токен верификации не найден. Запросите новый код подтверждения.")

    payload = decode_jwt(verification_token)

    email = payload.get('email')
    password = payload.get('password')
    username = payload.get('username')

    code_in_db_bytes = await RedisUsersDAO.get_verify_code(email_to=email)

    code_in_db = code_in_db_bytes.decode('utf-8')

    if verification_code != code_in_db:
        raise HTTPException(status_code=401, detail="Вы ввели неверный код подтверждения")


    await UserDAO.add_user_to_db(username=username, email=email, hashed_password=password)

    return 'Ваш email успешно подтвержден, вы успешно создали учетную запись! Теперь пожалуйста войдите в нее.'


@router.post('/refresh')
async def refresh_tokens_route(
    response: Response,
    access_token: str = Cookie(None, alias='access'),
    refresh_token: str = Cookie(None, alias='refresh')
):
    return await refresh_access_tokens(response, access_token, refresh_token)