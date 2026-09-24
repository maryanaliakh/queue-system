from typing import Optional
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_serializer


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
    # Pola opcjonalne udostępniają ETA i terminy bez zmiany istniejących pól odpowiedzi.
    estimated_wait_time: Optional[int] = None
    delay_time: Optional[int] = None
    estimated_start_at: Optional[datetime] = None
    eta_updated_at: Optional[datetime] = None
    confirmation_sent_at: Optional[datetime] = None
    confirmation_expires_at: Optional[datetime] = None
    confirmed_at: Optional[datetime] = None
    arrival_time: Optional[datetime] = None

    # Jawne UTC zapobiega interpretowaniu terminów jako czasu lokalnego urządzenia.
    @field_serializer("estimated_start_at", "eta_updated_at", "confirmation_sent_at",
                      "confirmation_expires_at", "confirmed_at", "arrival_time")
    def utc_timestamp(self, value):
        return value.isoformat() + "Z" if value else None


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
