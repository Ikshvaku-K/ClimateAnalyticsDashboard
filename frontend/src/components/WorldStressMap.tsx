import { useState } from 'react';
import type { StressZone } from '../types/api';
import { useData } from '../context/DataContext';

function scoreToColor(score: number): string {
    if (score >= 80) return '#ef4444';
    if (score >= 65) return '#f97316';
    if (score >= 50) return '#f59e0b';
    if (score >= 35) return '#84cc16';
    return '#10b981';
}

// Simple equirectangular projection
function latlngToXY(lat: number, lng: number, w: number, h: number) {
    const x = ((lng + 180) / 360) * w;
    const y = ((90 - lat) / 180) * h;
    return { x, y };
}

export default function WorldStressMap() {
    const { stressZones } = useData();
    const [hovered, setHovered] = useState<StressZone | null>(null);
    const [showProjected, setShowProjected] = useState(false);

    const W = 800, H = 400;

    return (
        <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                    className={`filter-btn ${!showProjected ? 'active' : ''}`}
                    onClick={() => setShowProjected(false)}
                >2025 (Current)</button>
                <button
                    className={`filter-btn ${showProjected ? 'active' : ''}`}
                    onClick={() => setShowProjected(true)}
                >2035 (Projected)</button>

                {/* Legend */}
                <div style={{ display: 'flex', gap: 10, marginLeft: 'auto', alignItems: 'center' }}>
                    {[['LOW', '#10b981'], ['MOD', '#84cc16'], ['ELEV', '#f59e0b'], ['HIGH', '#f97316'], ['CRIT', '#ef4444']].map(([l, c]) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-muted)' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                            {l}
                        </div>
                    ))}
                </div>
            </div>

            <div className="world-map-wrap" style={{ position: 'relative' }}>
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    style={{ width: '100%', height: '100%', minHeight: 360 }}
                >
                    {/* Ocean background */}
                    <rect width={W} height={H} fill="transparent" />

                    {/* Grid lines */}
                    {[-60, -30, 0, 30, 60].map(lat => {
                        const { y } = latlngToXY(lat, 0, W, H);
                        return <line key={lat} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.05)" />;
                    })}
                    {[-120, -60, 0, 60, 120].map(lng => {
                        const { x } = latlngToXY(0, lng, W, H);
                        return <line key={lng} x1={x} y1={0} x2={x} y2={H} stroke="rgba(255,255,255,0.05)" />;
                    })}

                    {/* Equator label */}
                    <text x={8} y={H / 2 + 4} fill="rgba(255,255,255,0.15)" fontSize={9}>0°</text>

                    {/* Stress zones */}
                    {stressZones.map(zone => {
                        const score = showProjected ? zone.projectedScore2035 : zone.stressScore;
                        const color = scoreToColor(score);
                        const { x, y } = latlngToXY(zone.lat, zone.lng, W, H);
                        const r = 10 + (score / 100) * 22;
                        const isH = hovered?.id === zone.id;

                        return (
                            <g key={zone.id}
                                onMouseEnter={() => setHovered(zone)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Glow ring */}
                                {isH && (
                                    <circle cx={x} cy={y} r={r + 6} fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
                                )}
                                <circle
                                    cx={x} cy={y} r={r}
                                    fill={color}
                                    fillOpacity={isH ? 0.85 : 0.65}
                                    stroke={color}
                                    strokeWidth={isH ? 2 : 1}
                                    strokeOpacity={0.8}
                                >
                                    <animate attributeName="r" values={`${r};${r + 3};${r}`} dur="3s" repeatCount="indefinite" />
                                </circle>
                                {/* Score label */}
                                <text x={x} y={y + 4} textAnchor="middle"
                                    fill="white" fontSize={isH ? 11 : 9} fontWeight="bold"
                                    style={{ fontFamily: 'JetBrains Mono', pointerEvents: 'none' }}>
                                    {score.toFixed(0)}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Tooltip */}
                {hovered && (
                    <div style={{
                        position: 'absolute',
                        bottom: 16, left: 16,
                        background: 'var(--bg-card)',
                        border: `1px solid ${scoreToColor(showProjected ? hovered.projectedScore2035 : hovered.stressScore)}60`,
                        borderRadius: 10,
                        padding: '12px 16px',
                        maxWidth: 280,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                        pointerEvents: 'none',
                    }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{hovered.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                            {hovered.countries.join(' · ')}
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                            <div>
                                <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>2025 SCORE</div>
                                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'JetBrains Mono', color: scoreToColor(hovered.stressScore) }}>
                                    {hovered.stressScore}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>2035 PROJ</div>
                                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'JetBrains Mono', color: scoreToColor(hovered.projectedScore2035) }}>
                                    {hovered.projectedScore2035}
                                </div>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '6px 10px', fontSize: 11 }}>
                            ⚡ <span style={{ color: 'var(--text-secondary)' }}>Top Driver:</span> {hovered.topDriver}
                        </div>
                    </div>
                )}
            </div>

            {/* Sortable region table */}
            <div style={{ marginTop: 16, maxHeight: 240, overflowY: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Region</th>
                            <th>2025 Score</th>
                            <th>2035 Projected</th>
                            <th>Top Driver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...stressZones]
                            .sort((a, b) => (showProjected ? b.projectedScore2035 - a.projectedScore2035 : b.stressScore - a.stressScore))
                            .map((z, i) => (
                                <tr key={z.id} onMouseEnter={() => setHovered(z)} onMouseLeave={() => setHovered(null)}
                                    style={{ background: hovered?.id === z.id ? 'var(--bg-hover)' : 'transparent' }}>
                                    <td style={{ fontWeight: 700 }}>#{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{z.name}</td>
                                    <td>
                                        <span style={{ color: scoreToColor(z.stressScore), fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                                            {z.stressScore}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ color: scoreToColor(z.projectedScore2035), fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                                            {z.projectedScore2035}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{z.topDriver}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
