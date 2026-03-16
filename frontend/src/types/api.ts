// src/types/api.ts

export interface ClimateRecord {
    year: number;
    gmst: number;
    co2: number;
    seaIce: number;
    seaLevel: number;
    oceanHeat: number;
    extremeIndex: number;
}

export interface Indicator {
    key: 'gmst' | 'co2' | 'seaIce' | 'seaLevel' | 'oceanHeat' | 'extremeIndex';
    label: string;
    unit: string;
    color: string;
    description: string;
    weight: number;
    icon: string;
    inverted: boolean;
}

export type IndicatorKey = Indicator['key'];

export interface StressZone {
    id: string;
    name: string;
    lat: number;
    lng: number;
    stressScore: number;
    topDriver: string;
    projectedScore2035: number;
    countries: string[];
}

export interface Anomaly {
    year: number;
    indicator: IndicatorKey;
    value: number;
    zScore: number;
    severity: 'low' | 'medium' | 'critical';
}

export interface TrendResult {
    indicator: IndicatorKey;
    slope: number;
    intercept: number;
    r2: number;
    direction: 'rising' | 'falling' | 'stable';
    changePerDecade: number;
}

export interface RiskScore {
    year: number;
    score: number;
    breakdown: Record<IndicatorKey, number>;
}

export interface CorrelationCell {
    x: IndicatorKey;
    y: IndicatorKey;
    value: number;
}

export interface ForecastPoint {
    year: number;
    value: number;
    lower: number;
    upper: number;
    isForecast: boolean;
}

export interface IndicatorForecast {
    indicator: IndicatorKey;
    points: ForecastPoint[];
}

export type RiskScoreForecast = {
    year: number;
    score: number;
    lower: number;
    upper: number;
    isForecast: boolean;
};
