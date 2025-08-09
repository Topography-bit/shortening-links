from fastapi import APIRouter, Request

from app.links.utils import generate_a_short_code
from app.links.dao import LinksDAO

router = APIRouter(tags=['Генерация коротких ссылок'])


@router.post('/short_links')
async def generate_short_link(long_url: str):
    short_code = await generate_a_short_code()
    await LinksDAO.add_links_to_db(short_code, long_url)
    return short_code
