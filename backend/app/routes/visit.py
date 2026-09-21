from datetime import datetime
from math import ceil

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.queue import QueueEntry
from app.models.visit import Visit
from app.routes.users import get_db
from app.routes.queue import lock_service, get_active_entries
from app.schemas.visit import (
    StartVisitRequest,
    FinishVisitRequest,
    VisitResponse,
)


router = APIRouter(prefix="/api/visit", tags=["Visit"])


async def lock_employee(db, employee_id):
    result = await db.execute(
        text("""
            SELECT id, institution_id, user_id, employee_status
            FROM institution_employees
            WHERE id = :employee_id
            FOR UPDATE
        """),
        {"employee_id": employee_id},
    )
    employee = result.mappings().first()

    if employee is None:
        raise HTTPException(404, "Employee not found")

    return employee


@router.post(
    "/start",
    response_model=VisitResponse,
    status_code=201,
)
async def start_visit(
    data: StartVisitRequest,
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        service_id = await db.scalar(
            select(QueueEntry.service_id).where(
                QueueEntry.id == data.queue_entry_id
            )
        )

        if service_id is None:
            raise HTTPException(404, "Queue entry not found")

        # Усі зміни спочатку блокують послугу,
        # потім працівника та запис черги.
        service = await lock_service(db, service_id)
        employee = await lock_employee(db, data.employee_id)

        if not service.is_active:
            raise HTTPException(409, "Service is inactive")

        if employee["employee_status"] != "active":
            raise HTTPException(409, "Employee is inactive")

        if employee["institution_id"] != service.institution_id:
            raise HTTPException(
                409, "Employee belongs to another institution"
            )

        allowed = await db.scalar(
            text("""
                SELECT EXISTS (
                    SELECT 1
                    FROM employee_services
                    WHERE employee_id = :employee_id
                      AND service_id = :service_id
                )
            """),
            {
                "employee_id": data.employee_id,
                "service_id": service_id,
            },
        )

        if not allowed:
            raise HTTPException(
                409, "Employee is not assigned to this service"
            )

        result = await db.execute(
            select(QueueEntry)
            .where(QueueEntry.id == data.queue_entry_id)
            .with_for_update()
        )
        entry = result.scalar_one_or_none()

        if entry is None:
            raise HTTPException(404, "Queue entry not found")

        if entry.status not in ("waiting", "confirmed"):
            raise HTTPException(
                409, "Queue entry is not ready for a visit"
            )

        if entry.employee_id not in (None, data.employee_id):
            raise HTTPException(
                409, "Queue entry belongs to another employee"
            )

        existing_visit = await db.scalar(
            select(Visit.id)
            .where(Visit.queue_entry_id == entry.id)
            .limit(1)
        )

        if existing_visit is not None:
            raise HTTPException(
                409, "Visit already exists for this queue entry"
            )

        busy = await db.scalar(
            select(Visit.id)
            .where(
                Visit.employee_id == data.employee_id,
                Visit.status == "in_service",
            )
            .limit(1)
        )

        if busy is not None:
            raise HTTPException(
                409, "Employee already has an active visit"
            )

        visit = Visit(
            queue_entry_id=entry.id,
            client_id=entry.client_id,
            employee_id=data.employee_id,
            service_id=service.id,
            actual_start=datetime.utcnow(),
            standard_duration=service.standard_duration,
            status="in_service",
        )

        entry.status = "in_service"
        entry.employee_id = data.employee_id

        db.add(visit)
        await db.flush()

        response = VisitResponse.model_validate(visit)

    return response


async def finish_visit(db, data, target_status):
    async with db.begin():
        # Беремо тільки ідентифікатори, а актуальний
        # об'єкт візиту читаємо після блокувань.
        result = await db.execute(
            select(Visit.service_id, Visit.queue_entry_id)
            .where(Visit.id == data.visit_id)
        )
        ids = result.first()

        if ids is None:
            raise HTTPException(404, "Visit not found")

        if ids.service_id is None or ids.queue_entry_id is None:
            raise HTTPException(409, "Visit has incomplete links")

        await lock_service(db, ids.service_id)
        await lock_employee(db, data.employee_id)

        result = await db.execute(
            select(QueueEntry)
            .where(QueueEntry.id == ids.queue_entry_id)
            .with_for_update()
        )
        entry = result.scalar_one_or_none()

        result = await db.execute(
            select(Visit)
            .where(Visit.id == data.visit_id)
            .with_for_update()
        )
        visit = result.scalar_one_or_none()

        if visit is None:
            raise HTTPException(404, "Visit not found")

        if visit.employee_id != data.employee_id:
            raise HTTPException(
                403, "Visit belongs to another employee"
            )

        if entry is None:
            raise HTTPException(409, "Queue entry is missing")

        # Повторення тієї самої операції не змінює час.
        if visit.status == target_status:
            if entry.status != target_status:
                raise HTTPException(
                    409, "Visit and queue statuses do not match"
                )
            return VisitResponse.model_validate(visit)

        if visit.status != "in_service":
            raise HTTPException(409, "Visit is not in progress")

        if entry.status != "in_service":
            raise HTTPException(
                409, "Queue entry is not in service"
            )

        if visit.actual_start is None:
            raise HTTPException(409, "Visit start time is missing")

        now = datetime.utcnow()
        elapsed = (now - visit.actual_start).total_seconds()

        visit.actual_end = now
        visit.actual_duration = max(0, ceil(elapsed / 60))
        visit.status = target_status

        entry.status = target_status
        entry.queue_position = None

        await db.flush()

        entries = await get_active_entries(db, ids.service_id)

        for position, item in enumerate(entries, start=1):
            item.queue_position = position

        await db.flush()
        response = VisitResponse.model_validate(visit)

    return response


@router.post("/end", response_model=VisitResponse)
async def end_visit(
    data: FinishVisitRequest,
    db: AsyncSession = Depends(get_db),
):
    return await finish_visit(db, data, "done")


@router.post("/cancel", response_model=VisitResponse)
async def cancel_visit(
    data: FinishVisitRequest,
    db: AsyncSession = Depends(get_db),
):
    return await finish_visit(db, data, "cancelled")