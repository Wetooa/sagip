class KnowledgeBase:
    """
    Comprehensive Knowledge Base for Philippine Disaster Resilience (RAG Source).
    Sources: NDRRMC, PAGASA, PHIVOLCS, DOH, RA 10121.
    """

    # ------------------------------------------------------------------
    # PRODUCTS: Specific Survival Items & Localized Context
    # ------------------------------------------------------------------
    PRODUCTS = [
        # --- Survival & Sustenance ---
        {
            "id": 1, 
            "name": "72-Hour Ligtas Tas (Standard)", 
            "desc": "The 'Go-Bag'. Must contain: 3L water/person, MREs/biscuits (SkyFlakes), flashlight, whistle, AM radio, power bank, and waterproof document pouch.",
            "category": "Survival"
        },
        {
            "id": 2, 
            "name": "Aquatabs / Water Purification Tablets", 
            "desc": "Sodium Dichloroisocyanurate tablets. 1 tablet treats 20L of flood/tap water. Wait 30 mins. Critical for post-typhoon water disruption.",
            "category": "Sanitation"
        },
        {
            "id": 3, 
            "name": "Malong / Thermal Blanket", 
            "desc": "Versatile fabric used as a blanket, changing room, baby sling, or stretcher. Essential for privacy in crowded evacuation centers.",
            "category": "Shelter"
        },
        
        # --- Medical & Hygiene ---
        {
            "id": 4, 
            "name": "Leptospirosis Prophylaxis Kit", 
            "desc": "Contains Doxycycline capsules (requires prescription/DOH distribution). To be taken within 24-72 hours of exposure to flood waters.",
            "category": "Medical"
        },
        {
            "id": 5, 
            "name": "Dignity Kit (Women/Children)", 
            "desc": "Specific hygiene kit containing sanitary napkins, underwear, soap, toothbrush, and laundry detergent to maintain hygiene in shelters.",
            "category": "Sanitation"
        },
        
        # --- Tech & Comms ---
        {
            "id": 6, 
            "name": "Dynamo/Crank Radio", 
            "desc": "Battery-free radio to monitor AM frequencies (DZBB 594, DZMM 630) when power grids (Meralco/NGCP) fail.",
            "category": "Communication"
        },
        {
            "id": 7, 
            "name": "E-Balde (Emergency Bucket)", 
            "desc": "Waterproof bucket containing photocopies of Land Titles, PSA Birth Certificates, PhilHealth ID, Insurance policies, and cash in small denominations.",
            "category": "Documentation"
        }
    ]

    # ------------------------------------------------------------------
    # FAQS: Scenarios, Procedures, and Specific Protocols
    # ------------------------------------------------------------------
    FAQS = [
        # --- Weather & Floods (PAGASA) ---
        {
            "q": "What is the difference between Yellow, Orange, and Red Rainfall Warnings?", 
            "a": "YELLOW: Monitor. Heavy rain (7.5-15mm). Flooding possible in low areas. ORANGE: Alert. Intense rain (15-30mm). Flooding is threatening. RED: Evacuate. Torrential rain (>30mm). Severe flooding expected. Move to high ground immediately."
        },
        {
            "q": "What does Signal No. 4 and 5 mean?", 
            "a": "Signal No. 4: Winds 118-184 kph (Typhoon). Heavy structural damage expected. Signal No. 5: Winds >185 kph (Super Typhoon). Catastrophic damage. Widespread power/comms failure. Storm surges >3 meters possible."
        },
        {
            "q": "What is a Storm Surge?", 
            "a": "Abnormal rise in sea level due to strong winds (daluyong). Coastal areas must evacuate 48 hours prior. Do not stay in single-story concrete houses near the shore."
        },

        # --- Earthquakes & Volcanoes (PHIVOLCS) ---
        {
            "q": "What do I do during an Earthquake?", 
            "a": "Duck, Cover, and Hold. Stay away from glass/windows. If outdoors, find an open area. If near the coast and the shaking is strong, move to high ground immediately (Tsunami threat). Do NOT run while the ground is shaking."
        },
        {
            "q": "What is the 'Big One'?", 
            "a": "A hypothetical Magnitude 7.2 earthquake from the West Valley Fault. Affecting Metro Manila, Bulacan, Rizal, Cavite, Laguna. Potential 34,000 casualties. Preparation requires structural integrity checks and 3-day survival kits."
        },
        {
            "q": "What does Taal/Mayon Alert Level 4 mean?", 
            "a": "Hazardous Eruption Imminent. Possible within hours or days. Mandatory evacuation of the Permanent Danger Zone (PDZ) and extended radius (14km-17km). Risk of pyroclastic density currents and ashfall."
        },

        # --- Health & Safety (DOH) ---
        {
            "q": "I waded in flood water. What now?", 
            "a": "Wash legs with soap/water immediately. Monitor for fever, muscle pain (calves), or reddish eyes (Leptospirosis symptoms). Visit a health center for Doxycycline prophylaxis within 24 hours."
        },
        {
            "q": "Is water from the pump (poso) safe after a storm?", 
            "a": "Assume it is contaminated. Boil for at least 2 minutes (rolling boil) or use chlorine tablets. If water is cloudy, filter it through a clean cloth before boiling."
        },

        # --- Government & Rescue ---
        {
            "q": "Who do I contact for rescue?", 
            "a": "National: 911. Red Cross: 143. NDRRMC: (02) 8911-5061. Coast Guard: (02) 8527-8481. For localized rescue, contact your Barangay DRRMC (BDRRMC) hotlines."
        },
        {
            "q": "How do I use Google Person Finder or Facebook Safety Check?", 
            "a": "During major disasters, these tools activate. Mark yourself 'Safe' on Facebook. On Google Person Finder, select 'I'm looking for someone' or 'I have information about someone' to update status."
        }
    ]

    # ------------------------------------------------------------------
    # POLICIES: Legal, Rights, and Government Mandates
    # ------------------------------------------------------------------
    POLICIES = [
        # --- RA 10121 (DRRM Act) ---
        {
            "title": "Pre-Emptive vs. Forced Evacuation", 
            "text": "LGUs conduct Pre-Emptive Evacuation when danger is likely. Forced Evacuation is declared when danger is imminent and life-threatening. Under RA 10121, residents refusing forced evacuation may be physically removed by PNP/BFP for their safety."
        },
        {
            "title": "State of Calamity Privileges", 
            "text": "When declared: 1. Price Freeze on basic commodities (60 days). 2. Release of Calamity Funds for relief. 3. No-interest loans from GSIS/SSS/Pag-IBIG may become available."
        },
        
        # --- Relief & Recovery ---
        {
            "title": "DSWD Family Food Pack (FFP) Standards", 
            "text": "One standard box contains: 6kg rice, 4 cans corned beef, 4 cans sardines, 6 packs coffee/cereal. Good for a family of 5 for 2 days. Distributed by the LGU/Barangay."
        },
        {
            "title": "DepEd Suspension Guidelines (EO 66)", 
            "text": "Signal No. 1: No classes in Kindergarten. Signal No. 2: No classes up to Senior High School. Signal No. 3: No classes/work in all levels. LGU Mayors can suspend classes even without signals based on local floods."
        },
        
        # --- Zoning ---
        {
            "title": "No-Build Zones & Easements", 
            "text": "Water Code of the Philippines: No structures allowed within 3 meters (urban), 20 meters (agricultural), or 40 meters (forest) from riverbanks/seashores."
        }
    ]

    # ------------------------------------------------------------------
    # METADATA: For RAG Filtering (Optional)
    # ------------------------------------------------------------------
    METADATA = {
        "emergency_hotlines": {"PNP": 117, "RedCross": 143, "NDRRMC": "911"},
        "local_terms": ["Bagyo", "Lindol", "Baha", "Sunog", "Daluyong", "Lahar"],
        "agencies": ["PAGASA", "PHIVOLCS", "NDRRMC", "DSWD", "DOH"]
    }