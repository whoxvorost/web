from fastapi import FastAPI, Depends, HTTPException
from fastapi import Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from contextlib import asynccontextmanager
from enum import Enum
from sqlalchemy.sql import or_
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

from schemas import Doctor, DoctorBase, DoctorsTotalPrice, CartItem
from models import Doctor as DoctorModel
from database import get_db
from typing import List
from database import engine
from database import Base
from datetime import datetime
from pytz import UTC


async def on_startup():
    async with engine.begin() as conn:
        # Create all tables based on the models in the Base
        await conn.run_sync(Base.metadata.create_all)


async def on_shutdown():
    pass


@asynccontextmanager
async def lifespan(app_: FastAPI):
    await on_startup()
    yield
    await on_shutdown()


app = FastAPI(prefix="/api", tags=["api"], lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    **{
        "allow_origins": ["*"],
        "allow_credentials": True,
        "allow_methods": ["*"],
        "allow_headers": ["*"]
    }
)


class OrderClause(str, Enum):
    PRICE = "price"
    NAME = "name"



@app.get("/doctors", response_model=List[Doctor])
async def get_doctors(
        search: Optional[str] = Query(default=None),
        price_le: Optional[int] = Query(default=None),
        country: Optional[str] = Query(default=None),
        rate_ge: Optional[float] = Query(default=None),
        order_by: OrderClause = Query(default=OrderClause.PRICE),
        db_session: AsyncSession = Depends(get_db)
) -> List[Doctor]:
    query = select(DoctorModel)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                DoctorModel.name.ilike(search_term),
                DoctorModel.description.ilike(search_term)
            )
        )
    if price_le:
        query = query.where(DoctorModel.price <= price_le)
    if country:
        query = query.where(DoctorModel.country == country)
    if rate_ge:
        query = query.where(DoctorModel.rate >= rate_ge)
    if order_by == OrderClause.PRICE:
        query = query.order_by(DoctorModel.price)
    elif order_by == OrderClause.NAME:
        query = query.order_by(DoctorModel.name)
    result = await db_session.execute(query)
    doctors = result.scalars().all()
    return doctors

@app.get("/doctors/sumto")
async def sum_price(
        doctor_ids: Optional[List[int]] = Query(default=[]),
        db_session: AsyncSession = Depends(get_db)
) -> DoctorsTotalPrice:
    query = select(DoctorModel).where(DoctorModel.doctor_id.in_(doctor_ids))
    result = await db_session.execute(query)
    doctors = result.scalars().all()
    return {"total_price": sum([doctor.price for doctor in doctors])}

@app.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(
        doctor_id: int,
        db_session: AsyncSession = Depends(get_db)
) -> Doctor:
    query = select(DoctorModel).where(DoctorModel.doctor_id == doctor_id)
    result = await db_session.execute(query)
    doctor = result.scalar_one_or_none()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor




@app.post("/doctors", response_model=Doctor)
async def create_doctor(
        doctor_base: DoctorBase,
        db_session: AsyncSession = Depends(get_db)
) -> Doctor:
    new_doctor = DoctorModel(**doctor_base.dict())
    db_session.add(new_doctor)
    await db_session.commit()
    await db_session.refresh(new_doctor)  # Refresh to get the generated ID
    return new_doctor


@app.delete("/doctors/{doctor_id}", response_model=str)
async def delete_doctor(
        doctor_id: int,
        db_session: AsyncSession = Depends(get_db)
) -> str:
    query = select(DoctorModel).where(DoctorModel.doctor_id == doctor_id)
    result = await db_session.execute(query)
    doctor = result.scalar_one_or_none()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    await db_session.delete(doctor)
    await db_session.commit()

    return "Doctor deleted successfully"


@app.put("/doctors/{doctor_id}", response_model=Doctor)
async def update_doctor(
        doctor_id: int,
        doctor_base: DoctorBase,
        db_session: AsyncSession = Depends(get_db)
) -> Doctor:
    query = select(DoctorModel).where(DoctorModel.doctor_id == doctor_id)
    result = await db_session.execute(query)
    doctor = result.scalar_one_or_none()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Update the doctor's details
    for key, value in doctor_base.dict().items():
        setattr(doctor, key, value)
    doctor.updated_at = datetime.now(tz=UTC)

    await db_session.commit()
    await db_session.refresh(doctor)

    return doctor


@app.get("/countries")
async def get_countries(db_session: AsyncSession = Depends(get_db)) -> List[str]:
    query = select(DoctorModel)
    result = await db_session.execute(query)
    doctors = result.scalars().all()
    return list(set([doctor.country for doctor in doctors]))



cart: List[CartItem] = []


def get_max_cart_item_id() -> int:
    ids = [cart_item.id for cart_item in cart]
    if not ids:
        return 1
    return max(ids) + 1


def check_collision(doctor: Doctor, quantity, doctor_type) -> bool:
    for cart_item in cart:
        if doctor == cart_item.doctor and doctor_type == cart_item.doctor_type:
            return True
    return False


@app.get("/cart")
async def get_cart(
) -> List[CartItem]:
    return cart


@app.post("/cart")
async def add_cart(
        doctor_id: int = Query(),
        quantity: int = Query(),
        doctor_type: str = Query(),
        db_session: AsyncSession = Depends(get_db)
) -> CartItem:
    doctor = await get_doctor(doctor_id, db_session)
    cart_item = CartItem(id=get_max_cart_item_id(), doctor=Doctor.model_validate(doctor), doctor_type=doctor_type, quantity=quantity)
    for cart_item in cart:
        if cart_item.doctor == doctor and cart_item.doctor_type == doctor_type:
            cart_item.quantity += quantity
            break
    else:
        cart.append(cart_item)
    return cart_item


@app.delete("/cart/{item_index}")
async def delete(item_index: int) -> None:
    for cart_item in cart:
        if cart_item.id == item_index:
            cart.remove(cart_item)
            return
    else:
        raise HTTPException(status_code=404, detail="Cart item not found")
