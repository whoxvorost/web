from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime
)
from database import Base
from datetime import datetime
from pytz import UTC


class Doctor(Base):
    __tablename__ = 'doctors'
    doctor_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    description = Column(String)
    price = Column(Integer)
    updated_at = Column(DateTime(timezone=True), default=datetime.now(tz=UTC), onupdate=datetime.now(tz=UTC))
    picture = Column(String)
    