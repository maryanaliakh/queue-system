import asyncio
import logging
import uuid

from datetime import date, datetime, time, timedelta
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import SessionLocal
from app.models.users import User
from app.models.catalog import Institution, Service
from app.models.employees import Employee
from app.routes.users import get_db


router = APIRouter()
logger = logging.getLogger(__name__)


class SendNotificationRequest(BaseModel):
    user_id: UUID
    title: str = Field(min_length=1, max_length=255)
    message: str = Field(min_length=1, max_length=5000)

    @field_validator("title", "message", mode="before")
    @classmethod
    def strip_text(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


async def notification_list(db, user_id, limit=50, offset=0):
    result = await db.execute(
        text("""
            SELECT id, user_id, title, message, is_read, created_at
            FROM notifications
            WHERE user_id = :user_id
            ORDER BY created_at DESC NULLS LAST, id DESC
            LIMIT :limit OFFSET :offset
        """),
        {
            "user_id": user_id,
            "limit": limit,
            "offset": offset,
        },
    )
    return [dict(row) for row in result.mappings().all()]



QUEUE_SQL = """
    WITH ranked AS (
        SELECT
            id,
            institution_id,
            service_id,
            client_id,
            status,
            ROW_NUMBER() OVER (
                PARTITION BY service_id
                ORDER BY created_at, id
            ) AS queue_position
        FROM queue_entries
        WHERE status IN ('waiting', 'confirmed', 'in_service')
    )
    SELECT * FROM ranked
"""


async def queue_snapshot(db, target_id, for_user=False):
    if for_user:
        sql = QUEUE_SQL + """
            WHERE client_id = :target_id
            ORDER BY service_id, queue_position
        """
    else:
        sql = QUEUE_SQL + """
            WHERE service_id = :target_id
            ORDER BY queue_position
        """

    result = await db.execute(
        text(sql), {"target_id": target_id}
    )
    return [dict(row) for row in result.mappings().all()]
@router.post(
    "/api/notifications/send",
    tags=["Notifications"],
    status_code=201,
)
async def send_notification(
    data: SendNotificationRequest,
    db: AsyncSession = Depends(get_db),
):
    async with db.begin():
        user = await db.get(User, data.user_id)

        if user is None:
            raise HTTPException(404, "User not found")

        result = await db.execute(
            text("""
                INSERT INTO notifications (
                    id, user_id, title, message, is_read, created_at
                )
                VALUES (
                    :id, :user_id, :title, :message, false, :created_at
                )
                RETURNING
                    id, user_id, title, message, is_read, created_at
            """),
            {
                "id": uuid.uuid4(),
                "user_id": data.user_id,
                "title": data.title,
                "message": data.message,
                "created_at": datetime.utcnow(),
            },
        )
        notification = dict(result.mappings().one())

    return notification


@router.get(
    "/api/notifications/{user_id}",
    tags=["Notifications"],
)
async def get_notifications(
    user_id: UUID,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    if await db.get(User, user_id) is None:
        raise HTTPException(404, "User not found")

    return await notification_list(db, user_id, limit, offset)

async def stream_snapshots(websocket, event_type, loader):
    await websocket.accept()

    async def send_updates():
        previous = None

        while True:
            # Нова коротка сесія на кожне читання.
            async with SessionLocal() as db:
                payload = await loader(db)

            encoded = jsonable_encoder(payload)

            if encoded != previous:
                await websocket.send_json({
                    "type": event_type,
                    "data": encoded,
                })
                previous = encoded

            await asyncio.sleep(2)

    async def wait_for_disconnect():
        while True:
            # Канал лише для читання стану.
            # Повідомлення клієнта не змінюють базу.
            await websocket.receive_text()

    tasks = [
        asyncio.create_task(send_updates()),
        asyncio.create_task(wait_for_disconnect()),
    ]

    try:
        done, _ = await asyncio.wait(
            tasks,
            return_when=asyncio.FIRST_COMPLETED,
        )

        for task in done:
            task.result()

    except (WebSocketDisconnect, OSError):
        pass

    except Exception:
        logger.exception("WebSocket stream failed")

        try:
            await websocket.close(code=1011)
        except (RuntimeError, OSError):
            pass

    finally:
        for task in tasks:
            task.cancel()

        await asyncio.gather(*tasks, return_exceptions=True)


@router.websocket("/ws/queue/{service_id}")
async def queue_websocket(
    websocket: WebSocket,
    service_id: UUID,
):
    async with SessionLocal() as db:
        service = await db.get(Service, service_id)

        if service is None:
            await websocket.close(code=1008)
            return

    async def load(db):
        return await queue_snapshot(db, service_id)

    await stream_snapshots(
        websocket,
        "queue_snapshot",
        load,
    )


@router.websocket("/ws/user/{user_id}")
async def user_websocket(
    websocket: WebSocket,
    user_id: UUID,
):
    async with SessionLocal() as db:
        user = await db.get(User, user_id)

        if user is None:
            await websocket.close(code=1008)
            return

    async def load(db):
        return {
            "notifications": await notification_list(
                db, user_id, limit=50
            ),
            "queue": await queue_snapshot(
                db, user_id, for_user=True
            ),
        }

    await stream_snapshots(
        websocket,
        "user_snapshot",
        load,
    )

    VISIT_STATISTICS_SQL = """
    SELECT
        COUNT(*) AS total_visits,

        COUNT(*) FILTER (
            WHERE v.status = 'done'
        ) AS done_visits,

        COUNT(*) FILTER (
            WHERE v.status = 'cancelled'
        ) AS cancelled_visits,

        COUNT(*) FILTER (
            WHERE v.status = 'in_service'
        ) AS in_service_visits,

        AVG(v.actual_duration) FILTER (
            WHERE v.status = 'done'
        ) AS average_visit_minutes,

        COALESCE(
            SUM(v.actual_duration) FILTER (
                WHERE v.status = 'done'
            ),
            0
        ) AS completed_duration_minutes

    FROM visits AS v
    LEFT JOIN services AS s ON s.id = v.service_id

    WHERE v.actual_start >= :day_start
      AND v.actual_start < :day_end
"""


async def visit_statistics(
    db,
    selected_date,
    target_id,
    for_employee=False,
):
    day_start = datetime.combine(selected_date, time.min)
    day_end = day_start + timedelta(days=1)

    if for_employee:
     sql = VISIT_STATISTICS_SQL = """
            AND v.employee_id = :target_id
        """
    else:
     sql = VISIT_STATISTICS_SQL + """
            AND s.institution_id = :target_id
        """

    result = await db.execute(
        text(sql),
        {
            "day_start": day_start,
            "day_end": day_end,
            "target_id": target_id,
        },
    )
    stats = dict(result.mappings().one())

    if stats["average_visit_minutes"] is not None:
        stats["average_visit_minutes"] = round(
            float(stats["average_visit_minutes"]), 2
        )

    return stats


@router.get("/api/reports/daily", tags=["Reports"])
async def daily_report(
    institution_id: UUID,
    report_date: date | None = None,
    db: AsyncSession = Depends(get_db),
):
    if await db.get(Institution, institution_id) is None:
        raise HTTPException(404, "Institution not found")

    selected_date = report_date or datetime.utcnow().date()

    stats = await visit_statistics(
        db,
        selected_date,
        institution_id,
    )

    return {
        "institution_id": institution_id,
        "report_date": selected_date,
        "timezone": "UTC",
        **stats,
    }


@router.get(
    "/api/statistics/employee/{employee_id}",
    tags=["Statistics"],
)
async def employee_statistics(
    employee_id: UUID,
    report_date: date | None = None,
    db: AsyncSession = Depends(get_db),
):
    if await db.get(Employee, employee_id) is None:
        raise HTTPException(404, "Employee not found")

    selected_date = report_date or datetime.utcnow().date()

    stats = await visit_statistics(
        db,
        selected_date,
        employee_id,
        for_employee=True,
    )

    return {
        "employee_id": employee_id,
        "report_date": selected_date,
        "timezone": "UTC",
        **stats,
    }
