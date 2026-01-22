from app.tools.evacuation import find_evacuation_center
from app.tools.rescue import report_emergency
from app.tools.logistics import log_logistics_request
from app.tools.census import update_census_status
import json
from typing import Any, Dict, Union

TOOL_REGISTRY = {
    "find_evacuation_center": find_evacuation_center,
    "report_emergency": report_emergency,
    "log_logistics_request": log_logistics_request,
    "update_census_status": update_census_status
}

class ToolService:
    def execute(self, tool_name: str, arguments: Union[Dict[str, Any], str, None]):
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

        print(f"⚙️ Executing tool: {tool_name} with args: {arguments_dict}")
        return TOOL_REGISTRY[tool_name](**arguments_dict)