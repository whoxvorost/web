from pydantic import BaseModel
from datetime import datetime
from pydantic import PositiveInt


class DoctorBase(BaseModel):
    name: str
    description: str
    price: PositiveInt
    picture: str
    country: str
    rate: float

    class Config:
        from_attributes = True


class Doctor(DoctorBase):
    doctor_id: int
    updated_at: datetime

    def __eq__(self, other):
        return (self.doctor_id == other.doctor_id and
                self.name == other.name and
                self.description == other.description and
                self.price == other.price and
                self.picture == other.picture and
                self.country == other.country and
                self.rate == other.rate)



class DoctorsTotalPrice(BaseModel):
    total_price: int


class CartItem(BaseModel):
    id: int
    doctor: Doctor
    doctor_type: str
    quantity: int