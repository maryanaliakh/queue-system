from fastapi import FastAPI
from app.database.connection import engine
from app.routes.users import router as test_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Backend is work"}

app.include_router(test_router)