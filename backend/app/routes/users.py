from fastapi import APIRouter
from app.database.connection import SessionLocal
from app.models.user import User

router = APIRouter()

@router.get("/create-user")
async def create_user():
    async with SessionLocal() as db:

        # test insert
        new_user = User(
            email="test@gmail.com",
            first_name="Mariana"
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        # test select
        result = await db.get(User, new_user.id)

        return {
            "inserted": {
                "id": str(new_user.id),
                "email": new_user.email
            },
            "read_back": {
                "id": str(result.id),
                "email": result.email
            }
        }