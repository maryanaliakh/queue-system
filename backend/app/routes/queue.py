from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.catalog import Service
from app.models.queue import QueueEntry
from app.models.users import User
from app.routes.users import get_db
from app.schemas.queue import (
    JoinQueueRequest,
    CancelQueueRequest,
    QueueResponse,
    CancelQueueResponse,
)
from datetime import datetime

from app.models.catalog import Institution
from app.models.employees import Employee, EmployeeService
from app.schemas.queue import ConfirmQueueRequest, SkipQueueRequest

router = APIRouter(prefix="/api/queue", tags=["Queue"])

ACTIVE_STATUSES = ("waiting", "confirmed", "in_service")


async def get_active_entries(db: AsyncSession, service_id: UUID):
    result = await db.execute(
        select(QueueEntry)
        .where(
            QueueEntry.service_id == service_id,
            QueueEntry.status.in_(ACTIVE_STATUSES),
        )
        .order_by(QueueEntry.created_at, QueueEntry.id)
    )
    return list(result.scalars().all())


async def lock_service(db: AsyncSession, service_id: UUID):
    result = await db.execute(
        select(Service)
        .where(Service.id == service_id)
        .with_for_update()
    )
    service = result.scalar_one_or_none()

    if service is None:
        raise HTTPException(404, "Service not found")

    return service


