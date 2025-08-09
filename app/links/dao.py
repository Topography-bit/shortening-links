from datetime import datetime, timezone
from sqlalchemy import insert, select
from app.database.database import async_session_maker
from app.links.model import links


class LinksDAO:

    @staticmethod
    async def check_unique_short_code(short_code: str) -> bool:
        async with async_session_maker() as session:
            query = select(links).where(links.short_code == short_code)
            res = await session.execute(query)
            existing_link = res.scalar_one_or_none()
            return existing_link is None
        
        
    @staticmethod
    async def add_links_to_db(short_code: str, long_url: str, clicks: int = 0):
        async with async_session_maker() as session:
            now = datetime.now(timezone.utc).replace(tzinfo=None)
            query = insert(links).values(
                short_code=short_code,
                long_url=long_url,
                clicks=clicks,
                created_at=now
            )
            await session.execute(query)
            await session.commit()

    @staticmethod
    async def find_long_url(short_code: str):
        async with async_session_maker() as session:
            query = select(links.long_url).where(links.short_code == short_code)
            res = await session.execute(query)
            return res.scalar_one_or_none()
        
    # @staticmethod
    # async def how_many_clicks(