# Project Disaster - Implementation Plan

> **Agent Onboarding Document** - This document serves as the primary reference for understanding project architecture, features, and implementation strategy.

## 🎯 Current Status

**Phase 1: Foundation & Core Infrastructure** ✅ **COMPLETE**

- ✅ Backend structure fully initialized
- ✅ Database schema designed and migrated (25 tables in Supabase)
- ✅ All SQLAlchemy models and Pydantic schemas created
- ✅ API route structure complete (24 route files)
- ✅ Supabase connection configured (Session Pooler)
- ⏳ Authentication system (structure ready, implementation pending)
- ⏳ Frontend initialization (pending)

**Next Phase**: Implement authentication, core CRUD operations, and begin frontend development.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Feature Breakdown](#feature-breakdown)
4. [User Flow Analysis](#user-flow-analysis)
5. [Folder Structure](#folder-structure)
6. [Implementation Phases](#implementation-phases)
7. [Database Schema Overview](#database-schema-overview)
8. [API Structure](#api-structure)
9. [Frontend Architecture](#frontend-architecture)
10. [Development Guidelines](#development-guidelines)

---

## Project Overview

**Project Disaster** is a comprehensive disaster preparedness and response application designed to help Filipinos before, during, and after typhoons and floods. The system operates through two primary user perspectives:

- **Ordinary Citizens**: Mobile app users who register, submit data, receive alerts, request help, and access post-disaster services
- **Command Center**: Administrative dashboard for monitoring, decision-making, resource allocation, and emergency response coordination

### Core Objectives

1. **Pre-Disaster**: Proactive preparedness through hazard mapping, vulnerability profiling, and evacuation planning
2. **During Disaster**: Real-time location tracking, SOS signaling, automated roll calls, and emergency response coordination
3. **Post-Disaster**: Aid distribution, health monitoring, needs verification, and resource matching

---

## Tech Stack

### Frontend

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Purpose**: Citizen mobile app + Command Center dashboard + Debug page

### Backend

- **Framework**: FastAPI (Python)
- **Purpose**: RESTful APIs for all features, including debug endpoints

### Database

- **Platform**: Supabase (PostgreSQL)
- **Purpose**: Primary data storage for all features

### Additional Technologies

- **LoRa**: Hardware integration for GPS tagging and SOS signaling
- **BLE Mesh**: Bluetooth Low Energy peer-to-peer mesh networking
- **Blockchain**: Transaction logging for donation funds (Nice-to-Have)

---

## Feature Breakdown

### Phase: Before Disaster

#### Must-Have Features

1. **Hazard Mapping (Monitoring - water level, etc.)**
   - Real-time environmental monitoring
   - Predictive remote sensing data integration
   - Water level monitoring and trend analysis
   - Scenario simulation capabilities
   - Risk level assessment and decision triggers

2. **LoRa Installation + Tags procurement for GPS Tagging**
   - Hardware procurement flow via app
   - LoRa geolocation tag installation instructions
   - Device registration and management
   - GPS coordinate transmission to Command Center

3. **AI-Dynamic Evacuation Routing**
   - Route generation based on real-time conditions
   - Personalized evacuation routes for citizens
   - Integration with hazard mapping and location data
   - Dynamic route updates based on changing conditions

4. **Digital Census + Vulnerability Profiling**
   - Family size registration
   - Medical needs documentation
   - Volunteer willingness indication
   - Data feeds into vulnerability profiling algorithm
   - Risk assessment per household/individual

5. **Command Control Center for Assistance**
   - Dashboard for monitoring and decision-making
   - Incident activation and management
   - Alert processing and response coordination
   - Resource allocation interface

6. **Monitoring (water level, etc.)**
   - Continuous environmental data collection
   - Predictive remote sensing integration
   - Trend analysis and alert generation
   - Integration with hazard mapping

#### Nice-to-Have Features

1. **Asset Registry**
   - Boat/vehicle registration
   - Asset tracking and management
   - Resource availability for emergency use

2. **Volunteer Registry**
   - Volunteer registration and management
   - Skills and availability tracking
   - Barangay assistance coordination

3. **Blockchain Donation Funds System**
   - Donation tracking and transparency
   - Fund authorization and logging
   - Transaction verification
   - Citizen fund status checking

4. **Predictive Remote Sensing**
    - Advanced environmental prediction
    - Early warning system enhancement

---

### Phase: During Disaster

#### Must-Have Features

1. **Location Prediction based on Last known location**
   - AI/ML model for trajectory prediction
   - Drift analysis for missing persons
   - Integration with evacuation routing
   - Fallback when LoRa/GPS unavailable

2. **Offline SOS Pulse**
   - Offline mode activation when internet unavailable
   - Compressed status packet transmission
   - Mesh network integration
   - Persistent status updates

3. **Automated Roll Call**
   - Automated safety check system
   - "Are you safe?" notifications to affected zones
   - Response tracking and status aggregation
   - Integration with location prediction

4. **Command Control Center**
   - Real-time incident dashboard
   - SOS signal reception and processing
   - Rescue team dispatch coordination
   - Status monitoring and response tracking

5. **BLE P2P Mesh Network (Decentralized Mesh Network)**
   - Bluetooth mesh networking when internet unavailable
   - Compressed status packet transmission
   - Family member location within mesh
   - Gateway integration to Command Center

---

### Phase: After Disaster

#### Must-Have Features

1. **Verified Needs Ticket System**
   - Citizen need logging (medicine, supplies, etc.)
   - Ticket verification and prioritization
   - Command Center dashboard integration
   - Matching with external help portals

2. **Health Outbreaks Model**
   - Symptom reporting via AI Chatbot
   - Anonymized health data collection
   - Cluster detection algorithms
   - Medical team dispatch triggers

3. **Chatbot**
   - AI-powered assistance for citizens
   - Symptom reporting interface
   - Pre-emptive information dissemination
   - Notification system integration

#### Nice-to-Have Features

1. **Civilian External Help Portal**
   - NGO and private donor registration
   - Request matching system
   - Resource coordination interface

2. **Crowdsourced hazard map (Bayan mo ipatrol mo)**
   - Community-contributed hazard data
   - Real-time map updates
   - Verification and moderation system

---

## User Flow Analysis

### Flow 1: Pre-Disaster Preparedness

**Ordinary Citizen Actions:**

1. Download app & register
2. Complete digital census (family size, medical needs, volunteer willingness)
3. Register assets (boats/vehicles) - Nice-to-Have
4. Procure hardware via app
5. Install LoRa geolocation tags on vulnerable family members
6. Continue monitoring app
7. Receive custom evacuation route (from Command Center)
8. Check volunteer registry - Nice-to-Have
9. Verify relief funds status via blockchain - Nice-to-Have

**Command Center Actions:**

1. Monitor predictive remote sensing data
2. Analyze water level monitoring trends
3. Simulate scenarios using hazard mapping
4. Decision: Risk level exists?
   - No → Loop back to monitoring
   - Yes → Trigger chatbot notifications and pre-emptive information
   - If High Risk → Trigger pre-emptive evacuation with AI-dynamic routing

**Key Integrations:**

- Digital Census → Vulnerability Profiling (backend processing)
- LoRa Tags → GPS data to Command Center
- AI-Dynamic Evacuation Routing → Custom routes to citizens
- Hazard Mapping → Risk assessment → Alert triggers

---

### Flow 2: During Disaster Response

**Ordinary Citizen Actions:**

1. Receive "Are you safe?" pop-up on Phone & LoRa device
2. Phone battery check
   - Dead → End flow
   - Alive → Internet availability check
     - Internet Available → Mark as "Stranded" → Send status to Command Center
     - No Internet → App switches to Offline SOS Ping
3. SOS Signaling Paths:
   - **Path A (Has LoRa Device):**
     - Hit Physical SOS Button → Emergency Mesh Broadcast
     - Command Center receives SOS → Dispatch to device coordinates
   - **Path B (No LoRa, Offline):**
     - Check for Bluetooth Mesh Signal
     - Send compressed status packet via Mesh
     - Command Center analyzes drift trajectory (Location Prediction)
     - Dispatch to predicted coordinates

**Command Center Actions:**

1. Receive critical alert from water level monitoring
2. Activate Command Control Center Dashboard
3. Trigger automated roll call to affected zones
4. Receive SOS distress signals
5. Analyze location data (device coordinates or predicted coordinates)
6. Dispatch rescue teams

**Key Integrations:**

- Water Level Monitoring → Alert → Incident Activation
- Automated Roll Call → Citizen status collection
- LoRa SOS → Direct coordinate transmission
- Offline SOS → BLE Mesh → Location Prediction → Predicted coordinates
- Location Prediction → AI model using last known location + environmental factors

---

### Flow 3: Post-Disaster Recovery

**Ordinary Citizen Actions:**

1. Arrive at shelter/safe zone
2. Log specific needs via Verified Needs Ticket System
3. Connect to BLE P2P Chatting (Decentralized Mesh Network)
4. Locate family members nearby
5. Report symptoms to AI Chatbot (anonymized data)
6. Receive aid / Verify fund usage

**Command Center Actions:**

1. Receive health data from chatbot
2. Update Health Outbreaks Model
3. Decision: Cluster detected?
   - Yes → Dispatch Medical Team
   - No → Continue monitoring
4. View 'Needs Tickets' on dashboard
5. Match requests with Civilian External Help Portal (NGOs/Private Donors) - Nice-to-Have
6. Authorize reconstruction funds
7. Log transaction on Blockchain Donation Funds System - Nice-to-Have

**Key Integrations:**

- Verified Needs Ticket System → Command Center dashboard
- AI Chatbot → Anonymized health data → Health Outbreaks Model
- Health Outbreaks Model → Cluster detection → Medical team dispatch
- Needs Tickets → External Help Portal matching
- Blockchain → Transaction logging and verification

---

## Folder Structure

```
project-disaster/
├── README.md                    # High-level project description
├── PLAN.md                      # This file - implementation plan and agent onboarding
├── .gitignore                   # Git ignore rules
│
├── frontend/                    # Next.js application
│   ├── app/                     # App Router pages
│   │   ├── citizen/             # Citizen-facing routes
│   │   │   ├── register/        # Registration + Census (combined page with separated forms)
│   │   │   ├── lora/            # LoRa procurement & installation
│   │   │   ├── dashboard/       # Citizen dashboard (includes Asset Registry)
│   │   │   ├── evacuation/      # Evacuation route display
│   │   │   ├── needs/           # Needs ticket system
│   │   │   ├── health/          # Health reporting
│   │   │   └── mesh/            # BLE mesh network interface
│   │   │
│   │   ├── command/             # Command Center routes
│   │   │   ├── dashboard/       # Main command center dashboard
│   │   │   ├── incidents/       # Incident management
│   │   │   ├── monitoring/      # Environmental monitoring
│   │   │   ├── roll-call/       # Automated roll call
│   │   │   ├── rescue/          # Rescue coordination
│   │   │   ├── needs/           # Needs ticket management
│   │   │   ├── health/          # Health outbreaks monitoring
│   │   │   └── volunteers/      # Volunteer management (Nice-to-Have)
│   │   │
│   │   ├── debug/               # Debug page
│   │   │   └── page.tsx         # Debug interface
│   │   │
│   │   ├── api/                 # Next.js API routes (if needed)
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn/ui components
│   │   ├── citizen/             # Citizen-specific components
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── CensusForm.tsx
│   │   │   ├── AssetRegistry.tsx
│   │   │   ├── LoRaInstallation.tsx
│   │   │   ├── EvacuationRoute.tsx
│   │   │   ├── NeedsTicket.tsx
│   │   │   └── HealthReport.tsx
│   │   │
│   │   ├── command/             # Command Center components
│   │   │   ├── IncidentDashboard.tsx
│   │   │   ├── MonitoringPanel.tsx
│   │   │   ├── RollCallManager.tsx
│   │   │   ├── RescueCoordinator.tsx
│   │   │   ├── NeedsTicketManager.tsx
│   │   │   ├── HealthOutbreaksMap.tsx
│   │   │   └── HazardMap.tsx
│   │   │
│   │   ├── shared/              # Shared components
│   │   │   ├── Chatbot.tsx
│   │   │   ├── MeshNetwork.tsx
│   │   │   └── LocationTracker.tsx
│   │   │
│   │   └── debug/               # Debug components
│   │       └── DebugPanel.tsx
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── api/                 # API client functions
│   │   ├── offline/             # Offline sync logic
│   │   ├── mesh/                # BLE mesh networking
│   │   ├── location/            # Location prediction utilities
│   │   └── utils.ts             # General utilities
│   │
│   ├── hooks/                   # React hooks
│   │   ├── useOfflineSync.ts
│   │   ├── useLocation.ts
│   │   └── useMeshNetwork.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── api.ts               # API response types
│   │   ├── citizen.ts           # Citizen data types
│   │   ├── command.ts           # Command Center types
│   │   └── shared.ts            # Shared types
│   │
│   ├── styles/                  # Global styles
│   │   └── globals.css           # Tailwind imports
│   │
│   ├── public/                  # Static assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app initialization
│   │   │
│   │   ├── api/                 # API route handlers (NO versioning)
│   │   │   ├── __init__.py
│   │   │   ├── citizen/          # Citizen endpoints
│   │   │   │   ├── __init__.py
│   │   │   │   ├── register.py
│   │   │   │   ├── census.py
│   │   │   │   ├── assets.py
│   │   │   │   ├── lora.py
│   │   │   │   ├── evacuation.py
│   │   │   │   ├── needs.py
│   │   │   │   └── health.py
│   │   │   │
│   │   │   ├── command/         # Command Center endpoints
│   │   │   │   ├── __init__.py
│   │   │   │   ├── incidents.py
│   │   │   │   ├── monitoring.py
│   │   │   │   ├── roll_call.py
│   │   │   │   ├── rescue.py
│   │   │   │   ├── needs.py
│   │   │   │   ├── health.py
│   │   │   │   └── volunteers.py
│   │   │   │
│   │   │   ├── shared/          # Shared endpoints
│   │   │   │   ├── __init__.py
│   │   │   │   ├── chatbot.py
│   │   │   │   ├── mesh.py
│   │   │   │   └── location.py
│   │   │   │
│   │   │   └── debug/           # Debug endpoints
│   │   │       ├── __init__.py
│   │   │       └── debug.py
│   │   │   │
│   │   ├── core/                # Core application logic
│   │   │   ├── __init__.py
│   │   │   ├── config.py        # Configuration settings
│   │   │   ├── security.py      # Authentication & authorization
│   │   │   └── database.py      # Database connection (Supabase)
│   │   │
│   │   ├── models/              # Database models (SQLAlchemy ORM)
│   │   │   ├── __init__.py
│   │   │   ├── citizen.py       # Citizen-related models
│   │   │   ├── devices.py       # Device models (devices, lora_devices)
│   │   │   ├── monitoring.py    # Monitoring data models
│   │   │   ├── location.py      # Location tracking models
│   │   │   ├── emergency.py     # Emergency response models
│   │   │   ├── post_disaster.py # Post-disaster models
│   │   │   ├── communication.py # Communication models
│   │   │   └── nice_to_have.py  # Nice-to-have models
│   │   │
│   │   ├── services/            # Business logic services
│   │   │   ├── __init__.py
│   │   │   │
│   │   │   ├── census/          # Digital census & vulnerability profiling
│   │   │   │   ├── __init__.py
│   │   │   │   ├── census_service.py
│   │   │   │   └── vulnerability_profiling.py
│   │   │   │
│   │   │   ├── monitoring/      # Environmental monitoring
│   │   │   │   ├── __init__.py
│   │   │   │   ├── hazard_mapping.py
│   │   │   │   ├── water_level.py
│   │   │   │   └── remote_sensing.py
│   │   │   │
│   │   │   ├── location/        # Location services
│   │   │   │   ├── __init__.py
│   │   │   │   ├── lora_service.py
│   │   │   │   ├── location_prediction.py
│   │   │   │   └── gps_tracking.py
│   │   │   │
│   │   │   ├── evacuation/     # Evacuation routing
│   │   │   │   ├── __init__.py
│   │   │   │   └── ai_routing.py
│   │   │   │
│   │   │   ├── emergency/      # Emergency response
│   │   │   │   ├── __init__.py
│   │   │   │   ├── roll_call.py
│   │   │   │   └── rescue_coordination.py
│   │   │   │   # Note: SOS functionality handled via mesh network and location prediction
│   │   │   │
│   │   │   ├── health/         # Health monitoring
│   │   │   │   ├── __init__.py
│   │   │   │   ├── health_outbreaks.py
│   │   │   │   └── symptom_analysis.py
│   │   │   │
│   │   │   ├── needs/          # Needs ticket system
│   │   │   │   ├── __init__.py
│   │   │   │   └── needs_ticket.py
│   │   │   │
│   │   │   ├── mesh/           # BLE mesh networking
│   │   │   │   ├── __init__.py
│   │   │   │   └── mesh_gateway.py
│   │   │   │
│   │   │   └── chatbot/        # AI chatbot
│   │   │       ├── __init__.py
│   │   │       └── chatbot_service.py
│   │   │
│   │   └── utils/               # Utility functions
│   │       ├── __init__.py
│   │       └── helpers.py
│   │
│   ├── tests/                   # Test files
│   │   ├── __init__.py
│   │   ├── test_census.py
│   │   ├── test_monitoring.py
│   │   └── test_emergency.py
│   │
│   ├── alembic/                 # Database migrations (if using Alembic)
│   │   └── versions/
│   │
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment variables template
│   └── README.md                # Backend-specific README
│
├── database/                    # Database-related files
│   ├── schema/                  # SQL schema files
│   │   ├── 01_citizen.sql
│   │   ├── 02_monitoring.sql
│   │   ├── 03_emergency.sql
│   │   ├── 04_health.sql
│   │   └── 05_nice_to_have.sql
│   │
│   ├── migrations/              # Migration scripts
│   └── seeds/                   # Seed data (if needed)
│
├── docs/                        # Additional documentation
│   ├── api/                     # API documentation
│   │   └── endpoints.md
│   ├── architecture/            # Architecture diagrams
│   │   └── system-overview.md
│   └── deployment/             # Deployment guides
│       └── setup.md
│
└── .github/                     # GitHub workflows (if using CI/CD)
    └── workflows/
        └── ci.yml
```

---

## Implementation Phases

### Phase 1: Foundation & Core Infrastructure ✅ COMPLETE

**Priority: Critical**

1. **Project Setup** ✅
   - ✅ Initialize FastAPI backend
   - ✅ Configure Supabase connection (Session Pooler for IPv4)
   - ✅ Set up development environment
   - ⏳ Initialize Next.js frontend with Tailwind + Shadcn (Pending)

2. **Database Schema** ✅
   - ✅ Design all 25 core tables
   - ✅ Set up Supabase project
   - ✅ Create and apply initial migration (36b95d4c8a95)
   - ✅ All tables created in production database

3. **Backend Infrastructure** ✅
   - ✅ SQLAlchemy models for all entities
   - ✅ Pydantic schemas for all endpoints
   - ✅ FastAPI application structure
   - ✅ API route structure (24 route files)
   - ✅ Database session management
   - ✅ CORS configuration

4. **Authentication & Authorization** ⏳
   - ⏳ User registration and login (structure ready, logic pending)
   - ⏳ Role-based access (Citizen vs Command Center) (pending)
   - ⏳ Session management (pending)

5. **Debug Infrastructure** ✅
   - ✅ Debug API endpoints on backend
   - ⏳ Debug page on frontend (pending)
   - ⏳ Logging and monitoring setup (pending)

---

### Phase 2: Pre-Disaster Features (Must-Have)

**Priority: High**

1. **Digital Census + Vulnerability Profiling**
   - Frontend: Registration + Census combined page (separated forms for clarity)
   - Backend: Registration API, Census API + vulnerability profiling algorithm
   - Database: User accounts and census data storage

2. **Hazard Mapping + Monitoring**
   - Backend: Water level monitoring API
   - Backend: Remote sensing data integration
   - Backend: Hazard mapping simulation
   - Frontend: Monitoring dashboard (Command Center)
   - Frontend: Risk visualization

3. **Command Control Center Dashboard**
   - Frontend: Main dashboard layout
   - Backend: Dashboard data aggregation APIs
   - Real-time updates integration

4. **AI-Dynamic Evacuation Routing**
   - Backend: Routing algorithm implementation
   - Integration with hazard mapping
   - Frontend: Route display component
   - API: Route generation endpoint

5. **LoRa Integration (Basic)**
   - Backend: LoRa device registration API
   - Backend: GPS coordinate ingestion
   - Frontend: LoRa procurement flow
   - Frontend: Installation instructions

6. **Asset Registry (Nice-to-Have, integrated in Dashboard)**
   - Frontend: Asset registry component in citizen dashboard
   - Backend: Asset registration API
   - Database: Asset data storage

---

### Phase 3: During Disaster Features (Must-Have)

**Priority: High**

1. **Location Prediction**
   - Backend: ML model for trajectory prediction
   - API: Location prediction endpoint
   - Integration with last known location data

2. **Offline SOS Pulse**
   - Frontend: Offline mode detection
   - Frontend: SOS functionality integrated in dashboard/mesh interface
   - Backend: SOS signal processing via mesh gateway
   - Offline sync mechanism
   - Note: SOS handled through mesh network and location prediction, no dedicated route

3. **Automated Roll Call**
   - Backend: Roll call trigger logic
   - Backend: Response aggregation
   - Frontend: Roll call notifications
   - Frontend: Response interface

4. **BLE P2P Mesh Network**
   - Frontend: Mesh network detection
   - Frontend: Compressed packet transmission
   - Backend: Mesh gateway API
   - Backend: Mesh data processing

5. **Command Center - Incident Management**
   - Backend: Incident activation API
   - Frontend: Incident dashboard
   - Real-time SOS signal display (from mesh network)
   - Rescue team dispatch interface

---

### Phase 4: Post-Disaster Features (Must-Have)

**Priority: High**

1. **Verified Needs Ticket System**
   - Frontend: Needs ticket form
   - Backend: Ticket creation and verification API
   - Frontend: Command Center ticket management
   - Backend: Ticket matching logic

2. **Health Outbreaks Model**
   - Frontend: Symptom reporting interface
   - Backend: Health data collection API
   - Backend: Cluster detection algorithm
   - Frontend: Outbreak visualization (Command Center)

3. **Chatbot**
   - Backend: AI chatbot service integration
   - Frontend: Chatbot component
   - Integration with notification system
   - Anonymization logic for health data

---

### Phase 5: Nice-to-Have Features

**Priority: Medium**

1. **Asset Registry**
2. **Volunteer Registry**
3. **Blockchain Donation Funds System**
4. **Civilian External Help Portal**
5. **Crowdsourced Hazard Map**

---

## Database Schema Overview

### Core Tables (Must-Have) - 20 Tables

**Citizen Management:**

- `citizens` - User accounts and basic info
- `census_data` - Digital census submissions (optional, can register without census)
- `vulnerability_profiles` - Computed vulnerability scores (requires census_data)

**Device Management:**

- `devices` - Generic devices (phones, tablets) bound to citizens
  - Stores current latitude/longitude
  - Can be active or inactive
- `lora_devices` - LoRa device registration and status
  - Can be standalone (not bound to account) or bound to citizen
  - Has current location tracking

**Monitoring:**

- `water_level_readings` - Water level sensor data with sensor metadata

**Location & Tracking:**

- `location_history` - GPS coordinate history
  - References `devices` or `lora_devices` (not directly to citizens)
  - Tracks location source (GPS, LoRa, manual, predicted)
- `predicted_locations` - AI-predicted locations
  - References `location_history` for the prediction source
  - Used when actual location data unavailable

**Emergency Response:**

- `incidents` - Disaster incident records
- `sos_signals` - SOS distress signals
- `roll_calls` - Roll call records
- `roll_call_responses` - Individual roll call responses
- `rescue_dispatches` - Rescue team dispatch records

**Post-Disaster:**

- `needs_tickets` - Verified needs ticket system
- `health_reports` - Anonymized health symptom reports
- `health_clusters` - Detected health outbreak clusters
- `medical_dispatches` - Medical team dispatch records

**Communication:**

- `chatbot_conversations` - Chatbot interaction logs
- `notifications` - System notifications
- `mesh_packets` - BLE mesh network packets

### Nice-to-Have Tables - 5 Tables

- `assets` - Asset registry (boats, vehicles)
- `volunteers` - Volunteer registry
- `donation_funds` - Blockchain donation records
- `external_help_requests` - Civilian external help portal
- `crowdsourced_hazards` - Community-contributed hazard data

### Schema Design Notes

- **Device-Based Location**: Location data is bound to devices, not directly to citizens. This allows for multiple devices per citizen and standalone LoRa devices.
- **No Hazard Maps Table**: Hazard maps are fetched from external APIs (e.g., NOAH), not stored in the database. API routes exist to fetch this data.
- **No Remote Sensing Table**: Remote sensing is a prediction concept used for location prediction when devices are unavailable, not stored data.
- **No Last Known Locations Table**: Last known locations are derived from `location_history` by selecting the most recent entry per device/citizen.
- **Census Data is Optional**: Citizens can register without providing census data. Census is only required for vulnerability profiling.

---

## API Structure

### Base URL Structure

```
/api/
```

**Note:** API versioning has been removed. All endpoints use `/api/` directly.

### Endpoint Groups

**Citizen Endpoints:**

- `POST /api/citizen/register` - User registration
- `GET /api/citizen/register/profile` - Get citizen profile
- `POST /api/citizen/census` - Submit digital census
- `POST /api/citizen/lora/register` - Register LoRa device
- `GET /api/citizen/evacuation/route` - Get evacuation route (AI placeholder)
- `POST /api/citizen/needs/ticket` - Create needs ticket
- `POST /api/citizen/health/report` - Report health symptoms
- `GET /api/citizen/assets` - Get assets (Nice-to-Have)
- `POST /api/citizen/assets` - Register assets (Nice-to-Have)

**Command Center Endpoints:**

- `GET /api/command/incidents/dashboard` - Dashboard data
- `POST /api/command/incidents` - Create/activate incident
- `GET /api/command/incidents` - List all incidents
- `GET /api/command/monitoring/water-level` - Water level data
- `GET /api/command/monitoring/hazard-map` - Hazard mapping data (external API)
- `POST /api/command/roll-call/trigger` - Trigger roll call
- `GET /api/command/roll-call/responses` - Get roll call responses
- `GET /api/command/rescue/sos/signals` - Get SOS signals
- `POST /api/command/rescue/dispatch` - Dispatch rescue team
- `GET /api/command/needs/tickets` - Get needs tickets
- `GET /api/command/health/clusters` - Get health clusters (AI placeholder)
- `POST /api/command/health/dispatch` - Dispatch medical team
- `GET /api/command/volunteers` - Get volunteers (Nice-to-Have)

**Shared Endpoints:**

- `POST /api/shared/chatbot/message` - Chatbot interaction (AI placeholder)
- `POST /api/shared/mesh/packet` - Mesh network packet transmission
- `POST /api/shared/location/history` - Create location history
- `GET /api/shared/location/history` - Get location history
- `POST /api/shared/location/predict` - Location prediction (AI placeholder)
- `GET /api/shared/hazard-mapping/flood` - Get flood hazard map (external API)
- `GET /api/shared/hazard-mapping/storm-surge` - Get storm surge hazard map (external API)
- `GET /api/shared/hazard-mapping/metadata` - Get available hazard maps metadata

**Debug Endpoints:**

- `GET /api/debug/status` - System status
- `GET /api/debug/data` - Debug data dump
- `POST /api/debug/test` - Test endpoint

---

## Backend Implementation Status

### ✅ Completed (Phase 1 - Foundation)

1. **Project Structure**: ✅ All directories and files created according to plan
2. **Database Configuration**: ✅ Supabase PostgreSQL connection configured
   - Using Session Pooler for IPv4 compatibility
   - Connection string properly configured with SSL
   - Environment variables: `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`
3. **SQLAlchemy Models**: ✅ All 25 database models created and migrated:
   - Citizen models: `Citizen`, `CensusData`, `VulnerabilityProfile`
   - Device models: `Device`, `LoRaDevice`
   - Monitoring models: `WaterLevelReading`
   - Location models: `LocationHistory`, `PredictedLocation`
   - Emergency models: `Incident`, `SOSSignal`, `RollCall`, `RollCallResponse`, `RescueDispatch`
   - Post-disaster models: `NeedsTicket`, `HealthReport`, `HealthCluster`, `MedicalDispatch`
   - Communication models: `ChatbotConversation`, `Notification`, `MeshPacket`
   - Nice-to-have models: `Asset`, `Volunteer`, `DonationFund`, `ExternalHelpRequest`, `CrowdsourcedHazard`
4. **Pydantic Schemas**: ✅ Request/response schemas created for all models
   - Base, Create, Update, and Response schemas for each entity
   - Proper validation and ORM compatibility
5. **FastAPI Application**: ✅ Main app initialized
   - CORS middleware configured
   - All routers registered (`/api/citizen`, `/api/command`, `/api/shared`, `/api/debug`)
   - Database session dependency (`get_db`)
   - Health check endpoint
6. **API Route Structure**: ✅ All 24 route files created with placeholder endpoints
   - Citizen routes: register, census, lora, evacuation, needs, health, assets
   - Command routes: incidents, monitoring, roll_call, rescue, needs, health, volunteers
   - Shared routes: chatbot, mesh, location, hazard_mapping
   - Debug routes: status, data, test
7. **Database Migration**: ✅ Alembic configured and initial migration completed
   - Migration `36b95d4c8a95` successfully applied
   - All 25 tables created in Supabase (plus `alembic_version`)
   - Database schema matches models exactly

### 🚧 Pending Implementation (Phase 2+)

1. **Business Logic Implementation** (Priority: High)
   - All endpoint implementations currently use `pass` placeholders
   - Need CRUD operations for all entities
   - Need validation and error handling
   - Need business rules (e.g., vulnerability profiling algorithm)

2. **Authentication & Authorization** (Priority: Critical)
   - JWT token generation and validation
   - Password hashing with bcrypt
   - Role-based access control (Citizen vs Command Center)
   - Protected route decorators
   - User session management

3. **AI/ML Integrations** (Priority: Medium)
   - Chatbot service integration (placeholder endpoint exists)
   - Location prediction model (placeholder endpoint exists)
   - Evacuation routing algorithm (placeholder endpoint exists)
   - Health cluster detection algorithm (placeholder endpoint exists)
   - Vulnerability profiling algorithm

4. **External API Integration** (Priority: Medium)
   - Hazard map API integration (NOAH data)
   - Remote sensing data fetching (if needed)
   - External weather/environmental APIs

5. **Real-time Features** (Priority: Medium)
   - WebSocket support for real-time updates
   - Server-Sent Events for notifications
   - Live location tracking updates

6. **Testing** (Priority: High)
   - Unit tests for services and utilities
   - Integration tests for API endpoints
   - Database test fixtures
   - E2E test setup

7. **Frontend Development** (Priority: High)
   - Next.js project initialization
   - Component library setup (Shadcn/ui)
   - API client implementation
   - All frontend routes and components

### Key Implementation Notes

- **No API Versioning**: All endpoints use `/api/` directly (no `/api/v1/`)
- **Device-Based Location**: Location is bound to devices, not directly to citizens
- **Standalone LoRa Devices**: LoRa devices can exist independently or be bound to accounts
- **No Hazard Maps Table**: Hazard maps are fetched from external APIs, not stored
- **No Remote Sensing Table**: Remote sensing is a concept for location prediction, not stored data
- **Derived Last Known Locations**: Last known locations are derived from `location_history`, no separate table
- **Census Data is Optional**: Users can register without providing census data
- **Session Pooler**: Using Supabase Connection Pooler for IPv4 compatibility

---

## Frontend Architecture

### Routing Structure

**Citizen Routes:**

- `/citizen/register` - Registration + Census (combined page with separated forms)
- `/citizen/lora` - LoRa procurement & installation
- `/citizen/dashboard` - Citizen dashboard (includes Asset Registry)
- `/citizen/evacuation` - Evacuation route display
- `/citizen/needs` - Needs ticket system
- `/citizen/health` - Health reporting
- `/citizen/mesh` - BLE mesh network interface

**Command Center Routes:**

- `/command/dashboard` - Main dashboard
- `/command/incidents` - Incident management
- `/command/monitoring` - Environmental monitoring
- `/command/roll-call` - Automated roll call
- `/command/rescue` - Rescue coordination
- `/command/needs` - Needs ticket management
- `/command/health` - Health outbreaks monitoring
- `/command/volunteers` - Volunteer management (Nice-to-Have)

**Shared Routes:**

- `/chatbot` - Chatbot interface
- `/debug` - Debug page

### Component Organization

- **UI Components**: Reusable Shadcn/ui components
- **Citizen Components**: Citizen-specific functionality
- **Command Components**: Command Center-specific functionality
- **Shared Components**: Used by both user types
- **Debug Components**: Debug and testing utilities

### State Management

- Consider using React Context or Zustand for global state
- API state management with React Query or SWR
- Offline state management for SOS and mesh networking

---

## Development Guidelines

### Code Style

- **Frontend**: Follow Next.js and React best practices, use TypeScript
- **Backend**: Follow PEP 8, use type hints, FastAPI best practices
- **Database**: Use migrations for all schema changes

### Testing Strategy

- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows (registration, SOS, roll call)

### Security Considerations

- Input validation on all endpoints
- Authentication and authorization checks
- Data anonymization for health data
- Secure mesh network packet transmission
- Rate limiting on public endpoints

### Performance Considerations

- Optimize location prediction algorithm
- Efficient database queries with proper indexing
- Caching for frequently accessed data
- Real-time updates using WebSockets or Server-Sent Events

### Documentation Requirements

- API documentation with OpenAPI/Swagger
- Component documentation for complex UI components
- Service documentation for business logic
- Deployment and setup guides

---

## Next Steps

### Immediate Next Steps (Phase 2 - Core Features)

1. **Implement Authentication System** (Priority: Critical)
   - Complete JWT authentication in `app/core/security.py`
   - Add password hashing utilities
   - Create login/register endpoints with proper authentication
   - Add protected route decorators

2. **Implement Core CRUD Operations** (Priority: High)
   - Citizen registration and profile management
   - Census data submission
   - Device registration (regular devices and LoRa)
   - Location history tracking
   - Basic incident management

3. **Implement Business Logic Services** (Priority: High)
   - Vulnerability profiling algorithm
   - Location prediction service (placeholder → actual implementation)
   - Roll call trigger and response aggregation
   - Needs ticket verification logic

4. **Frontend Foundation** (Priority: High)
   - Initialize Next.js project
   - Set up Tailwind CSS and Shadcn/ui
   - Create API client utilities
   - Implement authentication flow
   - Create basic layout components

5. **Testing Infrastructure** (Priority: Medium)
   - Set up pytest and test database
   - Create test fixtures
   - Write initial unit tests for core services
   - Set up CI/CD pipeline

### Medium-Term Goals (Phase 3-4)

- Complete all CRUD operations for all entities
- Implement AI/ML integrations
- Build frontend components and pages
- Add real-time features
- Complete end-to-end user flows

### Long-Term Goals (Phase 5)

- Nice-to-have features implementation
- Performance optimization
- Advanced monitoring and analytics
- Production deployment setup

---

**Last Updated**: January 22, 2025
**Version**: 2.0
**Status**: Phase 1 Complete - Ready for Phase 2 Implementation
