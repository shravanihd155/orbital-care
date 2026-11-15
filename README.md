# ORBITAL CARE
### Space Habitat Health Monitoring & Decision Support

ORBITAL CARE is a research-driven prototype for exploring astronaut health monitoring, sleep analytics and explainable health observations in space-habitat environments.

## Features
- Interactive astronaut-inspired dashboard
- Three research participant profiles
- Sleep duration, latency and efficiency analytics
- Participant baseline comparisons where valid data exists
- Interactive body map
- Explainable health observations and alerts
- Research data provenance tracking
- React + TypeScript frontend
- Python FastAPI backend

## Research Dataset

**NASA UTMB Bedrest Campaign 1 Actigraphy**

- 207 records across 3 participants
- 60-day, 6-degree Head-Down Tilt bedrest study
- Wrist actigraphy measurements
- Sleep duration, latency and efficiency

This is terrestrial bedrest research used as a microgravity analogue. It is not live astronaut telemetry.

Missing measurements remain unavailable rather than being treated as zero. Baselines are only calculated where valid observations exist.

## Technology
- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts
- Backend: Python and FastAPI
- Data: `frontend/src/data/utmbBedrestActigraphy.ts`

## Run Locally

### Backend

From the repository root:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
cd backend
python -m uvicorn main:app --reload
```

API: http://localhost:8000

API documentation: http://localhost:8000/docs

### Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Dashboard: http://localhost:5173

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health |
| GET | `/api/dataset` | Dataset metadata |
| GET | `/api/participants` | Participant list |
| GET | `/api/participants/{id}` | Participant details |
| GET | `/api/participants/{id}/observations` | Explainable observations |
| GET | `/api/participants/{id}/records` | Research records |

## Testing

Frontend:

```powershell
npm test -- --run
npm run build
```

Backend:

```powershell
python -m pytest tests -q
```

## Limitations
- Bedrest analogue research is not direct spaceflight measurement.
- Simulated signals must be distinguished from verified research data.
- Observations are experimental decision-support outputs, not medical diagnoses.
- This prototype does not replace professional medical assessment.

## Project Status

Working prototype with an interactive dashboard, connected research-data API, participant analytics and automated tests.