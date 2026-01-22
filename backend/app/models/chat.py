from pydantic import BaseModel
from typing import Optional, Dict, Any, Literal, List


class ToolCall(BaseModel):
    name: Optional[str] = None
    arguments: Optional[Dict[str, Any]] = None


class Action(BaseModel):
    text: str
    tool_call: ToolCall


class ChatResponse(BaseModel):
    type: Literal["text", "tool", "error"]
    message: Optional[str] = None
    actions: Optional[List[Action]] = None
    follow_up_question: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    meta: Dict[str, Any] = {
        "confidence": 0.0,
        "source": []
    }
