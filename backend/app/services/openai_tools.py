OPENAI_TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "report_emergency",
            "description": "Report a critical emergency requiring immediate rescue.",
            "parameters": {
                "type": "object",
                "properties": {
                    "injury_type": {"type": "string", "enum": ["none", "minor", "critical"]},
                    "flood_level": {"type": "string", "enum": ["ankle", "waist", "roof"]},
                    "people_count": {"type": "integer"}
                },
                "required": ["flood_level"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "find_evacuation_center",
            "description": "Finds the nearest safe evacuation center based on hazard data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "transport_mode": {"type": "string", "enum": ["walking", "vehicle"]}
                },
                 "required": ["location"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "log_logistics_request",
            "description": "Log a request for relief goods.",
            "parameters": {
                "type": "object",
                "properties": {
                    "item": {"type": "string"},
                    "quantity": {"type": "integer"},
                    "location": {"type": "string"}
                },
                "required": ["item", "quantity"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_census_status",
            "description": "Update household status for roll call and vulnerability profiling.",
            "parameters": {
                "type": "object",
                "properties": {
                    "household_id": {"type": "string"},
                    "status": {"type": "string", "enum": ["SAFE", "NEED_HELP"]},
                    "headcount": {"type": "integer"}
                },
                "required": ["household_id", "status"]
            }
        }
    }
]