// src/api/client.ts
import type {
    ClimateRecord,
    Indicator,
    StressZone,
    Anomaly,
    TrendResult,
    RiskScore,
    CorrelationCell,
    IndicatorForecast,
    RiskScoreForecast
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function fetchInternal<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}

export const api = {
    getClimateData: () => fetchInternal<ClimateRecord[]>('/data/climate'),
    getIndicators: () => fetchInternal<Indicator[]>('/data/indicators'),
    getStressZones: () => fetchInternal<StressZone[]>('/data/stress-zones'),

    getAnomalies: () => fetchInternal<Anomaly[]>('/analytics/anomalies'),
    getTrends: () => fetchInternal<TrendResult[]>('/analytics/trends'),
    getRiskScores: () => fetchInternal<RiskScore[]>('/analytics/risk-scores'),
    getCorrelation: () => fetchInternal<CorrelationCell[]>('/analytics/correlation'),
    getForecasts: () => fetchInternal<IndicatorForecast[]>('/analytics/forecasts'),
    getRiskForecast: () => fetchInternal<RiskScoreForecast[]>('/analytics/risk-forecast'),
};
