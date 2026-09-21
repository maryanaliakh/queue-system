from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class StartVisitRequest(BaseModel):
    queue_entry_id: UUID
    employee_id: UUID


class FinishVisitRequest(BaseModel):
    visit_id: UUID
    employee_id: UUID


class VisitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    queue_entry_id: UUID
    client_id: UUID
    employee_id: UUID
    service_id: UUID
    status: str
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    actual_duration: Optional[int] = None