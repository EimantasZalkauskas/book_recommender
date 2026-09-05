from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Annotated
from fastapi import Depends
from sqlalchemy import Column, JSON


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    books: list | None = Field(default=None, sa_column=Column(JSON))


class Book(SQLModel, table=True):
    id: str | None = Field(default=None, primary_key=True)
    title:str = Field(index=True, default=None)
    subtitle:str | None = Field(index=True, default=None)
    authors:list = Field(sa_column=Column(JSON), default=None)
    categories:list = Field(sa_column=Column(JSON), default=None)
    description:str = Field(index=True, default=None)
    imageLinks:dict | None = Field(sa_column=Column(JSON), default=None)
    language:str = Field(index=True, default=None)
    pageCount:int = Field(index=True, default=None)
    publishingDate:str = Field(index=True, default=None)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]