from sqlalchemy import select
from app.database.database import async_session_maker
from app.links.model import links


class LinksDAO:

    @staticmethod
    async def check_unique_short_code(short_code: str) -> bool:
        async with async_session_maker() as session:
            query = select(links).where(links.c.short_code == short_code)
            res = await session.execute(query)
            existing_link = res.scalar_one_or_none()
            return existing_link is None