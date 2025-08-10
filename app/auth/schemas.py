from pydantic import BaseModel, EmailStr, Field

class SUserAuth(BaseModel):

    username: str = Field(min_length=3, max_length=20)
    email: EmailStr
    password: str