from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

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
async def redirect_short_link(short_code: str, request: Request):
    url = await LinksDAO.find_long_url(short_code)
    if url == None:
        raise HTTPException(status_code=404, detail="Ссылка не найдена")
    return RedirectResponse(url=url, status_code=302)