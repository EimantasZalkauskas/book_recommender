from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from dotenv import load_dotenv
import requests
import os

load_dotenv(Path(__file__).resolve().parents[1] / ".env")





app = FastAPI()

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


