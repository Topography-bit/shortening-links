


from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DATABASE: str

    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DATABASE: int

    class config:
        case_sensitive = True
        env_file = '.env'

    @property
    def database_url(self):
        return f'postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DATABASE}'
    
    @property
    def redis_url(self):
        return f'redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DATABASE}'
    
settings = Settings()

DATABASE_URL = settings.database_url
REDIS_URL = settings.redis_url