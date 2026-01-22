"""OpenAI function calling tool schemas for the chatbot."""
OPENAI_TOOLS_SCHEMA = [
    # ========== EMERGENCY & RESCUE ==========
    {
        "type": "function",
        "function": {
            "name": "report_emergency",
            "description": "Report a critical emergency requiring immediate rescue. Creates an SOS signal in the database and links it to active incidents if found.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "Location name or address"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"},
                    "incident_type": {"type": "string", "enum": ["typhoon", "flood", "landslide", "earthquake", "other"], "description": "Type of incident"},
                    "severity": {"type": "string", "enum": ["low", "medium", "high", "critical"], "description": "Severity level"},
                    "message": {"type": "string", "description": "Additional details about the emergency"},
                    "injury_type": {"type": "string", "enum": ["none", "minor", "critical"], "description": "Type of injury if any"},
                    "flood_level": {"type": "string", "enum": ["ankle", "waist", "roof"], "description": "Flood water level"},
                    "people_count": {"type": "integer", "description": "Number of people affected"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_rescue_status",
            "description": "Check the status of a rescue request. Can query by citizen_id (latest SOS) or specific sos_signal_id.",
            "parameters": {
                "type": "object",
                "properties": {
                    "sos_signal_id": {"type": "string", "description": "SOS signal ID to check"},
                    "citizen_id": {"type": "string", "description": "Citizen ID to check latest SOS signal"}
                },
                "required": []
            }
        }
    },
    # ========== EVACUATION & HAZARDS ==========
    {
        "type": "function",
        "function": {
            "name": "find_evacuation_center",
            "description": "Finds the nearest safe evacuation center based on current hazards, water levels, and active incidents. Considers user's vulnerability profile if available.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "Location name or address"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"},
                    "transport_mode": {"type": "string", "enum": ["walking", "vehicle"], "description": "Mode of transportation", "default": "walking"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_hazard_status",
            "description": "Check current hazard status for a location including verified hazards, water levels, and active incidents.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "Location name or address"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"}
                },
                "required": []
            }
        }
    },
    # ========== LOGISTICS & NEEDS ==========
    {
        "type": "function",
        "function": {
            "name": "log_logistics_request",
            "description": "Create a needs ticket for relief goods (food, water, medicine, shelter, clothing). Checks for duplicates and matches with available resources.",
            "parameters": {
                "type": "object",
                "properties": {
                    "need_type": {"type": "string", "enum": ["medicine", "food", "water", "shelter", "clothing", "other"], "description": "Type of need"},
                    "description": {"type": "string", "description": "Detailed description of the need"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "critical"], "description": "Priority level"},
                    "location": {"type": "string", "description": "Location where help is needed"},
                    "item": {"type": "string", "description": "Item name (alternative to need_type)"},
                    "quantity": {"type": "integer", "description": "Quantity needed"}
                },
                "required": ["need_type", "description", "location", "item", "quantity"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_needs_status",
            "description": "Check the status of needs tickets. Can query by citizen_id (all tickets) or specific ticket_number.",
            "parameters": {
                "type": "object",
                "properties": {
                    "ticket_number": {"type": "string", "description": "Needs ticket number to check"},
                    "citizen_id": {"type": "string", "description": "Citizen ID to check all their tickets"}
                },
                "required": []
            }
        }
    },
    # ========== CENSUS & ROLL CALL ==========
    {
        "type": "function",
        "function": {
            "name": "update_census_status",
            "description": "Update or create census data and respond to active roll calls. Updates household status and vulnerability profile.",
            "parameters": {
                "type": "object",
                "properties": {
                    "citizen_id": {"type": "string", "description": "Citizen ID (required)"},
                    "status": {"type": "string", "enum": ["SAFE", "NEED_HELP", "STRANDED"], "description": "Current status"},
                    "headcount": {"type": "integer", "description": "Number of people in household"},
                    "location": {"type": "string", "description": "Current location"},
                    "household_id": {"type": "string", "description": "Household identifier"}
                },
                "required": ["citizen_id", "status"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_roll_call_status",
            "description": "Check active roll calls and response statistics. Can query by roll_call_id, location, or get all active roll calls.",
            "parameters": {
                "type": "object",
                "properties": {
                    "roll_call_id": {"type": "string", "description": "Specific roll call ID to check"},
                    "location": {"type": "string", "description": "Location to check for active roll calls"},
                    "citizen_id": {"type": "string", "description": "Citizen ID to check their response status"}
                },
                "required": []
            }
        }
    },
    # ========== HEALTH & MONITORING ==========
    {
        "type": "function",
        "function": {
            "name": "report_health_symptoms",
            "description": "Report health symptoms and check for nearby health clusters. Creates an anonymized health report.",
            "parameters": {
                "type": "object",
                "properties": {
                    "symptoms": {"type": "array", "items": {"type": "string"}, "description": "List of symptoms"},
                    "severity": {"type": "string", "enum": ["mild", "moderate", "severe"], "description": "Severity of symptoms"},
                    "location": {"type": "string", "description": "Location where symptoms occurred"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"}
                },
                "required": ["symptoms"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_health_clusters",
            "description": "Check for active health outbreak clusters in an area. Returns cluster details, affected counts, and medical dispatch status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "Location name or address"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_water_level",
            "description": "Get current water level readings from sensors. Can query by sensor_id, location coordinates, or citizen's last known location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "Location name or address"},
                    "sensor_id": {"type": "string", "description": "Specific sensor ID"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"}
                },
                "required": []
            }
        }
    },
    # ========== INCIDENTS ==========
    {
        "type": "function",
        "function": {
            "name": "get_active_incidents",
            "description": "Get active incidents (typhoon, flood, landslide, earthquake). Can filter by location and incident type.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "Location name or address"},
                    "incident_type": {"type": "string", "enum": ["typhoon", "flood", "landslide", "earthquake", "other"], "description": "Filter by incident type"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "report_hazard",
            "description": "Report a crowdsourced hazard (flood, landslide, debris, damage). Creates a hazard report that needs verification.",
            "parameters": {
                "type": "object",
                "properties": {
                    "hazard_type": {"type": "string", "enum": ["flood", "landslide", "debris", "damage", "other"], "description": "Type of hazard"},
                    "latitude": {"type": "number", "description": "Latitude coordinate (required)"},
                    "longitude": {"type": "number", "description": "Longitude coordinate (required)"},
                    "description": {"type": "string", "description": "Detailed description of the hazard"},
                    "severity": {"type": "string", "enum": ["low", "medium", "high"], "description": "Severity level"}
                },
                "required": ["latitude", "longitude"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_incident_status",
            "description": "Check detailed status of an incident including SOS signals, rescue dispatches, and roll calls. Can query by incident_id or location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "incident_id": {"type": "string", "description": "Incident ID to check"},
                    "location": {"type": "string", "description": "Location to find nearest incident"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"}
                },
                "required": []
            }
        }
    },
    # ========== LOCATION & TRACKING ==========
    {
        "type": "function",
        "function": {
            "name": "get_citizen_location",
            "description": "Get the current or last known location of a citizen. Returns location history, predicted location, and device status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "citizen_id": {"type": "string", "description": "Citizen ID to get location for"},
                    "target_citizen_id": {"type": "string", "description": "Alternative parameter for target citizen ID"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "track_family_member",
            "description": "Track a family member's location and device status. Includes recent movements and SOS signal status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "target_citizen_id": {"type": "string", "description": "Family member's citizen ID (required)"},
                    "citizen_id": {"type": "string", "description": "Your citizen ID"}
                },
                "required": ["target_citizen_id"]
            }
        }
    },
    # ========== RESOURCES ==========
    {
        "type": "function",
        "function": {
            "name": "find_available_assets",
            "description": "Find available assets (boats, vehicles, equipment) for disaster response. Can filter by asset type and location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "asset_type": {"type": "string", "enum": ["boat", "vehicle", "equipment", "other"], "description": "Type of asset"},
                    "location": {"type": "string", "description": "Location name or address"},
                    "latitude": {"type": "number", "description": "Latitude coordinate"},
                    "longitude": {"type": "number", "description": "Longitude coordinate"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "find_volunteers",
            "description": "Find available volunteers with specific skills or in a specific barangay. Returns volunteer contact information and skills.",
            "parameters": {
                "type": "object",
                "properties": {
                    "skills": {"type": "array", "items": {"type": "string"}, "description": "List of required skills"},
                    "barangay": {"type": "string", "description": "Barangay name to filter volunteers"}
                },
                "required": []
            }
        }
    },
    # ========== NOTIFICATIONS ==========
    {
        "type": "function",
        "function": {
            "name": "get_user_notifications",
            "description": "Get notifications for a user. Can filter by notification type and read status. Returns urgent alerts separately.",
            "parameters": {
                "type": "object",
                "properties": {
                    "citizen_id": {"type": "string", "description": "Citizen ID (required)"},
                    "notification_type": {"type": "string", "enum": ["alert", "evacuation", "roll_call", "aid", "general"], "description": "Filter by notification type"},
                    "unread_only": {"type": "boolean", "description": "Only return unread notifications", "default": False}
                },
                "required": ["citizen_id"]
            }
        }
    },
    # ========== CONTEXT & PERSONALIZATION ==========
    {
        "type": "function",
        "function": {
            "name": "get_user_context",
            "description": "Get comprehensive user profile context for personalized advice and recommendations. Use this when users ask for advice, plans, or recommendations (e.g., 'What should I pack?', 'How should I prepare?', 'What evacuation bag items do I need?'). This tool analyzes the user's family profile, vulnerability factors (children, seniors, disabilities), health conditions, and location to provide context-aware responses.",
            "parameters": {
                "type": "object",
                "properties": {
                    "citizen_id": {"type": "string", "description": "Citizen ID (required)"},
                    "query_type": {"type": "string", "description": "Type of query/advice being requested (e.g., 'evacuation_bag', 'preparation_plan', 'safety_tips')", "default": "general_advice"}
                },
                "required": ["citizen_id"]
            }
        }
    }
]
