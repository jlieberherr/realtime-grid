from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Row(BaseModel):
    id: Optional[str] = Field(default_factory=str)
    name: str
    value: int
