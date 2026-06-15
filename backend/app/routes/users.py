import random
import hashlib

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import SessionLocal
from app.models.users import User
from app.schemas.users import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    VerifyRequest,
    VerifyResponse,
    ResetPasswordRequest,
    ResetPasswordResponse
)


router = APIRouter(prefix="/api/auth", tags=["Auth"])

# # Test endpoint for checking database connection
# @router.get("/create-user")
# async def create_user():
#     async with SessionLocal() as db:

#         new_user = User(
#             email=f"test{random.randint(1,99999)}@gmail.com",
#             first_name="Mariana",
#             last_name="Test",
#             password_hash="test123",
#             role="client",
#             language="en",
#             is_verified=False,
#             verification_code="1234",
#             is_active=True
#         )
# # Add user to the database
#         db.add(new_user)
#         await db.commit()

#         # Refresh object after saving
#         await db.refresh(new_user)

#         return {
#             "message": "User created",
#             "id": str(new_user.id),
#             "email": new_user.email
#         }


async def get_db():
    async with SessionLocal() as db:
        yield db


# Hash user password before storing it in the database
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Generate a 4-digit verification code
def generate_verification_code() -> str:
    return str(random.randint(1000, 9999))


# Endpoint register
@router.post("/register", response_model=RegisterResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    conditions = []

    if data.email:
        conditions.append(User.email == data.email)

    if data.phone:
        conditions.append(User.phone == data.phone)

    result = await db.execute(select(User).where(or_(*conditions)))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    verification_code = generate_verification_code()
    # Create new user object
    new_user = User(
        email=data.email,
        phone=data.phone,
        password_hash=hash_password(data.password),
        role="client",
        language="en",
        is_verified=False,
        verification_code=verification_code,
        is_active=True
    )
# Save&refresh
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": str(new_user.id),
        "verification_code": verification_code
    }
def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash


#Endpoint Login
@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(
            or_(User.email == data.login, User.phone == data.login)
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid login or password")

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid login or password")

    return {
        "message": "Login successful",
        "user_id": str(user.id),
        "role": user.role
    }

@router.post("/verify", response_model=VerifyResponse)
async def verify(data: VerifyRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(
            or_(User.email == data.login, User.phone == data.login)
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.verification_code != data.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    user.is_verified = True
    user.verification_code = None

    await db.commit()
    await db.refresh(user)

    return {
        "message": "User verified successfully",
        "user_id": str(user.id)
    }


# Endpoint reset-password
@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(
            or_(User.email == data.login, User.phone == data.login)
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = hash_password(data.new_password)

    await db.commit()

    return {
        "message": "Password reset successfully"
    }

