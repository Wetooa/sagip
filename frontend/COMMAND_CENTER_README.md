# SAGIP AI Command Control Center

## Overview

A comprehensive web-based command control center for government emergency operations during typhoon events. Built with Next.js, TypeScript, and featuring AI-powered analytics and real-time monitoring.

## Features

### 1. **Hazard Mapping** 🗺️

- Interactive map with multiple hazard layers:
  - Flood zones with severity levels (low, medium, high, critical)
  - Storm surge predictions
  - Landslide risk areas
  - Rainfall heatmap
- Real-time data visualization using MapLibre GL
- Color-coded risk levels for quick assessment

### 2. **LoRa SOS Tracking** 📡

- Real-time SOS alert monitoring from LoRa devices
- GPS coordinate tracking for each alert
- Priority-based alert classification (critical, high, medium)
- Device status monitoring:
  - Battery level
  - Signal strength
  - Last update timestamp
- Quick dispatch capabilities
- Detailed alert timeline

### 3. **Rescue Routes** 🚑

- Optimal path calculation for rescue operations
- Real-time rescue team tracking
- ETA and distance calculations
- Route status visualization:
  - Active missions (red)
  - Planned routes (blue)
  - Completed operations (green)
- Animated vehicle markers for active rescues
- Route efficiency metrics

### 4. **Roll Call** 👥

- Population tracking during emergencies
- Real-time scatter plot visualization of people's locations
- Zone-based classification:
  - Safe zones (green)
  - Warning zones (yellow)
  - Danger zones (orange)
  - Critical zones (red)
- Online/offline status indicators
- Interactive filtering by zone
- Critical zone alerts

### 5. **AI-Powered Analytics** 🤖

- **Predictive Analysis:**
  - Flood level forecasting with ML models
  - Confidence scores for predictions
  - 4-6 hour advance warnings
- **Data Visualizations:**
  - Flood prediction charts (area charts)
  - Population risk distribution (pie charts)
  - Rescue operation timeline (bar charts)
  - Real-time trend analysis

- **Key Metrics:**
  - Response time monitoring
  - Rescue success rates
  - Critical zone tracking
  - Evacuation progress

- **AI Insights Cards:**
  - Automated warnings and alerts
  - ML-driven recommendations
  - Confidence-rated predictions

### 6. **AI Chatbot Assistant** 💬

- Natural language interface for data queries
- Contextual responses about:
  - Hazard summaries
  - Rescue operations status
  - Population tracking insights
  - SOS alert management
  - Predictive forecasts
- Quick action buttons for common queries
- Real-time conversation history

## Technology Stack

### Frontend

- **Framework:** Next.js 16.1.4 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Map:** MapLibre GL JS 4.1.1
- **Charts:** Recharts 2.15.4
- **Date Handling:** date-fns 4.1.0

### Design System

- **Primary Color:** `#6B1515` (SAGIP red)
- **Secondary Color:** `#F4E4C1` (cream/beige)
- **Background:** Dark gradient (`#0f172a` to `#1e293b`)
- **Font:** Geist Sans & Mono
- **Branding:** Consistent with SAGIP Hazard Monitoring System

## File Structure

```
frontend/
├── app/
│   └── command-center/
│       └── page.tsx                 # Main command center page
├── components/
│   └── CommandCenter/
│       ├── HazardMapping.tsx        # Hazard map visualization
│       ├── LoRaPanel.tsx           # SOS alerts tracking
│       ├── RescueRoutes.tsx        # Rescue route planning
│       ├── RollCall.tsx            # Population tracking
│       ├── AIAnalytics.tsx         # AI-powered analytics
│       └── AIChatbot.tsx           # AI assistant chatbot
```

## Key Components

### Main Dashboard (`page.tsx`)

- Full-screen layout with sidebar navigation
- Real-time statistics bar showing:
  - Critical zones count
  - Active SOS alerts
  - Active rescue operations
  - Total people tracked
- Panel-based navigation system
- Floating AI chatbot toggle

### Navigation

- Icon-based sidebar with tooltips
- Active state indicators
- Badge notifications for alerts
- Smooth transitions between panels

### Real-time Updates

- Auto-refreshing statistics (5-second intervals)
- Live status indicators
- Timestamp displays
- Animated markers for active operations

## Features Implementation

### Data Flow

1. Mock data generation for demonstration
2. Real-time state management with React hooks
3. Component-level data updates
4. Visual feedback for all state changes

### Responsive Design

- Full web-app sizing (not mobile-first)
- Optimized for large screens (1920x1080+)
- Grid-based layouts for data visualization
- Flexible component sizing

### AI Integration Points

- Predictive models for flood levels
- ML-based route optimization
- Population risk assessment
- Natural language query processing

## Usage

### Running the Application

```bash
cd frontend
pnpm install
pnpm dev
```

Navigate to: `http://localhost:3000/command-center`

### Navigation

- Click sidebar icons to switch between panels
- Click on items in lists for detailed views
- Use chatbot for AI-assisted queries
- Filter data using the interactive controls

## Future Enhancements

### Backend Integration

- Connect to real LoRa device APIs
- Integrate live weather data feeds
- Implement actual ML model endpoints
- Add database for historical data

### Additional Features

- User authentication and role-based access
- Multi-language support
- Export reports functionality
- Print-friendly views
- Mobile responsive version
- Voice commands integration

### AI Enhancements

- More sophisticated predictive models
- Computer vision for damage assessment
- Natural disaster pattern recognition
- Resource allocation optimization

## Design Philosophy

1. **Information Density:** Maximum data visibility without clutter
2. **Quick Access:** One-click access to critical information
3. **Visual Hierarchy:** Color-coding for priority levels
4. **Real-time Feedback:** Live updates and animations
5. **Professional Aesthetics:** Government-appropriate design
6. **Accessibility:** Clear labels and intuitive navigation

## Color Coding Standards

- **Red (`#ef4444`)**: Critical/Emergency
- **Orange (`#f97316`)**: High Priority/Danger
- **Yellow (`#eab308`)**: Warning/Caution
- **Green (`#22c55e`)**: Safe/Success
- **Blue (`#3b82f6`)**: Information/Active
- **Purple (`#a855f7`)**: Special/Landslide
- **SAGIP Red (`#6B1515`)**: Brand/Primary Actions

## Credits

Built for SAGIP AI - Hazard Monitoring System
Government Emergency Operations Dashboard
Powered by AI and Real-time Data Analytics
