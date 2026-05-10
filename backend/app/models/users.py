from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, ENUM
import uuid
from datetime import datetime

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    email = Column(String(60), unique=True)
    phone = Column(String(20), unique=True)

    password_hash = Column(String(255), nullable=False)

    role = Column(
        ENUM(
            "client",
            "employee",
            "admin",
            name="user_role",
            create_type=False
        ),
        nullable=False,
        default="client"
    )

    language = Column(
        ENUM(
            "pl",
            "en",
            name="language_type",
            create_type=False
        ),
        nullable=False,
        default="en"
    )

    first_name = Column(String(40))
    last_name = Column(String(40))

    profile_image = Column(Text)

    is_verified = Column(Boolean, default=False)
    verification_code = Column(String(4))

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)