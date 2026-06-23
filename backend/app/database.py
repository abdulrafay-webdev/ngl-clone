from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# echo=False in production to avoid log noise, defaults to True for local testing if needed
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
engine = create_engine(DATABASE_URL, echo=DEBUG)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
