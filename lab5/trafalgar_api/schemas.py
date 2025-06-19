from pydantic import BaseModel
from datetime import datetime
from pydantic import PositiveInt


class DoctorBase(BaseModel):
    name: str
    description: str
    updated_at: datetime
    price: PositiveInt
    picture: str


class Doctor(DoctorBase):
    doctor_id: int


class DoctorsTotalPrice(BaseModel):
    total_price: int
