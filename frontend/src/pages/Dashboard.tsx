import Layout from '../components/Layout';
import RiskScoreGauge from '../components/RiskScoreGauge';
import IndicatorCards from '../components/IndicatorCards';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { useData } from '../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function RiskScoreBreakdown({ currentRiskScore, INDICATORS }: any) {
    const breakdown = currentRiskScore.breakdown;
    return (
        <div>
            {INDICATORS.map((ind: any) => {
                const score = breakdown[ind.key];
                return (
                    <div key={ind.key} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 11 }}>
                            <span style={{ color: ind.color }}>{ind.icon} {ind.label}</span>
                            <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-primary)', fontWeight: 600 }}>
                                {score.toFixed(0)} / 100 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(×{ind.weight})</span>
                            </span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${score}%`, background: ind.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function RiskScoreHistory({ riskScores }: any) {
    return (
        <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={riskScores} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(30,48,80,0.3)" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="score" name="Risk Score" stroke="#ef4444" fill="url(#riskGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default function Dashboard() {
    const { riskScores, indicators } = useData();
    const currentRiskScore = riskScores.length > 0 ? riskScores[riskScores.length - 1] : { score: 0, breakdown: {} };

    return (
        <Layout pageTitle="📊 Climate Risk Dashboard — 2000–2025">
            <div className="page-gap">

                {/* Indicator cards */}
                <div>
                    <div className="section-header">
                        <div className="section-title"><span className="dot" />Key Climate Indicators — 2025</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Annual · Anomaly detection: Z-score threshold 1.8σ</div>
                    </div>
                    <IndicatorCards />
                </div>

                {/* Gauge + breakdown + risk history */}
                <div className="grid-3">
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="card-title"><span className="card-title-icon">🎯</span>Composite Risk Score</div>
                        <RiskScoreGauge />
                    </div>

                    <div className="card">
                        <div className="card-title"><span className="card-title-icon">📊</span>Score Breakdown by Indicator</div>
                        <div style={{ marginTop: 4 }}>
                            <RiskScoreBreakdown currentRiskScore={currentRiskScore} INDICATORS={indicators} />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title"><span className="card-title-icon">📈</span>Risk Score History (2000–2025)</div>
                        <RiskScoreHistory riskScores={riskScores} />
                        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 12px' }}>
                                <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>2000 SCORE</div>
                                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#10b981' }}>{riskScores.length > 0 ? riskScores[0].score : '--'}</div>
                            </div>
                            <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 12px' }}>
                                <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>2025 SCORE</div>
                                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#ef4444' }}>{currentRiskScore?.score || '--'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time series */}
                <div className="card">
                    <div className="card-title"><span className="card-title-icon">📉</span>Multi-Indicator Time Series</div>
                    <TimeSeriesChart />
                </div>

            </div>
        </Layout>
    );
}
