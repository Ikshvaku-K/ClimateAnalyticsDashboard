import { useData } from '../context/DataContext';

interface Props {
    score?: number;
}

const RADIUS = 80;
const STROKE = 14;
const CX = 100;
const CY = 100;
// Arc from 210° to 330° (240° sweep)
const START_ANGLE = 210;
const SWEEP = 240;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToXY(cx, cy, r, endAngle);
    const end = polarToXY(cx, cy, r, startAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

const STOPS = [
    { pct: 0, color: '#10b981' },
    { pct: 0.4, color: '#f59e0b' },
    { pct: 0.65, color: '#f97316' },
    { pct: 0.85, color: '#ef4444' },
    { pct: 1, color: '#dc2626' },
];

function scoreColor(s: number): string {
    if (s >= 75) return '#ef4444';
    if (s >= 55) return '#f97316';
    if (s >= 35) return '#f59e0b';
    return '#10b981';
}

function scoreLabel(s: number): string {
    if (s >= 80) return 'CRITICAL';
    if (s >= 65) return 'HIGH';
    if (s >= 45) return 'ELEVATED';
    if (s >= 25) return 'MODERATE';
    return 'LOW';
}

export default function RiskScoreGauge({ score }: Props) {
    const { riskScores } = useData();
    const currentRiskScore = riskScores.length > 0 ? riskScores[riskScores.length - 1] : null;
    const s = score ?? currentRiskScore?.score ?? 0;
    const fillFraction = s / 100;
    const fillEndAngle = START_ANGLE + SWEEP * fillFraction;
    const color = scoreColor(s);

    const bgPath = describeArc(CX, CY, RADIUS, START_ANGLE, START_ANGLE + SWEEP);
    const fillPath = describeArc(CX, CY, RADIUS, START_ANGLE, fillEndAngle);

    // Needle
    const needleAngle = START_ANGLE + SWEEP * fillFraction;
    const needleTip = polarToXY(CX, CY, RADIUS - 4, needleAngle);
    const needleBase1 = polarToXY(CX, CY, 12, needleAngle + 90);
    const needleBase2 = polarToXY(CX, CY, 12, needleAngle - 90);

    return (
        <div className="gauge-container">
            <svg viewBox="0 0 200 160" width="200" height="160" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        {STOPS.map((s, i) => (
                            <stop key={i} offset={`${s.pct * 100}%`} stopColor={s.color} />
                        ))}
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Background track */}
                <path d={bgPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} strokeLinecap="round" />

                {/* Filled arc */}
                <path
                    d={fillPath}
                    fill="none"
                    stroke="url(#gaugeGrad)"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    filter="url(#glow)"
                />

                {/* Needle */}
                <polygon
                    points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
                    fill={color}
                    opacity={0.9}
                />
                <circle cx={CX} cy={CY} r={8} fill={color} />
                <circle cx={CX} cy={CY} r={4} fill="var(--bg-card)" />

                {/* Score text */}
                <text x={CX} y={CY + 38} textAnchor="middle" fill={color}
                    style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 26, fontWeight: 900 }}>
                    {s.toFixed(1)}
                </text>
                <text x={CX} y={CY + 52} textAnchor="middle" fill="var(--text-muted)"
                    style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', letterSpacing: 2 }}>
                    RISK SCORE
                </text>

                {/* Tick labels */}
                {[0, 25, 50, 75, 100].map(v => {
                    const a = START_ANGLE + SWEEP * (v / 100);
                    const p = polarToXY(CX, CY, RADIUS + 14, a);
                    return (
                        <text key={v} x={p.x} y={p.y + 3} textAnchor="middle" fill="var(--text-muted)"
                            style={{ fontSize: 7.5, fontFamily: 'JetBrains Mono' }}>
                            {v}
                        </text>
                    );
                })}
            </svg>

            <div className="gauge-level" style={{ color }}>{scoreLabel(s)}</div>
            <div className="gauge-sublabel">Composite Climate Risk Index</div>
        </div>
    );
}
