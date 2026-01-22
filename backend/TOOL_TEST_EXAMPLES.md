# Tool Call Test Examples

This document provides example queries to test each chatbot tool call. These are natural language queries that users might ask, which should trigger the corresponding tool.

## Emergency & Rescue Tools

### `report_emergency`
**Examples:**
- "I need help! The water is up to my waist and I'm stuck in my house in Marikina"
- "Report emergency: flood level is at roof, 3 people trapped, coordinates 14.6500, 121.1000"
- "SOS! I'm injured and need immediate rescue at Barangay Sto Niño"
- "Emergency: landslide blocking the road, critical situation, location: Quezon City"

### `check_rescue_status`
**Examples:**
- "What's the status of my rescue request?"
- "Has help arrived for my SOS signal?"
- "Check if rescue team has been dispatched for citizen ID abc-123"
- "Is my emergency request being processed?"

---

## Evacuation & Hazards Tools

### `find_evacuation_center`
**Examples:**
- "Where is the nearest safe evacuation center from Marikina?"
- "Find me an evacuation center, I'm at coordinates 14.6500, 121.1000"
- "I need to evacuate from Barangay Sto Niño, where should I go?"
- "What's the safest evacuation route? I can walk there"
- "Find evacuation center near me, I have a vehicle"

### `check_hazard_status`
**Examples:**
- "What hazards are there in Marikina right now?"
- "Check the hazard status at coordinates 14.6500, 121.1000"
- "Are there any verified hazards in my area?"
- "What's the current situation in Quezon City?"
- "Is it safe in Barangay Sto Niño?"

---

## Logistics & Needs Tools

### `log_logistics_request`
**Examples:**
- "I need food and water for my family, we're stranded"
- "Request medicine: I need insulin, priority is critical, location Marikina"
- "Log a request: 5 people need shelter in Quezon City"
- "I need clothing and blankets, quantity 10, location Barangay Hall"
- "Request water, quantity 20 liters, high priority"

### `check_needs_status`
**Examples:**
- "What's the status of my needs ticket NT-20241201-ABC123?"
- "Check all my pending relief requests"
- "Has my food request been fulfilled?"
- "What's the status of ticket number NT-20241201-XYZ789?"

---

## Census & Roll Call Tools

### `update_census_status`
**Examples:**
- "Update my status: I'm safe, headcount 4 people"
- "Census update: status NEED_HELP, 6 people in household, location Marikina"
- "I'm reporting that my family is stranded, 3 people"
- "Update household status: SAFE, 5 members"

### `check_roll_call_status`
**Examples:**
- "What roll calls are active in my area?"
- "Check roll call status for Marikina"
- "Are there any active roll calls I need to respond to?"
- "What's the response rate for roll call RC-20241201-001?"

---

## Health & Monitoring Tools

### `report_health_symptoms`
**Examples:**
- "I'm experiencing fever, cough, and body aches"
- "Report symptoms: diarrhea, vomiting, severe, location Marikina"
- "I have symptoms: headache, dizziness, mild severity"
- "Health report: fever and chills, coordinates 14.6500, 121.1000"

### `check_health_clusters`
**Examples:**
- "Are there any health outbreaks near me?"
- "Check for health clusters in Marikina"
- "What diseases are spreading in my area?"
- "Are there any disease clusters at coordinates 14.6500, 121.1000?"

### `get_water_level`
**Examples:**
- "What's the current water level in Marikina?"
- "Check water level at sensor MAR-001"
- "Get water level readings near coordinates 14.6500, 121.1000"
- "What's the flood water level in my area?"

---

## Incident Tools

### `get_active_incidents`
**Examples:**
- "What active incidents are there right now?"
- "Show me all active floods in Marikina"
- "What typhoons are currently active?"
- "List incidents near coordinates 14.6500, 121.1000"
- "Are there any landslides happening?"

### `report_hazard`
**Examples:**
- "Report hazard: flood blocking the main road, coordinates 14.6500, 121.1000, severity high"
- "There's a landslide at Barangay Sto Niño, description: rocks blocking road"
- "Report debris hazard: fallen trees, location 14.6500, 121.1000, medium severity"
- "Hazard report: damaged bridge, coordinates 14.6400, 121.0900, high severity"

