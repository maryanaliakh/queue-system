from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=20)
    password: str = Field(min_length=6, max_length=60)
    accept_terms: bool


class RegisterResponse(BaseModel):
    message: str
    user_id: str
    verification_code: str


class LoginRequest(BaseModel):
    login: str
    password: str


class LoginResponse(BaseModel):
    message: str
    user_id: str
    role: str


class ForgotPasswordRequest(BaseModel):
    login: str


class ForgotPasswordResponse(BaseModel):
    message: str
    verification_code: str


class VerifyRequest(BaseModel):
    login: str
    code: str


class VerifyResponse(BaseModel):
    message: str
    user_id: str


class VerifyResetCodeRequest(BaseModel):
    login: str
    code: str


class VerifyResetCodeResponse(BaseModel):
    message: str


class ResetPasswordRequest(BaseModel):
    login: str
    verification_code: str
    new_password: str = Field(min_length=6, max_length=60)


class ResetPasswordResponse(BaseModel):
    message: str