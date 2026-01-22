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
        print(f"📋 [CHAT SERVICE] user_context: {user_context}")
        print(rag_context)

        system_prompt = f"""
You are a Digital Barangay Tanod assisting people on what to do in the face of natural disasters. Be thorough, empathetic, and helpful.
Ensure to take note of the user profile to get a complete understanding of the user's context, especially in addressing their family needs 
(consider family_size, children or seniors or PWDs) and possible health problems in get_user_context. Tailor the responses to the profile of 
the user and go beyond obvious, surface-level advices. Consider possible problems and backup plans

CRITICAL: When explaining errors or issues, NEVER mention technical terms like:
- "citizen_id", "database", "foreign key", "constraints", "nullable", "API", "endpoint"
- Instead, use natural language like: "account", "profile", "login", "registration", "system"

Always explain things in simple, understandable terms that a regular person would use.

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

RULES:
- Give hotline numbers or local authorities if the location is present
- ALWAYS consider the user's context. Feel free to tool call get_user_context to get the context of teh user's reality
- NO markdown formatting
- NO code blocks
- NO explanations outside the JSON
- NO emojis
- Return ONLY valid JSON, nothing else
- If calling a tool → return type "tool" (handled automatically)
- If normal reply → return type "text"

NOTE:
When a user asks for advice, plans, or recommendations, you can call `get_user_context` to:

1. **Analyze User Profile**: Fetches census data, vulnerability profile, health reports, and location
2. **Identify Vulnerable Sectors**: Detects if the family includes:
   - Children
   - Seniors/Elderly
   - Persons with Disabilities (PWD)
   - Pregnant members
3. **Health Considerations**: Reviews medical needs and recent health symptoms
4. **Risk Assessment**: Considers vulnerability risk level
5. **Generate Recommendations**: Provides personalized suggestions based on all factors

## Example Use Cases

### Example 1: Evacuation Bag Contents

**User Query**: "What should I pack in my evacuation bag?"

**Without Context**: Generic list of items

**With Context Tool**:
- If family has children → Adds: formula, diapers, toys, child identification tags
- If family has seniors → Adds: mobility aids, extra medications, medical records
- If family has PWD → Adds: accessibility equipment, assistance contact info based on location
- If medical needs exist → Adds: specific medications and medical supplies 
- If high vulnerability → Emphasizes: early preparation, priority evacuation

### Example 2: Evacuation Planning

**User Query**: "How should I prepare for evacuation?"

**Context-Aware Response**:
- Family with seniors → "Plan for slower pace, arrange transportation assistance"
- Family with children → "Prepare child-friendly items, practice evacuation route with kids"
- High risk level → "Consider early evacuation, prepare emergency contacts"

### Example 3: Safety Tips

**User Query**: "What safety tips do you have?"

**Context-Aware Response**:
- Based on location (barangay/city) → Location-specific hazards
- Based on vulnerability → Priority safety measures
- Based on health conditions → Health-specific precautions

## Data Sources

The tool analyzes:

1. **CensusData**:
   - Family size
   - Medical needs
   - Address/location
   - Additional info (JSON field that may contain vulnerable sector info)

2. **VulnerabilityProfile**:
   - Risk level (low/medium/high/critical)
   - Risk score
   - Vulnerability factors (JSON)

3. **HealthReport**:
   - Recent symptoms (last 30 days)
   - Health severity
   - Ongoing health issues

4. **LocationHistory**:
   - Last known location
   - Location age


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
            # Extract citizen_id from user_context if available
            citizen_id = user_context.get("citizen_id") or user_context.get("id")
            result = self.tools.execute(
                tool_call.function.name,
                tool_call.function.arguments,
                citizen_id=citizen_id
            )

            # Check if tool returned an error
            if isinstance(result, dict) and result.get("error"):
                # Tool encountered an error - let LLM explain it naturally
                error_context = {
                    "tool_name": tool_call.function.name,
                    "tool_result": result,
                    "original_user_message": user_message
                }
                
                # Create a follow-up message asking LLM to explain the error
                error_explanation_prompt = f"""