### `check_incident_status`
**Examples:**
- "What's the status of incident INC-20241201-001?"
- "Check incident status for the flood in Marikina"
- "How is the typhoon response going?"
- "What's happening with the earthquake incident?"

---

## Location & Tracking Tools

### `get_citizen_location`
**Examples:**
- "Where am I right now?"
- "Get my last known location"
- "What's my current location?"
- "Show me where citizen ID abc-123 is located"

### `track_family_member`
**Examples:**
- "Where is my family member with ID xyz-789?"
- "Track my daughter, citizen ID abc-123"
- "Is my husband safe? Track citizen ID def-456"
- "Where is my family member right now? ID: ghi-789"

---

## Resource Tools

### `find_available_assets`
**Examples:**
- "Find available boats near Marikina"
- "Are there any vehicles available for rescue?"
- "Find equipment assets in my area"
- "What boats are available at coordinates 14.6500, 121.1000?"

### `find_volunteers`
**Examples:**
- "Find volunteers with medical skills"
- "Are there volunteers available in Barangay Sto Niño?"
- "Find volunteers who can help with rescue operations"
- "Get me volunteers with first aid skills in Marikina"

---

## Notification Tools

### `get_user_notifications`
**Examples:**
- "Show me my notifications"
- "What alerts do I have?"
- "Get my unread notifications"
- "Show me evacuation notifications"
- "What urgent alerts are there for citizen ID abc-123?"

---

## Multi-Tool Scenarios (Complex Queries)

These queries might trigger multiple tools or require the chatbot to use multiple tools in sequence:

1. **"I'm in Marikina and the water is rising. What should I do?"**
   - Should trigger: `check_hazard_status` → `get_water_level` → `find_evacuation_center`

2. **"I need help! I'm injured and stuck in my house with 3 family members"**
   - Should trigger: `report_emergency` → `check_rescue_status`

3. **"What's happening in my area? I'm at coordinates 14.6500, 121.1000"**
   - Should trigger: `check_hazard_status` → `get_active_incidents` → `get_water_level`

4. **"I'm feeling sick with fever and cough. Should I be worried?"**
   - Should trigger: `report_health_symptoms` → `check_health_clusters`

5. **"I need food and water. Also, where can I find volunteers to help?"**
   - Should trigger: `log_logistics_request` → `find_volunteers`

6. **"Update my status as safe, and check if there are any roll calls I need to respond to"**
   - Should trigger: `update_census_status` → `check_roll_call_status`

7. **"Where is my family member? Also check if they have any active SOS signals"**
   - Should trigger: `track_family_member` (which internally checks SOS)

---

## Testing Tips

1. **Test with and without citizen_id**: Some tools work anonymously, others require authentication
2. **Test location parsing**: Try both location names ("Marikina") and coordinates (14.6500, 121.1000)
3. **Test error cases**: 
   - Invalid citizen IDs
   - Missing required parameters
   - Non-existent records
4. **Test edge cases**:
   - Empty database (no records found)
   - Multiple matching records
   - Boundary conditions (coordinates at limits)

## Sample Test Script

You can use these in a Python script or directly in your chatbot API:

```python
test_queries = [
    # Emergency
    "I need help! Water is at my waist in Marikina",
    "What's the status of my rescue request?",
    
    # Evacuation
    "Find me an evacuation center from Marikina",
    "What hazards are in my area?",
    
    # Logistics
    "I need food and water for 5 people",
    "Check status of my needs ticket",
    
    # Health
    "I have fever and cough symptoms",
    "Are there health outbreaks near me?",
    "What's the water level in Marikina?",
    
    # Incidents
    "What active incidents are there?",
    "Report hazard: flood at coordinates 14.6500, 121.1000",
    
    # Location
    "Where am I?",
    "Track my family member with ID abc-123",
    
    # Resources
    "Find available boats",
    "Get volunteers with medical skills",
    
    # Notifications
    "Show me my notifications"
]
```
