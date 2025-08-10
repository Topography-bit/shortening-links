from fastapi import Response
from sqlalchemy import insert, select
from app.auth.model import Users
from app.auth.schemas import SUserAuth
from app.database.database import async_session_maker


class UserDAO:

    @staticmethod
    async def find_user_by_email(email: str):
        async with async_session_maker() as session:
            query = select(Users).where(Users.email == email)
            res = await session.execute(query)
            return res.scalar_one_or_none()
        
    @staticmethod
    async def add_user_to_db(username: str, email: str, hashed_password: str):
        async with async_session_maker() as session:
            query = insert(Users).values(
                username=username,
                email=email,
                hashed_password=hashed_password
            )
            await session.execute(query)
            await session.commit()

    @staticmethod
    async def find_user_by_username(username: str):
        async with async_session_maker() as session:
            query = select(Users).where(Users.username == username)
            res = await session.execute(query)
            return res.scalar_one_or_none()