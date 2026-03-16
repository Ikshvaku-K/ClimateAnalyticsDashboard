// src/context/DataContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api/client';
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

interface DataContextState {
    climateDataset: ClimateRecord[];
    indicators: Indicator[];
    stressZones: StressZone[];
    anomalies: Anomaly[];
    trends: TrendResult[];
    riskScores: RiskScore[];
    correlationMatrix: CorrelationCell[];
    forecasts: IndicatorForecast[];
    riskScoreForecast: RiskScoreForecast[];
    loading: boolean;
    error: string | null;
}

const DataContext = createContext<DataContextState | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<DataContextState>({
        climateDataset: [],
        indicators: [],
        stressZones: [],
        anomalies: [],
        trends: [],
        riskScores: [],
        correlationMatrix: [],
        forecasts: [],
        riskScoreForecast: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch basic data
                const [
                    climateDataset,
                    indicators,
                    stressZones
                ] = await Promise.all([
                    api.getClimateData(),
                    api.getIndicators(),
                    api.getStressZones()
                ]);

                // Fetch analytics (we could optimize this on the backend with an aggregated endpoint, 
                // but this works fine for demonstration)
                const [
                    anomalies,
                    trends,
                    riskScores,
                    correlationMatrix,
                    forecasts,
                    riskScoreForecast
                ] = await Promise.all([
                    api.getAnomalies(),
                    api.getTrends(),
                    api.getRiskScores(),
                    api.getCorrelation(),
                    api.getForecasts(),
                    api.getRiskForecast()
                ]);

                setState({
                    climateDataset,
                    indicators,
                    stressZones,
                    anomalies,
                    trends,
                    riskScores,
                    correlationMatrix,
                    forecasts,
                    riskScoreForecast,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error("Failed to load data:", error);
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Failed to connect to the backend API. Please make sure the Python server is running on localhost:8000."
                }));
            }
        }

        loadData();
    }, []);

    return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
