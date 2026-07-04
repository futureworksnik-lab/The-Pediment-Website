"""
The Pediment — minimal backend shim.

This project ships as a pure static site (see /app/frontend/public/). All real
form-handling, validation, and data-storage logic lives in the Supabase Edge
Function documented in deliverables/BACKEND-HANDOFF.md — this FastAPI process
is kept alive only to satisfy the platform's supervisor contract and carries
no application logic of its own.
"""
from fastapi import FastAPI, APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"status": "ok", "service": "the-pediment-static-shim"}


app.include_router(api_router)
