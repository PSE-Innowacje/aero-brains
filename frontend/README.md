# AERO Frontend

Frontend application for aviation operations management (AERO).

## Tech Stack

- React 19 + TypeScript
- Vite
- MUI (Material UI) + MUI X Data Grid
- React Router v7
- React Hook Form + Zod
- TanStack Query (React Query)
- React Leaflet (maps)
- Axios (API client)

## Prerequisites

- Node.js 18+
- npm

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:3000**.

## Backend Connection

By default the app connects to the backend API at `http://localhost:8080/api/` via Vite proxy.

To start the backend:

```bash
cd backend
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.10
gradlew.bat bootRun --args="--spring.profiles.active=dev-h2"
```

### Mock Mode

To run without a backend, set `USE_MOCK = true` in `src/api/client.ts`. This uses in-memory mock data.

## Login Credentials

| Email | Password | Role |
|---|---|---|
| `admin@aero.pl` | `password` | Administrator |
| `planner@aero.pl` | `password` | Planner |
| `supervisor@aero.pl` | `password` | Supervisor |
| `pilot@aero.pl` | `password` | Pilot |

## Build

```bash
npm run build
```

Output in `dist/`.

## Project Structure

```
src/
  api/            Types, mock data, API client (axios + mock toggle)
  auth/           Auth context, route guards
  features/
    helicopters/  List, form, schema
    crew/         List, form, schema
    landing-sites/List, form, schema
    users/        List, form, schema
    operations/   List, form, schema, status actions, KML upload, map
    flight-orders/List, form, schema, status actions, validation, map
  layout/         App shell (sidebar), login page, menu config
  shared/
    components/   DataTable, MapView, StatusBadge, PageHeader, Card
    utils/        Permissions, KML parser
  router.tsx      Route definitions
  App.tsx         Root component with providers
  main.tsx        Entry point
```
