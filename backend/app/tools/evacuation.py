import random

EVAC_CENTERS = [
    {"name": "Marikina Sports Center", "distance_km": 1.2},
    {"name": "Barangay Hall - Sto Niño", "distance_km": 0.8},
    {"name": "Quezon City Memorial Circle", "distance_km": 3.4},
    {"name": "San Mateo Gymnasium", "distance_km": 2.1},
]

def find_evacuation_center(location: str, transport_mode: str = "walking"):
    center = random.choice(EVAC_CENTERS)

    route = {
        "from_location": location,
        "center_name": center["name"],
        "distance_km": center["distance_km"],
        "eta_minutes": int(center["distance_km"] / (4 if transport_mode == "walking" else 25) * 60),
        "instructions": [
            "Head north on your main road",
            "Turn right at the nearest barangay hall",
            "Follow evacuation signage",
            f"Arrive at {center['name']}"
        ]
    }

    print("🧭 [EVAC TOOL CALLED]", route)
    return route