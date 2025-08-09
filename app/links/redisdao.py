import json
from app.database.database import redis_client
from fastapi import HTTPException
from sqlalchemy import select
from app.links.dao import LinksDAO
from app.links.model import links


class RedisLinksDAO:

    @staticmethod
    async def get_link_cached(short_code: str):
            cached_url = await redis_client.get(short_code)
            if cached_url:
                data = json.loads(cached_url)
                clicks = await LinksDAO.add_click(short_code)
                return data["long_url"]
            
            long_url = await LinksDAO.find_long_url(short_code)
            if not long_url:
                raise HTTPException(status_code=404, detail="Ссылка не найдена")
                
            clicks = await LinksDAO.add_click(short_code)

            clicks_amount = await LinksDAO.how_many_clicks(short_code)

            if clicks_amount >= 5:
                cache_data = {
                    "long_url": long_url,
                    "clicks": clicks
                }
                await redis_client.set(short_code, json.dumps(cache_data), ex=86400)
            return long_url