from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional
import uuid

class MessageBase(SQLModel):
    name: str
    message: str

class Message(MessageBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MessageCreate(MessageBase):
    pass

class MessageRead(MessageBase):
    id: uuid.UUID
    created_at: datetime
