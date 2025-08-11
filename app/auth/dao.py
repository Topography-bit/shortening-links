from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Response
from sqlalchemy import func, insert, select
from app.auth.model import Users
from app.auth.schemas import SUserAuth
from app.database.database import async_session_maker
from app.links.model import links


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
        

    @staticmethod
    async def check_link_creation_limit(user_id: int, max_links: int = 5, weeks: int = 1):
        async with async_session_maker() as session:
            week_ago = datetime.now(timezone.utc) - timedelta(days=7)

            query = select(func.count(links.id)).where(links.user_id == user_id).where(links.created_at >= week_ago)

            res = await session.execute(query)

            count = res.scalar()

            if count >= max_links:
                raise HTTPException(
                status_code=429,
                detail=f"Лимит исчерпан: можно создать только {max_links} ссылок в неделю"
            )




