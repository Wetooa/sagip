# Project Disaster

> A comprehensive disaster preparedness and response application designed to help Filipinos before, during, and after typhoons and floods.

## Overview

**Project Disaster** is a full-stack disaster management system that empowers both ordinary citizens and command centers to prepare for, respond to, and recover from natural disasters. The application operates through two primary interfaces:

- **Citizen Mobile App**: Enables individuals to register, submit preparedness data, receive real-time alerts, request emergency assistance, and access post-disaster services
- **Command Center Dashboard**: Provides administrators with monitoring tools, incident management, resource coordination, and emergency response capabilities

## Key Features

### Before Disaster
- **Hazard Mapping & Monitoring**: Real-time environmental monitoring including water level tracking and predictive remote sensing
- **Digital Census & Vulnerability Profiling**: Comprehensive data collection to assess household risk levels
- **AI-Dynamic Evacuation Routing**: Personalized evacuation routes generated based on real-time conditions
- **LoRa GPS Tagging**: Hardware integration for precise location tracking of vulnerable family members
- **Command Control Center**: Centralized dashboard for monitoring, decision-making, and resource allocation

### During Disaster
- **Location Prediction**: AI-powered trajectory prediction based on last known locations
- **Offline SOS Pulse**: Emergency signaling capability even without internet connectivity
- **Automated Roll Call**: Automated safety checks for affected zones
- **BLE P2P Mesh Network**: Decentralized mesh networking for communication when infrastructure is down
- **Real-time Incident Management**: Command center coordination for rescue operations

### After Disaster
- **Verified Needs Ticket System**: Streamlined process for citizens to request and receive aid
- **Health Outbreaks Model**: AI-powered detection of health clusters from anonymized symptom reports
- **AI Chatbot**: Intelligent assistance for information dissemination and health reporting
- **Post-Disaster Recovery Tools**: Aid distribution, fund verification, and resource matching

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Purpose**: Responsive web application for both mobile (citizens) and desktop (command center) interfaces

### Backend
- **Framework**: FastAPI (Python)
- **Purpose**: RESTful API services for all application features, real-time data processing, and AI/ML model integration

### Database
- **Platform**: Supabase (PostgreSQL)
- **Purpose**: Primary data storage, real-time subscriptions, and authentication

### Additional Technologies
- **LoRa**: Hardware integration for GPS tagging and emergency signaling
- **BLE Mesh**: Bluetooth Low Energy peer-to-peer mesh networking for offline communication
- **AI/ML**: Location prediction, evacuation routing, vulnerability profiling, and health cluster detection

## Project Structure

```
project-disaster/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── database/          # Database schema and migrations
├── docs/              # Additional documentation
├── PLAN.md            # Detailed implementation plan and agent onboarding
└── README.md          # This file
```

## Getting Started

> **Note**: Detailed setup instructions will be available in the implementation phase. This section will be updated with:
> - Environment setup
> - Database configuration
> - Frontend and backend installation steps
> - Development server instructions

## Implementation Status

The project is currently in the **planning phase**. See [PLAN.md](./PLAN.md) for:
- Complete feature breakdown
- User flow analysis
- Detailed folder structure
- Implementation phases
- API structure
- Database schema overview

## Features Priority

### Must-Have Features (Primary Focus)
- Hazard Mapping & Monitoring
- LoRa Installation & GPS Tagging
- AI-Dynamic Evacuation Routing
- Location Prediction
- Digital Census & Vulnerability Profiling
- Command Control Center
- BLE P2P Mesh Network
- Automated Roll Call
- Verified Needs Ticket System
- Health Outbreaks Model
- Chatbot

### Nice-to-Have Features (Secondary Priority)
- Asset Registry
- Volunteer Registry
- Blockchain Donation Funds System
- Civilian External Help Portal
- Crowdsourced Hazard Map

## User Flows

The application supports three primary user flows:

1. **Pre-Disaster Preparedness**: Registration → Census → Hardware Setup → Monitoring → Evacuation Planning
2. **During Disaster Response**: Alert Reception → Status Reporting → SOS Signaling → Rescue Coordination
3. **Post-Disaster Recovery**: Needs Logging → Health Reporting → Aid Distribution → Fund Verification

Detailed user flow diagrams and analysis are documented in [PLAN.md](./PLAN.md).

## Contributing

> **Note**: Contribution guidelines will be established during the development phase.

## License

> **Note**: License information to be determined.

---

**Project Status**: Planning Phase  
**Last Updated**: [Date to be updated]
