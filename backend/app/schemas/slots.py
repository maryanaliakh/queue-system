from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    field_validator,
    model_validator,
)


class SlotTimeRequest(BaseModel):
    slot_start: datetime
    slot_end: datetime
    is_available: bool

    @field_validator("slot_start", "slot_end")
    @classmethod
    def normalize_time(cls, value):
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError(
                "Specify a timezone, for example +03:00 or Z"
            )

        return value.astimezone(timezone.utc).replace(tzinfo=None)

    @model_validator(mode="after")
    def validate_interval(self):
        if self.slot_end <= self.slot_start:
            raise ValueError("slot_end must be after slot_start")

        if self.slot_start <= datetime.utcnow():
            raise ValueError("slot_start must be in the future")

        return self


class CreateSlotRequest(SlotTimeRequest):
    service_id: UUID
    employee_id: UUID


class UpdateSlotRequest(SlotTimeRequest):
    pass


class SlotResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    service_id: Optional[UUID] = None
    employee_id: Optional[UUID] = None
    slot_start: datetime
    slot_end: datetime
    is_available: Optional[bool] = None

    @field_validator("slot_start", "slot_end")
    @classmethod
    def mark_utc(cls, value):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value