The tool '{tool_call.function.name}' was called but encountered an issue. Here's what happened:
{json.dumps(result, indent=2)}

The user originally asked: "{user_message}"

Your task: Explain what went wrong in natural, empathetic, and helpful language. 
- DO NOT mention technical terms like "citizen_id", "database", "constraints", "foreign key", "nullable", "API"
- DO mention what the user needs to do (e.g., "Please log in first", "We need your account information", "Please register an account")
- Be empathetic and helpful - the user is in a stressful situation
- Suggest clear next steps

Respond in the same JSON format as before, with a helpful message explaining the situation and suggesting what the user should do next.
"""

                # Get LLM to explain the error naturally
                error_response = openai.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                        {"role": "assistant", "content": json.dumps({"type": "tool", "tool_call": tool_call.function.name})},
                        {"role": "user", "content": error_explanation_prompt}
                    ],
                    response_format={"type": "json_object"},
                    max_tokens=400,
                    temperature=0.3
                )

                try:
                    error_msg = error_response.choices[0].message.content.strip()
                    error_parsed = json.loads(error_msg)
                    
                    # Ensure required fields
                    if "type" not in error_parsed:
                        error_parsed["type"] = "text"
                    
                    allowed_fields = {"type", "message", "actions", "follow_up_question", "data", "meta"}
                    error_parsed = {k: v for k, v in error_parsed.items() if k in allowed_fields}
                    
                    # Include tool result in data for debugging (but LLM should explain it naturally)
                    if "data" not in error_parsed:
                        error_parsed["data"] = {}
                    error_parsed["data"]["tool_result"] = result
                    
                    response_obj = ChatResponse(**error_parsed)
                    return response_obj.dict()
                except Exception as e:
                    # Fallback if LLM response parsing fails
                    return ChatResponse(
                        type="text",
                        message="I encountered an issue processing your request. Please make sure you're logged in or provide your account information to report emergencies.",
                        actions=[],
                        meta={"confidence": 0.7, "source": ["llm"]}
                    ).dict()

            # Tool executed successfully
            # Let LLM interpret the result in natural language
            tool_result_prompt = f"""
The tool '{tool_call.function.name}' was successfully executed and returned this result:
{json.dumps(result, indent=2)}

The user originally asked: "{user_message}"

Your task: Interpret this result and respond to the user in natural, helpful, and empathetic language.
- Explain what happened in simple terms
- Tell them what they should know
- Suggest what they should do next (if anything)
- Be reassuring and helpful - they may be in a stressful situation
- DO NOT just repeat the raw data - explain it meaningfully

Respond in the same JSON format as before.
"""

            # Get LLM to interpret tool result naturally
            interpretation_response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                    {"role": "assistant", "content": json.dumps({"type": "tool", "tool_call": tool_call.function.name})},
                    {"role": "user", "content": tool_result_prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=400,
                temperature=0.3
            )

            try:
                interpretation_msg = interpretation_response.choices[0].message.content.strip()
                interpretation_parsed = json.loads(interpretation_msg)
                
                # Ensure required fields
                if "type" not in interpretation_parsed:
                    interpretation_parsed["type"] = "text"
                
                allowed_fields = {"type", "message", "actions", "follow_up_question", "data", "meta"}
                interpretation_parsed = {k: v for k, v in interpretation_parsed.items() if k in allowed_fields}
                
                # Include tool result in data
                if "data" not in interpretation_parsed:
                    interpretation_parsed["data"] = {}
                interpretation_parsed["data"]["tool_result"] = result
                
                response_obj = ChatResponse(**interpretation_parsed)
                return response_obj.dict()
            except Exception as e:
                # Fallback if interpretation fails
                response_obj = ChatResponse(
                    type="text",
                    message=f"I've processed your request. {json.dumps(result)}",
                    data={"tool_result": result},
                    meta={"confidence": 0.8, "source": ["tool", "llm"]}
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