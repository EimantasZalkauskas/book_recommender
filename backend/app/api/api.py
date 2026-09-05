from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlmodel import select
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv
import requests
import os

from app.db_models import SessionDep, User, create_db_and_tables

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173/",
    "http://localhost:5173",
    "https://localhost:5173/",
    "https://localhost:5173",
    "localhost:5173"
    "localhost:5173/"
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = 'https://www.googleapis.com/books/v1/volumes?q'


@app.get("/{query}")
def read_root(query:str):
    response = requests.get(f'{BASE_URL}={query}&key={os.getenv('GOOGLE_BOOKS_API')}')
    print(response.status_code)
    return response.json()


# USER ROUTES

@app.get("/users/")
def get_users(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    if not users:
        return {'msg':'No Users In Database'}
    return users

@app.post("/users/add")
def add_users(user: User, session: SessionDep) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.get("/users/{user_id}")
def get_user(user_id: int, session: SessionDep) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, session: SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"ok": True}