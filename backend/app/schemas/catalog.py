from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class InstitutionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class ServiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    institution_id: Optional[UUID] = None
    name: str
    description: Optional[str] = None
    standard_duration: int
    max_queue_length: Optional[int] = None
    is_active: Optional[bool] = None