from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CreateEmployeeRequest(BaseModel):
    user_id: UUID
    institution_id: UUID
    service_ids: list[UUID] = Field(default_factory=list)


class UpdateEmployeeRequest(BaseModel):
    employee_status: Literal["active", "inactive"]
    service_ids: list[UUID]


class EmployeeResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    institution_id: Optional[UUID] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    employee_status: Optional[str] = None
    service_ids: list[UUID]