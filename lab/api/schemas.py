from pydantic import BaseModel, PositiveInt
from typing import Optional
from datetime import datetime

class DoctorBase(BaseModel):
    name: str
    description: str
    updated_at: datetime
    price: PositiveInt
    picture: str
    country: Optional[str]  # ← дозволити None
    rate: Optional[float]   # ← дозволити None

class Doctor(DoctorBase):
    doctor_id: int

class DoctorsTotalPrice(BaseModel):
    total_price: int
