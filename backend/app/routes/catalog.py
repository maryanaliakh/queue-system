from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.catalog import Institution, Service
from app.routes.users import get_db
from app.schemas.catalog import InstitutionResponse, ServiceResponse


router = APIRouter(prefix="/api", tags=["Catalog"])


@router.get(
    "/institutions",
    response_model=list[InstitutionResponse],
)
async def get_institutions(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Institution).order_by(Institution.name, Institution.id)
    )
    return result.scalars().all()


@router.get(
    "/services",
    response_model=list[ServiceResponse],
)
async def get_services(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Service).order_by(Service.name, Service.id)
    )
    return result.scalars().all()


@router.get(
    "/institutions/{institution_id}/services",
    response_model=list[ServiceResponse],
)
async def get_institution_services(
    institution_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    institution = await db.get(Institution, institution_id)

    if institution is None:
        raise HTTPException(
            status_code=404,
            detail="Institution not found",
        )

    result = await db.execute(
        select(Service)
        .where(Service.institution_id == institution_id)
        .order_by(Service.name, Service.id)
    )
    return result.scalars().all()