# Quick Tool Test Reference

## One-Liner Test Queries

### Emergency & Rescue
- `report_emergency`: "I need help! Water is at my waist in Marikina"
- `check_rescue_status`: "What's the status of my rescue request?"

### Evacuation & Hazards  
- `find_evacuation_center`: "Find evacuation center from Marikina"
- `check_hazard_status`: "What hazards are in Marikina?"

### Logistics & Needs
- `log_logistics_request`: "I need food and water for 5 people"
- `check_needs_status`: "Check my needs ticket status"

### Census & Roll Call
- `update_census_status`: "Update status: I'm safe, 4 people"
- `check_roll_call_status`: "What roll calls are active?"

### Health & Monitoring
- `report_health_symptoms`: "I have fever and cough"
- `check_health_clusters`: "Are there health outbreaks near me?"
- `get_water_level`: "What's the water level in Marikina?"

### Incidents
- `get_active_incidents`: "What active incidents are there?"
- `report_hazard`: "Report flood hazard at 14.6500, 121.1000"
- `check_incident_status`: "Status of incident INC-001?"

### Location & Tracking
- `get_citizen_location`: "Where am I?"
- `track_family_member`: "Where is family member ID abc-123?"

### Resources
- `find_available_assets`: "Find available boats"
- `find_volunteers`: "Get volunteers with medical skills"

### Notifications
- `get_user_notifications`: "Show my notifications"

---

## Test via API

```bash
# Example POST request
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help! Water is at my waist in Marikina",
    "user_context": {
      "citizen_id": "your-citizen-id-here"
    }
  }'
```

## Test via Python

```python
import requests

response = requests.post(
    "http://localhost:8000/api/chat",
    json={
        "message": "I need help! Water is at my waist in Marikina",
        "user_context": {
            "citizen_id": "your-citizen-id-here"
        }
    }
)
print(response.json())
```
