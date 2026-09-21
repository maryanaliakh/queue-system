import uuid
from datetime import datetime

from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, ENUM

from app.database.connection import Base


class Visit(Base):
    __tablename__ = "visits"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    queue_entry_id = Column(PG_UUID(as_uuid=True))
    client_id = Column(PG_UUID(as_uuid=True))
    employee_id = Column(PG_UUID(as_uuid=True))
    service_id = Column(PG_UUID(as_uuid=True))

    planned_start = Column(DateTime)
    planned_end = Column(DateTime)
    actual_start = Column(DateTime)
    actual_end = Column(DateTime)

    standard_duration = Column(Integer)
    actual_duration = Column(Integer)
    delay_duration = Column(Integer)

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