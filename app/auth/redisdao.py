import json

from pydantic import EmailStr
from app.auth.schemas import SUserAuth
from app.database.database import redis_client
from fastapi import HTTPException



class RedisUsersDAO:
    @staticmethod
    async def set_verify_code(email_to: EmailStr, verify_code: str):
        await redis_client.set(email_to, verify_code, ex=600)

    @staticmethod
    async def get_verify_code(email_to: EmailStr):
        res = await redis_client.get(email_to)
        if not res:
            raise HTTPException(status_code=401, detail='Код подтверждения не найден или истёк')
        return res
    
    