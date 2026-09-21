from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class JoinQueueRequest(BaseModel):
    user_id: UUID
    service_id: UUID


class CancelQueueRequest(BaseModel):
    user_id: UUID
    queue_entry_id: UUID


class QueueResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    institution_id: Optional[UUID] = None
    service_id: UUID
    client_id: UUID
    queue_position: Optional[int] = None
    status: str


class CancelQueueResponse(BaseModel):
    message: str
    queue_entry_id: UUID
    status: str

class ConfirmQueueRequest(BaseModel):
    user_id: UUID
    queue_entry_id: UUID


class SkipQueueRequest(BaseModel):
    employee_id: UUID
    queue_entry_id: UUID