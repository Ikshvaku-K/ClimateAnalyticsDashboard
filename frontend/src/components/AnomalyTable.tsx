import { useState } from 'react';
import type { IndicatorKey } from '../types/api';
import { useData } from '../context/DataContext';

export default function AnomalyTable() {
    const { indicators, anomalies } = useData();
    const [activeInd, setActiveInd] = useState<IndicatorKey | 'all'>('all');
    const [activeSev, setActiveSev] = useState<'all' | 'low' | 'medium' | 'critical'>('all');

    const indLabel = (key: IndicatorKey) => indicators.find((i: any) => i.key === key)?.label ?? key;
    const indColor = (key: IndicatorKey) => indicators.find((i: any) => i.key === key)?.color ?? '#fff';

    const filtered = anomalies.filter(a => {
        const indOk = activeInd === 'all' || a.indicator === activeInd;
        const sevOk = activeSev === 'all' || a.severity === activeSev;
        return indOk && sevOk;
    });

    const sevClass = (s: string) =>
        s === 'critical' ? 'sev-critical' : s === 'medium' ? 'sev-medium' : 'sev-low';

    return (
        <div>
            {/* Filters */}
            <div className="filter-bar">
                <button className={`filter-btn ${activeInd === 'all' ? 'active' : ''}`} onClick={() => setActiveInd('all')}>All Indicators</button>
                {indicators.map((ind: any) => (
                    <button
                        key={ind.key}
                        className={`filter-btn ${activeInd === ind.key ? 'active' : ''}`}
                        onClick={() => setActiveInd(ind.key)}
                    >
                        {ind.icon} {ind.label}
                    </button>
                ))}
            </div>
            <div className="filter-bar">
                {(['all', 'low', 'medium', 'critical'] as const).map(sev => (
                    <button
                        key={sev}
                        className={`filter-btn ${activeSev === sev ? 'active' : ''}`}
                        onClick={() => setActiveSev(sev)}
                    >
                        {sev.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Stats bar */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                {(['critical', 'medium', 'low'] as const).map(sev => {
                    const count = filtered.filter(a => a.severity === sev).length;
                    const col = sev === 'critical' ? '#ef4444' : sev === 'medium' ? '#f59e0b' : '#10b981';
                    return (
                        <div key={sev} style={{ background: 'var(--bg-surface)', border: `1px solid ${col}40`, borderRadius: 8, padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'JetBrains Mono', color: col }}>{count}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{sev}</span>
                        </div>
                    );
                })}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)' }}>{filtered.length}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL</span>
                </div>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Indicator</th>
                            <th>Value</th>
                            <th>Z-Score</th>
                            <th>Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No anomalies found for selected filters.</td></tr>
                        ) : filtered.map((a, i) => (
                            <tr key={i}>
                                <td style={{ fontWeight: 700 }}>{a.year}</td>
                                <td>
                                    <span style={{ color: indColor(a.indicator as IndicatorKey), fontWeight: 600 }}>
                                        {indicators.find((ind: any) => ind.key === a.indicator)?.icon} {indLabel(a.indicator as IndicatorKey)}
                                    </span>
                                </td>
                                <td>{a.value.toFixed(a.indicator === 'co2' ? 1 : a.indicator === 'seaLevel' ? 1 : 2)}</td>
                                <td style={{ color: Math.abs(a.zScore) >= 2.5 ? '#ef4444' : Math.abs(a.zScore) >= 2.0 ? '#f97316' : '#f59e0b' }}>
                                    {a.zScore > 0 ? '+' : ''}{a.zScore}
                                </td>
                                <td>
                                    <span className={`severity-badge ${sevClass(a.severity)}`}>{a.severity}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
