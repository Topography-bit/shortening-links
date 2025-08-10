from fastapi import APIRouter, HTTPException, Response

from app.auth.dao import UserDAO
from app.auth.schemas import SUserAuth
from app.auth.utils import create_access_token, create_refresh_token, hash_pw, verify_pw

router = APIRouter(tags=['Вход и регистрация'])


@router.post('/register')
async def register(user_data: SUserAuth):
    user = await UserDAO.find_user_by_email(email=user_data.email)
    if user:
        raise HTTPException(status_code=401, detail='Вы уже зарегистрированы!')
    
    hashed_password = hash_pw(user_data.password)

    await UserDAO.add_user_to_db(username=user_data.username, email=user_data.email, hashed_password=hashed_password)
    return 'Вы успешно зарегистрировались!'



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
    
    await create_access_token(response, user_data)
    await create_refresh_token(response, user_data)

    return 'Успешный вход'