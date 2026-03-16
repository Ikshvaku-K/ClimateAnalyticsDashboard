from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data import climate_dataset, indicators, stress_zones
import analytics

app = FastAPI(title="Climate Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/data/climate")
def get_climate_data():
    return climate_dataset

@app.get("/api/data/indicators")
def get_indicators():
    return indicators

@app.get("/api/data/stress-zones")
def get_stress_zones():
    return stress_zones

@app.get("/api/analytics/anomalies")
def get_anomalies():
    return analytics.get_anomalies()

@app.get("/api/analytics/trends")
def get_trends():
    return analytics.get_trends()

@app.get("/api/analytics/risk-scores")
def get_risk_scores():
    return analytics.get_risk_scores()

@app.get("/api/analytics/correlation")
def get_correlation():
    return analytics.get_correlation_matrix()

@app.get("/api/analytics/forecasts")
def get_forecasts():
    return analytics.get_forecasts()

@app.get("/api/analytics/risk-forecast")
def get_risk_forecast():
    return analytics.get_risk_score_forecast()
