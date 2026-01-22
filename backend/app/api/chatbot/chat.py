from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chat_service import ChatService
from app.models.chat import ChatResponse

router = APIRouter()
chat_service = ChatService()

class ChatRequest(BaseModel):
    message: str
    user_context: dict = {}

@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest):
    result = chat_service.handle_message(req.message, req.user_context)
    return ChatResponse(**result)