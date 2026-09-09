from sqlmodel import Field, Relationship, Session, SQLModel, create_engine, select
from typing import Annotated
from uuid import uuid4
from fastapi import Depends
from sqlalchemy import Column, JSON


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


class UserBook(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    book_id: str | None = Field(default=None, foreign_key="book.id", primary_key=True)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    books: list["Book"] = Relationship(back_populates="users", link_model=UserBook)


class Book(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    title: str = Field(index=True, default="")
    subtitle: str | None = Field(default=None)
    authors: list | None = Field(default=None, sa_column=Column(JSON))
    categories: list | None = Field(default=None, sa_column=Column(JSON))
    description: str | None = Field(default=None)
    imageLinks: dict | None = Field(default=None, sa_column=Column(JSON))
    language: str = Field(index=True, default="")
    pageCount: int = Field(index=True, default=0)
    publishingDate: str | None = Field(default=None)
    users: list[User] = Relationship(back_populates="books", link_model=UserBook)

class AddBookRequest(SQLModel):
    user_id: int
    book_obj: Book

class DeleteUserBook(SQLModel):
    user_id: int
    book_id: str

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]