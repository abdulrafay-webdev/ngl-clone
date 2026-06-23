from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from app.database import get_session, create_db_and_tables
from app.models import Message, MessageCreate, MessageRead

load_dotenv()

ADMIN_SECRET = os.getenv("ADMIN_SECRET", "Rafay@2005")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup
    create_db_and_tables()
    yield

app = FastAPI(title="Anonymous Messaging API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def verify_admin(authorization: str = Header(None)):
    if authorization != f"Bearer {ADMIN_SECRET}":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin secret",
        )
    return True

@app.post("/api/messages", response_model=MessageRead)
def create_message(message: MessageCreate, session: Session = Depends(get_session)):
    db_message = Message.from_orm(message)
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message

@app.get("/api/messages", response_model=List[MessageRead])
def get_messages(session: Session = Depends(get_session), authenticated: bool = Depends(verify_admin)):
    statement = select(Message).order_by(Message.created_at.desc())
    messages = session.exec(statement).all()
    return messages

@app.delete("/api/messages/{message_id}")
def delete_message(message_id: str, session: Session = Depends(get_session), authenticated: bool = Depends(verify_admin)):
    message = session.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    session.delete(message)
    session.commit()
    return {"message": "Message deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
