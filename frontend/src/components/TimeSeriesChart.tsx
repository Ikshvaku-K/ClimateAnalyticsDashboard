import { useState, useCallback } from 'react';
import {
    ComposedChart, Line, ReferenceLine, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import type { IndicatorKey } from '../types/api';
import { useData } from '../context/DataContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label, anomalyYears }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
                Year {label}
                {anomalyYears.has(label) && (
                    <span style={{ marginLeft: 8, fontSize: 10, color: '#ef4444', border: '1px solid #ef4444', borderRadius: 4, padding: '1px 5px' }}>ANOMALY</span>
                )}
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {payload.map((p: any) => (
                <div key={p.dataKey} style={{ color: p.color, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                    {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
                </div>
            ))}
        </div>
    );
};

export default function TimeSeriesChart() {
    const { climateDataset, indicators, anomalies, riskScores } = useData();
    const anomalyYears = new Set(anomalies.map(a => a.year));

    const [active, setActive] = useState<Record<IndicatorKey, boolean>>({
        gmst: true, co2: false, seaIce: true, seaLevel: false, oceanHeat: false, extremeIndex: false,
    });
    const [showRisk, setShowRisk] = useState(true);
    const [yearRange, setYearRange] = useState<[number, number]>([2000, 2025]);

    const toggleIndicator = useCallback((key: IndicatorKey) => {
        setActive(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const data = climateDataset
        .filter(d => d.year >= yearRange[0] && d.year <= yearRange[1])
        .map(d => {
            const riskObj = riskScores.find(r => r.year === d.year);
            return { ...d, riskScore: riskObj?.score };
        });

    const anomalyYearsInRange = anomalies
        .filter(a => a.year >= yearRange[0] && a.year <= yearRange[1])
        .reduce<number[]>((acc, a) => acc.includes(a.year) ? acc : [...acc, a.year], []);

    // Normalize CO2 and seaLevel for dual-axis display
    // We'll use left axis for gmst/seaIce and right for co2, seaLevel, etc.
    const leftKeys: IndicatorKey[] = ['gmst', 'seaIce'];
    const rightKeys: IndicatorKey[] = ['co2', 'seaLevel', 'oceanHeat', 'extremeIndex'];



    return (
        <div>
            {/* Indicator toggles */}
            <div className="toggle-chips">
                {indicators.map(ind => (
                    <div
                        key={ind.key}
                        className={`chip ${active[ind.key] ? 'on' : ''}`}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        style={{ ['--chip-color' as any]: ind.color }}
                        onClick={() => toggleIndicator(ind.key)}
                    >
                        <span className="chip-dot" />
                        {ind.label}
                    </div>
                ))}
                <div
                    className={`chip ${showRisk ? 'on' : ''}`}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    style={{ ['--chip-color' as any]: '#a855f7' }}
                    onClick={() => setShowRisk(p => !p)}
                >
                    <span className="chip-dot" />
                    Risk Score
                </div>
            </div>

            {/* Year range */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span>Range:</span>
                <input type="range" min="2000" max="2025" step="1"
                    value={yearRange[0]}
                    onChange={e => setYearRange([Math.min(+e.target.value, yearRange[1] - 2), yearRange[1]])}
                    style={{ accentColor: 'var(--accent-blue)', width: 80 }}
                />
                <span style={{ fontFamily: 'JetBrains Mono' }}>{yearRange[0]}–{yearRange[1]}</span>
                <input type="range" min="2000" max="2025" step="1"
                    value={yearRange[1]}
                    onChange={e => setYearRange([yearRange[0], Math.max(+e.target.value, yearRange[0] + 2)])}
                    style={{ accentColor: 'var(--accent-blue)', width: 80 }}
                />
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <ComposedChart data={data} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(30,48,80,0.4)" strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={['auto', 'auto']} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip anomalyYears={anomalyYears} />} />

                    {/* Anomaly reference lines */}
                    {anomalyYearsInRange.map(yr => (
                        <ReferenceLine
                            key={yr}
                            yAxisId="left"
                            x={yr}
                            stroke="rgba(239,68,68,0.3)"
                            strokeDasharray="4 3"
                        />
                    ))}

                    {/* Left-axis indicators */}
                    {indicators.filter(i => active[i.key] && leftKeys.includes(i.key)).map(ind => (
                        <Line
                            key={ind.key}
                            yAxisId="left"
                            type="monotone"
                            dataKey={ind.key}
                            name={ind.label}
                            stroke={ind.color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    ))}

                    {/* Right-axis indicators */}
                    {indicators.filter(i => active[i.key] && rightKeys.includes(i.key)).map(ind => (
                        <Line
                            key={ind.key}
                            yAxisId="right"
                            type="monotone"
                            dataKey={ind.key}
                            name={ind.label}
                            stroke={ind.color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    ))}

                    {/* Risk Score area */}
                    {showRisk && (
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="riskScore"
                            name="Risk Score"
                            stroke="#a855f7"
                            strokeWidth={2}
                            strokeDasharray="5 3"
                            dot={false}
                            activeDot={{ r: 5 }}
                        />
                    )}
                </ComposedChart>
            </ResponsiveContainer>

            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                🔴 Vertical dashed lines mark anomaly years (|Z-score| &gt; 1.8)
            </div>
        </div>
    );
}
