import { useData } from '../context/DataContext';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function IndicatorCards() {
    const { climateDataset, indicators, anomalies } = useData();

    if (climateDataset.length < 2) return null;

    const latestYear = climateDataset[climateDataset.length - 1];
    const prevYear = climateDataset[climateDataset.length - 2];

    return (
        <div className="grid-6">
            {indicators.map((ind, i) => {
                const current = latestYear[ind.key] as number;
                const previous = prevYear[ind.key] as number;
                const change = current - previous;
                const isWorse = ind.inverted ? change < 0 : change > 0;

                // Check if 2025 has an anomaly for this indicator
                const hasAnomaly = anomalies.some(a => a.year === 2025 && a.indicator === ind.key)
                    || anomalies.some(a => a.year === 2024 && a.indicator === ind.key);

                // Mini sparkline data: last 10 years
                const sparkData = climateDataset.slice(-10).map(d => ({
                    v: d[ind.key] as number,
                }));

                return (
                    <div
                        key={ind.key}
                        className="indicator-card animate-in"
                        style={{
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ['--ind-color' as any]: ind.color,
                            animationDelay: `${i * 80}ms`,
                        }}
                    >
                        <div className="ind-header">
                            <span className="ind-icon">{ind.icon}</span>
                            {hasAnomaly
                                ? <span className="ind-badge badge-anomaly">ANOMALY</span>
                                : <span className="ind-badge badge-normal">NORMAL</span>
                            }
                        </div>

                        <div className="ind-label">{ind.label}</div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            <span className="ind-value">{typeof current === 'number' && current % 1 !== 0 ? current.toFixed(ind.key === 'co2' ? 1 : 2) : current}</span>
                            <span className="ind-unit">{ind.unit}</span>
                        </div>

                        <div className={`ind-change ${isWorse ? 'positive' : 'negative'}`}>
                            {isWorse ? '▲' : '▼'} {Math.abs(change).toFixed(ind.key === 'co2' ? 1 : 2)} {ind.unit} YoY
                        </div>

                        {/* Sparkline */}
                        <div style={{ marginTop: 8, height: 36 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sparkData}>
                                    <Line
                                        type="monotone"
                                        dataKey="v"
                                        stroke={ind.color}
                                        strokeWidth={1.5}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
