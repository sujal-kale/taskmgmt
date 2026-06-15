from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import warnings

# Suppress SQLAlchemy deprecation warnings for Python 3.14 compatibility
warnings.filterwarnings("ignore", category=DeprecationWarning)

from app.database.db import Base, engine
from app.api.routes import router as task_router
from app.api.auth import router as auth_router

# Import models so SQLAlchemy creates tables
from app.models.task import Task
from app.models.user import User

load_dotenv()

app = FastAPI(
    title="Task Manager API",
    description="REST API for Task Management System with JWT Authentication",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

Base.metadata.create_all(bind=engine)

# Build allowed origins from environment and defaults
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add frontend URL from environment
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

# For development: allow specific devtunnels.ms URLs
if os.getenv("ALLOW_DEV_TUNNELS", "true").lower() == "true":
    allowed_origins.extend([
        "https://fnvvx9hm-3000.inc1.devtunnels.ms",
        "https://fnvvx9hm-8000.inc1.devtunnels.ms",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=3600,
)

app.include_router(auth_router)
app.include_router(task_router)

@app.get("/")
def read_root():
    return {
        "message": "Task Manager API with JWT Auth",
        "docs": "/api/docs",
        "version": "2.0.0",
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)},
    )