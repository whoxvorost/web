from fastapi import FastAPI, Depends, HTTPException
from fastapi import Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from contextlib import asynccontextmanager
from enum import Enum
from sqlalchemy.sql import or_
from fastapi.middleware.cors import CORSMiddleware


from schemas import Doctor, DoctorBase, DoctorsTotalPrice
from models import Doctor as DoctorModel
from database import get_db
from typing import List
from database import engine
from database import Base


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
        search: str = Query(default=None),
        order_by: OrderClause = Query(default=None),
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
    if order_by:
        if order_by == OrderClause.PRICE:
            query = query.order_by(DoctorModel.price)
        elif order_by == OrderClause.NAME:
            query = query.order_by(DoctorModel.name)
    result = await db_session.execute(query)
    doctors = result.scalars().all()
    return doctors


@app.get("/doctors/sum_total")
async def sum_price(
        doctor_ids: List[int] = Query(),
        db_session: AsyncSession = Depends(get_db)
) -> DoctorsTotalPrice:
    query = select(DoctorModel).where(DoctorModel.doctor_id.in_(doctor_ids))
    result = await db_session.execute(query)
    doctors = result.scalars().all()
    return {"total_price": sum([doctor.price for doctor in doctors])}


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

    await db_session.commit()
    await db_session.refresh(doctor)

    return doctor


