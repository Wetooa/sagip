"""Shared chatbot endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.communication import ChatbotMessageCreate, ChatbotMessageResponse

router = APIRouter()


@router.post("/message", response_model=ChatbotMessageResponse)
async def send_chatbot_message(message_data: ChatbotMessageCreate, db: Session = Depends(get_db)):
    """Send a message to the AI chatbot."""
    # Placeholder for AI chatbot - use pass as specified
    pass
