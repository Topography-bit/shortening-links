



# from fastapi import HTTPException
# from sqlalchemy import select
# from app.links.dao import LinksDAO
# from app.links.model import links


# class RedisLinksDAO:

#     @staticmethod
#     async def get_link_cached(short_code: str):
#         async with redis_client() as redis_client:

#             select(links).where 

#             long_url = redis_client.get(short_code)
#             if not long_url:
#                 long_url = await LinksDAO.find_long_url(short_code)
#                 if not long_url:
#                     raise HTTPException(status_code=404, detail="Ссылка не найдена")