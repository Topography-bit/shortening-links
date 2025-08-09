from sqlalchemy import Column, DateTime, Integer, String, null
from app.database.database import Base


class links(Base):
    __tablename__ = 'links'

    id = Column(Integer, primary_key=True, autoincrement=True)
    short_code = Column(String, unique=True, nullable=False)
    long_url = Column(String, nullable=False)
    clicks = Column(Integer, default=0)
    created_at = Column(DateTime)