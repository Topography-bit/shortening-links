import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.database.config import DATABASE_URL, REDIS_URL


engine = create_async_engine(DATABASE_URL, echo=True)

async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

redis_client = redis.Redis.from_url(REDIS_URL)

Base = declarative_base()