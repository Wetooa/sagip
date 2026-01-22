# Project Disaster Backend

FastAPI backend for the Project Disaster application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your Supabase database credentials:
```
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your-secret-key-here
```

## Running the Application

### Development
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Database Migrations

### Initialize Alembic (first time only)
```bash
alembic revision --autogenerate -m "Initial migration"
```

### Create a new migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

### Rollback migrations
```bash
alembic downgrade -1
```

## Project Structure

```
backend/
├── app/
│   ├── api/           # API route handlers
│   ├── core/          # Core application logic (config, database, security)
│   ├── models/         # SQLAlchemy ORM models
│   ├── schemas/        # Pydantic request/response schemas
│   └── utils/          # Utility functions
├── alembic/            # Database migrations
├── requirements.txt    # Python dependencies
└── .env.example       # Environment variables template
```

## API Endpoints

### Citizen Endpoints
- `POST /api/citizen/register` - Register a new citizen
- `POST /api/citizen/census` - Submit digital census
- `GET /api/citizen/profile` - Get citizen profile
- `POST /api/citizen/lora/register` - Register LoRa device
- `GET /api/citizen/evacuation/route` - Get evacuation route (AI placeholder)
- `POST /api/citizen/needs/ticket` - Create needs ticket
- `POST /api/citizen/health/report` - Report health symptoms

### Command Center Endpoints
- `GET /api/command/incidents/dashboard` - Get dashboard data
- `POST /api/command/incidents` - Create/activate incident
- `GET /api/command/monitoring/water-level` - Get water level data
- `GET /api/command/monitoring/hazard-map` - Get hazard map (external API)
- `POST /api/command/roll-call/trigger` - Trigger roll call
- `GET /api/command/roll-call/responses` - Get roll call responses
- `GET /api/command/rescue/sos/signals` - Get SOS signals
- `POST /api/command/rescue/dispatch` - Dispatch rescue team
- `GET /api/command/needs/tickets` - Get needs tickets
- `GET /api/command/health/clusters` - Get health clusters (AI placeholder)
- `POST /api/command/health/dispatch` - Dispatch medical team

### Shared Endpoints
- `POST /api/shared/chatbot/message` - Chatbot interaction (AI placeholder)
- `POST /api/shared/mesh/packet` - Mesh network packet transmission
- `POST /api/shared/location/history` - Create location history
- `GET /api/shared/location/history` - Get location history
- `POST /api/shared/location/predict` - Location prediction (AI placeholder)

### Debug Endpoints
- `GET /api/debug/status` - System status
- `GET /api/debug/data` - Debug data dump
- `POST /api/debug/test` - Test endpoint

## Notes

- AI/external library endpoints use `pass` as placeholders and need to be implemented later
- All endpoints are currently placeholders and need business logic implementation
- Database models are defined but migrations need to be run to create tables
