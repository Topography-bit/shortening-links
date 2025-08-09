from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from app.links.redisdao import RedisLinksDAO
from app.links.utils import generate_a_short_code
from app.links.dao import LinksDAO

router = APIRouter(tags=['Генерация коротких ссылок'])


@router.post('/short_links')
async def generate_short_link(long_url: str):
    short_code = await generate_a_short_code()
    await LinksDAO.add_links_to_db(short_code, long_url.strip())
    full_url = f'http://localhost:8001/{short_code}'
    return full_url


@router.get('/{short_code}')
async def redirect_short_link(short_code: str):
    url = await RedisLinksDAO.get_link_cached(short_code)
    return RedirectResponse(url=url, status_code=302)