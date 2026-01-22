from app.services.rag_service import RAGService
from app.services.tool_service import ToolService
from app.services.openai_tools import OPENAI_TOOLS_SCHEMA
from app.services.rag_formatter import format_rag_context
from app.models.chat import ChatResponse
import openai
import json


class ChatService:
    def __init__(self):
        self.rag = RAGService()
        self.tools = ToolService()

    def handle_message(self, user_message: str, user_context: dict):
        retrieved = self.rag.retrieve(user_message)
        rag_context = format_rag_context(retrieved)
        print(rag_context)

        system_prompt = f"""
You are a Digital Barangay Tanod assisting people on what to do in the face of natural disasters. Be thorough, empathetic, and helpful.
Ensure to take note of the user profile to get a complete understanding of the user's context.

CRITICAL INSTRUCTION:
You MUST respond in PURE JSON using this exact schema:

{{
  "type": "text", 
  "message": "string (optional short summary)",
  "actions": [
    {{
      "text": "string - suggested action or recommendation",
      "tool_call": {{
        "name": "string | null",
        "arguments": "object | null"
      }}
    }}
  ],
  "follow_up_question": "string | null",

  "meta": {{
    "confidence": 0.9,
    "source": ["kb", "llm"]
  }}
}}

REQUIRED FIELDS:
- "type": MUST be "text" for normal responses, "tool" is handled automatically
- "message": Optional short summary (can be null or empty string)
- "actions": Array of action objects (can be empty array [])
- "meta": Object with "confidence" (0.0-1.0) and "source" (array of strings)

ACTION OBJECT STRUCTURE:
- "text": Suggested action or recommendation
- "tool_call": Object with "name" (string or null) and "arguments" (object or null)

TOP-LEVEL FIELDS:
- "follow_up_question": Optional follow-up question (string or null) - goes at the root level, not inside actions

Rules:
- NO markdown formatting
- NO code blocks
- NO explanations outside the JSON
- NO emojis
- Return ONLY valid JSON, nothing else
- If calling a tool → return type "tool" (handled automatically)
- If normal reply → return type "text"

User profile:
{user_context}

Verified Knowledge:
{rag_context}
"""

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            tools=OPENAI_TOOLS_SCHEMA,
            tool_choice="auto",
            response_format={"type": "json_object"},
            max_tokens=400,
            temperature=0.2
        )

        msg = response.choices[0].message

        if msg.tool_calls:
            tool_call = msg.tool_calls[0]
            result = self.tools.execute(
                tool_call.function.name,
                tool_call.function.arguments
            )

            response_obj = ChatResponse(
                type="tool",
                message=f"Tool {tool_call.function.name} executed",
                data=result,
                meta={"confidence": 0.95, "source": ["tool"]}
            )

            return response_obj.dict()

        # ---- TEXT PATH ----
        try:
            raw = msg.content.strip()
            parsed = json.loads(raw)
            
            # Ensure required 'type' field exists
            if "type" not in parsed:
                parsed["type"] = "text"
            
            # Remove any unexpected fields that aren't in ChatResponse schema
            allowed_fields = {"type", "message", "actions", "follow_up_question", "data", "meta"}
            parsed = {k: v for k, v in parsed.items() if k in allowed_fields}

            response_obj = ChatResponse(**parsed)
            return response_obj.dict()

        except Exception as e:
            # Fallback guard if LLM violates schema
            return ChatResponse(
                type="error",
                message="Response formatting error",
                data={"raw_output": msg.content, "error": str(e)},
                meta={"confidence": 0.1, "source": ["llm"]}
            ).dict()