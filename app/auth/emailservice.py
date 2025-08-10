import random
import string
from pydantic import EmailStr
from redis import Redis
from app.auth.redisdao import RedisUsersDAO
from app.database.config import settings
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig


conf = ConnectionConfig(
    MAIL_USERNAME=settings.EMAIL_USER,
    MAIL_PASSWORD=settings.EMAIL_PASSWORD,
    MAIL_FROM=settings.EMAIL_FROM,
    MAIL_PORT=settings.EMAIL_PORT,
    MAIL_SERVER=settings.EMAIL_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

def generate_verify_code(length: int = 8):
    chars = string.ascii_letters + string.digits
    short_code = ''.join(random.choice(chars) for _ in range(length))
    return short_code



async def send_verify_email(email_to: EmailStr):

    verification_code = generate_verify_code()

    await RedisUsersDAO.set_verify_code(email_to, verification_code)

    message = MessageSchema(
        subject='Подтверждение регистрации',
        recipients=[email_to],
        body=f'Ваш код подтверждения: {verification_code}',
        subtype='html'
    )

    fm = FastMail(conf)
    await fm.send_message(message)    