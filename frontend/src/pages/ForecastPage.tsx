
import Layout from '../components/Layout';
import ForecastChart from '../components/ForecastChart';
import WorldStressMap from '../components/WorldStressMap';
import RiskScoreGauge from '../components/RiskScoreGauge';
import { useData } from '../context/DataContext';

export default function ForecastPage() {
    const { riskScoreForecast, stressZones } = useData();
    const forecast2035 = riskScoreForecast.find(p => p.year === 2035);
    const highRiskRegions = stressZones.filter(z => z.projectedScore2035 >= 80).length;
    const criticalRegions = stressZones.filter(z => z.projectedScore2035 >= 90).length;

    return (
        <Layout pageTitle="🔮 Forecast — ML Climate Projections 2025–2035">
            <div className="page-gap">

                {/* Summary stats */}
                <div className="grid-auto">
                    <div className="stat-box">
                        <div className="stat-box-label">2025 Risk Score</div>
                        <div className="stat-box-value" style={{ color: '#ef4444' }}>
                            {riskScoreForecast.find(p => p.year === 2025)?.score.toFixed(1)}
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">2030 Projected</div>
                        <div className="stat-box-value" style={{ color: '#ef4444' }}>
                            {riskScoreForecast.find(p => p.year === 2030)?.score.toFixed(1)}
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">2035 Projected</div>
                        <div className="stat-box-value" style={{ color: '#dc2626' }}>
                            {forecast2035?.score.toFixed(1) ?? '—'}
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">High-Risk Regions</div>
                        <div className="stat-box-value" style={{ color: '#f97316' }}>{highRiskRegions}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">Critical Zones (2035)</div>
                        <div className="stat-box-value" style={{ color: '#ef4444' }}>{criticalRegions}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">Model Type</div>
                        <div className="stat-box-value" style={{ color: 'var(--accent-cyan)', fontSize: 11, lineHeight: 1.4, paddingTop: 4 }}>
                            Poly Reg.<br />Degree 2
                        </div>
                    </div>
                </div>

                {/* Gauges for current vs projected */}
                <div className="grid-2">
                    <div className="card">
                        <div className="card-title"><span className="card-title-icon">🎯</span>2025 Risk Score (Current)</div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <RiskScoreGauge score={riskScoreForecast.find(p => p.year === 2025)?.score} />
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-title"><span className="card-title-icon">🎯</span>2035 Risk Score (Projected)</div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <RiskScoreGauge score={forecast2035?.score} />
                        </div>
                    </div>
                </div>

                {/* Forecast chart */}
                <div className="card">
                    <div className="card-title"><span className="card-title-icon">📈</span>ML Indicator Forecast — 2026–2035</div>
                    <ForecastChart />
                </div>

                {/* World stress map */}
                <div className="card">
                    <div className="card-title"><span className="card-title-icon">🌍</span>Global Climate Stress Zones</div>
                    <WorldStressMap />
                </div>

            </div>
        </Layout>
    );
}
