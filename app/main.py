from fastapi import FastAPI

from app.links.router import router as links_router
from app.auth.router import router as auth_router

app = FastAPI()

app.include_router(links_router)
app.include_router(auth_router)