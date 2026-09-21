import uuid
from datetime import datetime

from sqlalchemy import Column, Integer, DateTime, ForeignKey
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
    employee_id = Column 
    (PG_UUID(as_uuid=True)
     )
    slot_id = Column(PG_UUID(as_uuid=True))
    confirmation_sent_at = Column(DateTime)
    confirmation_expires_at = Column(DateTime)
    confirmed_at = Column(DateTime)

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