from fastapi import FastAPI

from app.links.router import router as links_router


app = FastAPI()

app.include_router(links_router)