@router.post(
    "/join",
    response_model=QueueResponse,
    status_code=201,
)
async def join_queue(
    data: JoinQueueRequest,
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        user = await db.get(User, data.user_id)

        if user is None:
            raise HTTPException(404, "User not found")

        if not user.is_active:
            raise HTTPException(403, "User is inactive")

        # Серіалізуємо зміни черги однієї послуги.
        service = await lock_service(db, data.service_id)

        if not service.is_active:
            raise HTTPException(400, "Service is inactive")

        if service.institution_id is None:
            raise HTTPException(400, "Service has no institution")

        entries = await get_active_entries(db, service.id)

        if any(entry.client_id == data.user_id for entry in entries):
            raise HTTPException(
                409,
                "User already has an active entry for this service",
            )

        if (
            service.max_queue_length is not None
            and len(entries) >= service.max_queue_length
        ):
            raise HTTPException(409, "Queue is full")

        entry = QueueEntry(
            institution_id=service.institution_id,
            service_id=service.id,
            client_id=data.user_id,
            status="waiting",
        )
        db.add(entry)
        await db.flush()

        entries = await get_active_entries(db, service.id)

        for position, item in enumerate(entries, start=1):
            item.queue_position = position

        await db.flush()
        response = QueueResponse.model_validate(entry)

    return response


@router.get(
    "/status/{user_id}",
    response_model=list[QueueResponse],
)
async def get_queue_status(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    user = await db.get(User, user_id)

    if user is None:
        raise HTTPException(404, "User not found")

    # Обчислюємо поточну позицію серед активних записів,
    # перш ніж відфільтрувати записи конкретного користувача.
    from sqlalchemy import func

    ranked = (
        select(
            QueueEntry.id,
            QueueEntry.institution_id,
            QueueEntry.service_id,
            QueueEntry.client_id,
            QueueEntry.status,
            func.row_number().over(
                partition_by=QueueEntry.service_id,
                order_by=(QueueEntry.created_at, QueueEntry.id),
            ).label("queue_position"),
        )
        .where(QueueEntry.status.in_(ACTIVE_STATUSES))
        .subquery()
    )

    result = await db.execute(
        select(ranked)
        .where(ranked.c.client_id == user_id)
        .order_by(ranked.c.service_id)
    )
    return result.mappings().all()


@router.post(
    "/cancel",
    response_model=CancelQueueResponse,
)
async def cancel_queue(
    data: CancelQueueRequest,
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        # Спочатку дізнаємося послугу, не завантажуючи
        # об'єкт запису до отримання блокування.
        service_id = await db.scalar(
            select(QueueEntry.service_id).where(
                QueueEntry.id == data.queue_entry_id,
                QueueEntry.client_id == data.user_id,
            )
        )

        if service_id is None:
            raise HTTPException(404, "Queue entry not found")

        await lock_service(db, service_id)

        result = await db.execute(
            select(QueueEntry)
            .where(
                QueueEntry.id == data.queue_entry_id,
                QueueEntry.client_id == data.user_id,
            )
            .with_for_update()
        )
        entry = result.scalar_one_or_none()

        if entry is None:
            raise HTTPException(404, "Queue entry not found")

        if entry.status != "cancelled":
            if entry.status not in ("waiting", "confirmed"):
                raise HTTPException(
                    409,
                    "This queue entry cannot be cancelled",
                )

            entry.status = "cancelled"
            entry.queue_position = None
            await db.flush()

            entries = await get_active_entries(db, service_id)

            for position, item in enumerate(entries, start=1):
                item.queue_position = position

    return {
        "message": "Queue entry cancelled",
        "queue_entry_id": data.queue_entry_id,
        "status": "cancelled",
    }

async def lock_entry_service(db, queue_entry_id):
    service_id = await db.scalar(
        select(QueueEntry.service_id).where(
            QueueEntry.id == queue_entry_id
        )
    )

    if service_id is None:
        raise HTTPException(404, "Queue entry not found")

    return await lock_service(db, service_id)


async def get_locked_entry(db, queue_entry_id):
    result = await db.execute(
        select(QueueEntry)
        .where(QueueEntry.id == queue_entry_id)
        .with_for_update()
    )
    entry = result.scalar_one_or_none()

    if entry is None:
        raise HTTPException(404, "Queue entry not found")

    return entry


@router.post("/confirm", response_model=QueueResponse)
async def confirm_queue(
    data: ConfirmQueueRequest,
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        await lock_entry_service(db, data.queue_entry_id)
        entry = await get_locked_entry(db, data.queue_entry_id)

        if entry.client_id != data.user_id:
            raise HTTPException(404, "Queue entry not found")

        # Повторний запит не змінює час підтвердження.
        if entry.status == "confirmed":
            return QueueResponse.model_validate(entry)

        if entry.status != "waiting":
            raise HTTPException(
                409, "Only waiting entries can be confirmed"
            )

        now = datetime.utcnow()

        if (
            entry.confirmation_expires_at is not None
            and entry.confirmation_expires_at <= now
        ):
            raise HTTPException(
                409, "Confirmation deadline has expired"
            )

        entry.status = "confirmed"
        entry.confirmed_at = now

        await db.flush()
        response = QueueResponse.model_validate(entry)

    return response


@router.post("/skip", response_model=QueueResponse)
async def skip_queue(
    data: SkipQueueRequest,
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        # Той самий порядок блокувань, що й у visit/start:
        # послуга → працівник → запис черги.
        service = await lock_entry_service(
            db, data.queue_entry_id
        )

        result = await db.execute(
            select(Employee)
            .where(Employee.id == data.employee_id)
            .with_for_update()
        )
        employee = result.scalar_one_or_none()

        if employee is None:
            raise HTTPException(404, "Employee not found")

        if employee.employee_status != "active":
            raise HTTPException(403, "Employee is inactive")

        if (
            service.institution_id is None
            or employee.institution_id != service.institution_id
        ):
            raise HTTPException(
                403, "Employee belongs to another institution"
            )

        assignment_id = await db.scalar(
            select(EmployeeService.id)
            .where(
                EmployeeService.employee_id == employee.id,
                EmployeeService.service_id == service.id,
            )
            .limit(1)
        )

        if assignment_id is None:
            raise HTTPException(
                403, "Employee is not assigned to this service"
            )

        entry = await get_locked_entry(db, data.queue_entry_id)

        if entry.employee_id not in (None, employee.id):
            raise HTTPException(
                403, "Entry belongs to another employee"
            )

        # Повторне пропускання вже пропущеного запису дозволене.
        if entry.status == "skipped":
            return QueueResponse.model_validate(entry)

        if entry.status not in ("waiting", "confirmed"):
            raise HTTPException(
                409, "Only waiting or confirmed entries can be skipped"
            )

        entry.status = "skipped"
        entry.queue_position = None

        await db.flush()

        entries = await get_active_entries(db, service.id)

        for position, item in enumerate(entries, start=1):
            item.queue_position = position

        await db.flush()
        response = QueueResponse.model_validate(entry)

    return response


@router.get(
    "/institution/{institution_id}",
    response_model=list[QueueResponse],
)
async def get_institution_queue(
    institution_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    institution = await db.get(Institution, institution_id)

    if institution is None:
        raise HTTPException(404, "Institution not found")

    # Позиції обчислюються окремо для кожної послуги.
    ranked = (
        select(
            QueueEntry.id,
            QueueEntry.institution_id,
            QueueEntry.service_id,
            QueueEntry.client_id,
            QueueEntry.status,
            func.row_number().over(
                partition_by=QueueEntry.service_id,
                order_by=(QueueEntry.created_at, QueueEntry.id),
            ).label("queue_position"),
        )
        .where(
            QueueEntry.institution_id == institution_id,
            QueueEntry.status.in_(ACTIVE_STATUSES),
        )
        .subquery()
    )

    result = await db.execute(
        select(ranked).order_by(
            ranked.c.service_id,
            ranked.c.queue_position,
        )
    )

    return result.mappings().all()