from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func, null
from app.database.database import Base
from sqlalchemy.orm import relationship

class links(Base):
    __tablename__ = 'links'

    id = Column(Integer, primary_key=True, autoincrement=True)
    short_code = Column(String, unique=True, nullable=False, index=True)
    long_url = Column(String, nullable=False)
    clicks = Column(Integer, default=0)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    created_at = Column(DateTime(timezone=True), default=func.now())

    # user = relationship("Users", back_populates="links")