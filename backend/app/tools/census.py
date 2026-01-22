from datetime import datetime

# In-memory mock DB (resets on restart)
CENSUS_DB = {}

def update_census_status(
    household_id: str,
    status: str,
    headcount: int = 1
):
    record = {
        "household_id": household_id,
        "status": status,
        "headcount": headcount,
        "last_updated": datetime.utcnow().isoformat()
    }

    CENSUS_DB[household_id] = record

    print("📋 [CENSUS TOOL CALLED]", record)
    return record