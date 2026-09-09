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

from app.db_models import SessionDep, User, create_db_and_tables, AddBookRequest,Book,UserBook,DeleteUserBook

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


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
def add_users(user_info: User, session: SessionDep):
    existing_user = session.exec(
    select(User).where(User.name == user_info.name)
    ).first()

    if existing_user:
        return {"msg": f"User with name {user_info.name} already exists"}

    user = User(name=user_info.name, books=user_info.books)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@app.get("/users/{user_name}")
def get_user(user_name: str, session: SessionDep) -> User:
    user = session.exec(
        select(User).where(User.name == user_name)
    ).first()
    if user:
        return user
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

@app.delete("/users/{user_id}")
def delete_user(user_id: int, session: SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"ok": True}

@app.get('/user/books/{user_id}')
def get_user_books(user_id, session: SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user.books

@app.delete('/user/delete_book/')
def delete_user_book(request: DeleteUserBook, session: SessionDep):
    user = session.get(User, request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_book = session.exec(
        select(UserBook).where(
            (UserBook.user_id == request.user_id) &
            (UserBook.book_id == request.book_id)
        )
    ).first()
    session.delete(user_book)
    session.commit()

    return {
        "ok": True,
        "user_id": request.user_id,
        "book_id": request.book_id,
    }



# BOOKS ROUTES


@app.post('/books/add')
def add_book(request: AddBookRequest, session: SessionDep):
    user = session.get(User, request.user_id)
    print(user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_book = session.exec(
        select(Book).where(Book.title == request.book_obj.title)
    ).first()

    if not existing_book:
        book_data = request.book_obj.model_dump(exclude={"id"})
        existing_book = Book(**book_data)
        session.add(existing_book)
        session.commit()
        session.refresh(existing_book)

    if existing_book in user.books:
        raise HTTPException(status_code=409, detail='Book already added')

    user.books.append(existing_book)
    session.add(user)
    session.commit()
    session.refresh(user)
    return {
        "message": "Book added",
        "user_id": user.id,
        "book_id": existing_book.id,
        "book_ids": [book.id for book in user.books],
    }
    