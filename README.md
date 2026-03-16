# Climate Analytics Application

**Climate Analytics** is a comprehensive, full-stack platform engineered to monitor, analyze, and forecast critical global environmental metrics. Designed to surface the hidden structural relationships within complex ecological datasets, it empowers researchers and policymakers with actionable, data-driven insights. 

The platform continuously evaluates planetary health through several core analytical engines:
*   **Real-time Anomaly Detection**: Utilizing Z-score evaluations to monitor indicators against historical baselines, instantly categorizing severe deviations into low, medium, or critical threats.
*   **Statistical Trend Analysis**: Applying linear regression models to isolate definitive trajectories, removing noise to confidently classify indicators as rising, falling, or stable.
*   **Correlation Mapping**: Constructing Pearson correlation matrices to reveal chain reactions, demonstrating how a shift in one metric mathematically impacts another across the globe.
*   **Predictive Forecasting**: Leveraging polynomial regression to project high-confidence environmental states into the future (through 2035), charting strict confidence intervals to eliminate guesswork in long-term planning.
*   **Composite Risk Scoring**: Synthesizing multidimensional data streams into a single, normalized threat assessment gauge for instant planetary stress evaluation.

This robust capability is achieved through a decoupled architecture. The high-performance backend, built with Python and FastAPI, executes all deterministic mathematical modeling, data manipulation, and heavy computation using NumPy. The backend serves this intelligence via REST APIs to a highly responsive React frontend. Built with Vite and TypeScript, the interface utilizes Recharts for dynamic, interactive data visualization, ensuring the rigorous analytics are accessible and easy to explore. The entire application is architected for simple deployment, with a fully configurable frontend that easily ports to any static hosting environment.

## Project Structure

- `frontend/`: Contains the React frontend application.
- `backend/`: Contains the Python FastAPI backend application.

## Running the Application

### Backend

The backend is built with Python and FastAPI.

1. Navigate to the project root.
2. Start the backend server:

```bash
export PYTHONPATH=$PYTHONPATH:$(pwd)/backend && backend/venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at `http://localhost:8000`.

### Frontend

The frontend is a React application built with Vite. It is designed to be easily deployable.

1. Navigate to the `frontend/` directory:

```bash
cd frontend
```

2. Install dependencies (if not already installed):

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

#### Configuring the Backend URL

By default, the frontend expects the backend to be running at `http://localhost:8000/api`. 
To connect to a different backend URL (e.g., in a production environment), set the `VITE_API_BASE_URL` environment variable.

You can do this by creating a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

## Deployment

### Frontend

To build the frontend for production, run:

```bash
cd frontend
npm run build
```

This will create a `dist/` directory containing the minified static files, which can be served by any static file host (e.g., Vercel, Netlify, AWS S3).
