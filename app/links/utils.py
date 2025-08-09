import random
import string
from app.links.dao import LinksDAO

def generate_a_short_code(length: int = 8) -> str:
    chars = string.ascii_letters + string.digits
    attempts = 0
    max_attempts = 15

    while attempts < max_attempts:
        short_code = "".join(random.choice(chars) for _ in range(length))
        is_unique = LinksDAO.check_unique_short_code(short_code)

        if is_unique == True:
            return short_code

    raise ValueError(f'Не удалось сгенерировать код за {max_attempts} попыток')