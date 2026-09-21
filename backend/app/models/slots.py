import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.database.connection import Base


class ServiceSlot(Base):
    __tablename__ = "service_slots"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    service_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("services.id", ondelete="CASCADE"),
    )
    employee_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("institution_employees.id", ondelete="CASCADE"),
    )
    slot_start = Column(DateTime, nullable=False)
    slot_end = Column(DateTime, nullable=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)