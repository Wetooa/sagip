# Context-Aware Personalization Tool

## Overview

The `get_user_context` tool provides personalized, context-aware recommendations by analyzing the user's complete profile from the database. This enables the chatbot to give advice that's specifically tailored to each user's situation.

## How It Works

When a user asks for advice, plans, or recommendations, the chatbot can call `get_user_context` to:

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
- If family has PWD → Adds: accessibility equipment, assistance contact info
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

## Tool Schema

```python
{
    "name": "get_user_context",
    "description": "Get comprehensive user profile context for personalized advice...",
    "parameters": {
        "citizen_id": "string (required)",
        "query_type": "string (optional, e.g., 'evacuation_bag', 'preparation_plan')"
    }
}
```

## Response Structure

The tool returns a comprehensive context object:

```json
{
    "citizen_id": "...",
    "basic_info": {...},
    "family_profile": {
        "family_size": 4,
        "medical_needs": "diabetes medication",
        "barangay": "Sto Niño",
        ...
    },
    "vulnerability_factors": {
        "has_children": true,
        "has_seniors": true,
        "has_pwd": false,
        "has_pregnant": false,
        "risk_level": "high",
        "risk_score": 0.85
    },
    "health_considerations": {
        "recent_symptoms": ["fever", "cough"],
        "medical_needs": "diabetes medication",
        "has_ongoing_health_issues": true
    },
    "location_context": {...},
    "personalization_notes": [
        "Family includes children - need child-friendly items",
        "Family includes seniors - need mobility assistance",
        "High vulnerability risk - prioritize safety"
    ],
    "recommendations": [
        "Include child-specific items: formula, diapers, toys",
        "Pack extra medications and medical records for seniors",
        "Essential: diabetes medication"
    ]
}
```

## Integration with Chatbot

The chatbot automatically uses this context when:

1. User asks for advice/plans/recommendations
2. User asks "what should I..." questions
3. User asks about preparation or planning
4. User asks about evacuation bags, safety tips, etc.

The LLM receives this context and generates personalized responses that consider:
- Family composition
- Vulnerable sectors
- Health conditions
- Risk level
- Location

## Example Conversation Flow

**User**: "What should I pack in my evacuation bag?"

**Chatbot** (calls `get_user_context`):
- Detects: Family of 4, has 2 children (ages 5, 8), 1 senior (age 72), diabetes medication needed
- Risk level: High

**Chatbot Response**:
"Based on your family profile, here's a personalized evacuation bag checklist:

**For your children (ages 5 & 8):**
- Formula/milk (if still needed)
- Diapers and wipes
- Comfort items (favorite toys, blankets)
- Child identification tags with emergency contacts
- Extra clothes in child sizes

**For your senior family member:**
- All prescribed medications (especially diabetes medication - pack extra!)
- Medical records and doctor's contact info
- Mobility aids if needed (walker, cane)
- Comfortable walking shoes

**For everyone:**
- [Standard items...]

Given your high vulnerability risk, I recommend preparing your evacuation bag now and keeping it easily accessible. Would you like me to help you find the nearest evacuation center or check current hazards in your area?"

## Testing

Test queries that should trigger this tool:
- "What should I pack in my evacuation bag?"
- "How should I prepare for a disaster?"
- "What items do I need for evacuation?"
- "Give me safety tips"
- "What should I do to prepare?"
- "What evacuation bag items do I need?"

All of these should automatically call `get_user_context` to provide personalized recommendations.
