import { useState } from 'react';
import {
    ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts';
import type { IndicatorKey } from '../types/api';
import { useData } from '../context/DataContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const isForecast = label > 2025;
    return (
        <div style={{
            background: 'var(--bg-card)',
            border: `1px solid ${isForecast ? 'rgba(168,85,247,0.4)' : 'var(--border)'}`,
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
            <div style={{ fontWeight: 700, marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)' }}>{label}</span>
                {isForecast && <span style={{ fontSize: 9, color: '#a855f7', border: '1px solid #a855f7', borderRadius: 4, padding: '1px 5px' }}>FORECAST</span>}
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {payload.map((p: any) => p.value != null && (
                <div key={p.dataKey} style={{ color: p.color, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                    {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
                </div>
            ))}
        </div>
    );
};

export default function ForecastChart() {
    const { indicators, forecasts, riskScoreForecast } = useData();

    const [activeInd, setActiveInd] = useState<IndicatorKey>('gmst');
    const [showRiskForecast, setShowRiskForecast] = useState(false);

    const indForecast = forecasts.find(f => f.indicator === activeInd);
    const ind = indicators.find(i => i.key === activeInd);

    if (!ind) return null;

    const chartData = indForecast?.points.map(p => ({
        year: p.year,
        value: p.isForecast ? undefined : p.value,
        forecastValue: p.isForecast ? p.value : p.value,   // overlap at 2025
        lower: p.isForecast ? p.lower : undefined,
        upper: p.isForecast ? p.upper : undefined,
        isForecast: p.isForecast,
    })) ?? [];

    const riskData = riskScoreForecast.map(p => ({
        year: p.year,
        riskHist: !p.isForecast ? p.score : undefined,
        riskFcast: p.isForecast ? p.score : p.score,
        riskLower: p.isForecast ? p.lower : undefined,
        riskUpper: p.isForecast ? p.upper : undefined,
    }));

    const displayData = showRiskForecast ? riskData : chartData;

    return (
        <div>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="toggle-chips">
                    {indicators.map((i: any) => (
                        <div
                            key={i.key}
                            className={`chip ${activeInd === i.key && !showRiskForecast ? 'on' : ''}`}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            style={{ ['--chip-color' as any]: i.color }}
                            onClick={() => { setActiveInd(i.key); setShowRiskForecast(false); }}
                        >
                            <span className="chip-dot" />
                            {i.icon} {i.label}
                        </div>
                    ))}
                    <div
                        className={`chip ${showRiskForecast ? 'on' : ''}`}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        style={{ ['--chip-color' as any]: '#a855f7' }}
                        onClick={() => setShowRiskForecast(true)}
                    >
                        <span className="chip-dot" />
                        🎯 Risk Score
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="forecast-legend">
                <div className="legend-item">
                    <div className="legend-line" style={{ background: showRiskForecast ? '#a855f7' : ind.color }} />
                    <span>Historical (2000–2025)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-line dashed" style={{ borderColor: showRiskForecast ? '#a855f7' : ind.color }} />
                    <span>ML Forecast (2026–2035)</span>
                </div>
                <div className="legend-item">
                    <div style={{ width: 20, height: 10, background: showRiskForecast ? 'rgba(168,85,247,0.2)' : 'rgba(59,130,246,0.2)', borderRadius: 2 }} />
                    <span>95% Confidence Band</span>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                    Model: Polynomial Regression (degree 2) · Extrapolated from 26-year record
                </div>
            </div>

            <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={displayData} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(30,48,80,0.4)" strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine x={2025} stroke="rgba(168,85,247,0.5)" strokeDasharray="4 4" label={{ value: 'NOW', fill: '#a855f7', fontSize: 10 }} />

                    {showRiskForecast ? (
                        <>
                            <Area dataKey="riskLower" fill="rgba(168,85,247,0.1)" stroke="none" fillOpacity={1} />
                            <Area dataKey="riskUpper" fill="rgba(168,85,247,0.1)" stroke="none" fillOpacity={1} />
                            <Line dataKey="riskHist" stroke="#a855f7" strokeWidth={2.5} dot={false} name="Risk Score (hist.)" />
                            <Line dataKey="riskFcast" stroke="#a855f7" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Risk Score (forecast)" />
                        </>
                    ) : (
                        <>
                            <Area dataKey="lower" fill={`${ind.color}18`} stroke="none" fillOpacity={1} name="Lower 95%" />
                            <Area dataKey="upper" fill={`${ind.color}18`} stroke="none" fillOpacity={1} name="Upper 95%" />
                            <Line dataKey="value" stroke={ind.color} strokeWidth={2.5} dot={false} name={`${ind.label} (historical)`} />
                            <Line dataKey="forecastValue" stroke={ind.color} strokeWidth={2} strokeDasharray="6 3" dot={false} name={`${ind.label} (forecast)`} />
                        </>
                    )}
                </ComposedChart>
            </ResponsiveContainer>

            {/* Forecast summary table */}
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {[2026, 2028, 2030, 2032, 2035].map(yr => {
                    const pt = showRiskForecast
                        ? riskScoreForecast.find(p => p.year === yr)
                        : indForecast?.points.find(p => p.year === yr);
                    if (!pt) return null;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const val = showRiskForecast ? (pt as any).score : (pt as any).value;
                    return (
                        <div key={yr} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{yr} PROJ.</div>
                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, color: showRiskForecast ? '#a855f7' : ind.color }}>
                                {typeof val === 'number' ? val.toFixed(showRiskForecast ? 1 : 2) : '—'}
                            </div>
                            {!showRiskForecast && (
                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{ind.unit}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
