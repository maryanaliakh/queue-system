import uuid
from datetime import datetime

from sqlalchemy import Column, Integer, DateTime, ForeignKey, case, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, ENUM

from app.database.connection import Base


class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    institution_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("institutions.id"),
    )
    service_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("services.id"),
    )
    client_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id"),
    )
    # Instancja Column zapewnia mapowanie ORM; samo przypisanie klasy go nie tworzyło.
    employee_id = Column(PG_UUID(as_uuid=True))
    slot_id = Column(PG_UUID(as_uuid=True))
    confirmation_sent_at = Column(DateTime)
    confirmation_expires_at = Column(DateTime)
    confirmed_at = Column(DateTime)
    # Trwały zapis ETA i przybycia pozwala zachować uzgodniony czas po przeliczeniu.
    arrival_time = Column(DateTime)
    estimated_wait_time = Column(Integer)
    delay_time = Column(Integer)
    estimated_start_at = Column(DateTime)
    initial_estimated_start_at = Column(DateTime)
    eta_updated_at = Column(DateTime)
    priority_at = Column(DateTime)

    queue_position = Column(Integer)

    status = Column(
        ENUM(
            "waiting",
            "confirmed",
            "in_service",
            "done",
            "missed",
            "skipped",
            "cancelled",
            name="queue_status",
            create_type=False,
        ),
        default="waiting",
    )

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


def queue_order():
    # Wspólny porządek dla HTTP i WebSocket: obsługiwani, priorytetowi, pozostali.
    return (case((QueueEntry.status == "in_service", 0),
                 (QueueEntry.priority_at.is_not(None), 1), else_=2),
            func.coalesce(QueueEntry.priority_at, QueueEntry.created_at), QueueEntry.id)
