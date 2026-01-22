from app.tools.evacuation import find_evacuation_center, check_hazard_status
from app.tools.rescue import report_emergency, check_rescue_status
from app.tools.logistics import log_logistics_request, check_needs_status
from app.tools.census import update_census_status, check_roll_call_status
from app.tools.health import report_health_symptoms, check_health_clusters, get_water_level
from app.tools.incidents import get_active_incidents, report_hazard, check_incident_status
from app.tools.location import get_citizen_location, track_family_member
from app.tools.resources import find_available_assets, find_volunteers
from app.tools.notifications import get_user_notifications
from app.tools.context import get_user_context
import json
from typing import Any, Dict, Union, Optional
from uuid import UUID

TOOL_REGISTRY = {
    # Emergency & Rescue
    "report_emergency": report_emergency,
    "check_rescue_status": check_rescue_status,
    # Evacuation & Hazards
    "find_evacuation_center": find_evacuation_center,
    "check_hazard_status": check_hazard_status,
    # Logistics & Needs
    "log_logistics_request": log_logistics_request,
    "check_needs_status": check_needs_status,
    # Census & Roll Call
    "update_census_status": update_census_status,
    "check_roll_call_status": check_roll_call_status,
    # Health & Monitoring
    "report_health_symptoms": report_health_symptoms,
    "check_health_clusters": check_health_clusters,
    "get_water_level": get_water_level,
    # Incidents
    "get_active_incidents": get_active_incidents,
    "report_hazard": report_hazard,
    "check_incident_status": check_incident_status,
    # Location & Tracking
    "get_citizen_location": get_citizen_location,
    "track_family_member": track_family_member,
    # Resources
    "find_available_assets": find_available_assets,
    "find_volunteers": find_volunteers,
    # Notifications
    "get_user_notifications": get_user_notifications,
    # Context & Personalization
    "get_user_context": get_user_context,
}

class ToolService:
    def __init__(self):
        from app.core.database import SessionLocal
        self.SessionLocal = SessionLocal
    
    def execute(self, tool_name: str, arguments: Union[Dict[str, Any], str, None], citizen_id: Optional[str] = None):
        if tool_name not in TOOL_REGISTRY:
            raise ValueError(f"Unknown tool: {tool_name}")

        # OpenAI tool call arguments often arrive as a JSON string.
        if arguments is None:
            arguments_dict: Dict[str, Any] = {}
        elif isinstance(arguments, str):
            arguments_dict = json.loads(arguments) if arguments.strip() else {}
        elif isinstance(arguments, dict):
            arguments_dict = arguments
        else:
            raise TypeError(f"Tool arguments must be dict|str|None, got {type(arguments)}")

        # Create database session
        db = self.SessionLocal()
        try:
            # Convert citizen_id to UUID if provided
            citizen_uuid = None
            if citizen_id:
                try:
                    citizen_uuid = UUID(citizen_id) if isinstance(citizen_id, str) else citizen_id
                except (ValueError, TypeError):
                    citizen_uuid = None
            
            # Check if citizen_id is in tool arguments (LLM might provide it)
            # Use it as fallback if user_context doesn't have it
            tool_citizen_id = arguments_dict.get("citizen_id")
            
            # Fallback to tool arguments if user_context didn't provide citizen_id
            if not citizen_uuid and tool_citizen_id:
                try:
                    citizen_uuid = UUID(tool_citizen_id) if isinstance(tool_citizen_id, str) else tool_citizen_id
                except (ValueError, TypeError):
                    citizen_uuid = None
            
            # Remove citizen_id from arguments_dict if present, since we pass it separately
            arguments_dict.pop("citizen_id", None)
            
            print(f"⚙️ Executing tool: {tool_name} with args: {arguments_dict}, citizen_id: {citizen_uuid}")
            return TOOL_REGISTRY[tool_name](db=db, citizen_id=citizen_uuid, **arguments_dict)
        except Exception as e:
            print(f"❌ Error executing tool {tool_name}: {str(e)}")
            raise
        finally:
            db.close()