import Layout from '../components/Layout';
import AnomalyTable from '../components/AnomalyTable';
import TrendPanel from '../components/TrendPanel';
import CorrelationMatrix from '../components/CorrelationMatrix';
import { useData } from '../context/DataContext';

export default function AnalyticsPage() {
    const { anomalies, trends } = useData();
    const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
    const totalAnomalies = anomalies.length;

    return (
        <Layout pageTitle="🔬 Analytics — Anomaly Detection & Trend Analysis">
            <div className="page-gap">
                {/* Stats */}
                <div className="grid-auto">
                    <div className="stat-box">
                        <div className="stat-box-label">Total Anomalies</div>
                        <div className="stat-box-value" style={{ color: 'var(--accent-yellow)' }}>{totalAnomalies}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">Critical Events</div>
                        <div className="stat-box-value" style={{ color: 'var(--accent-red)' }}>{criticalCount}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">Detection Threshold</div>
                        <div className="stat-box-value" style={{ color: 'var(--accent-cyan)', fontSize: 16 }}>|Z| ≥ 1.8σ</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">Indicators Tracked</div>
                        <div className="stat-box-value" style={{ color: 'var(--accent-blue)' }}>6</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">Indicators Rising</div>
                        <div className="stat-box-value" style={{ color: 'var(--accent-red)' }}>
                            {trends.filter(t => t.direction === 'rising').length}
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-label">Avg R² Fit</div>
                        <div className="stat-box-value" style={{ color: 'var(--accent-green)', fontSize: 16 }}>
                            {(trends.reduce((s, t) => s + t.r2, 0) / trends.length).toFixed(3)}
                        </div>
                    </div>
                </div>

                {/* Anomaly table */}
                <div className="card">
                    <div className="card-title"><span className="card-title-icon">⚠️</span>Anomaly Events Log</div>
                    <AnomalyTable />
                </div>

                {/* Trend panel */}
                <div className="card">
                    <div className="card-title"><span className="card-title-icon">📐</span>Indicator Trend Analysis</div>
                    <TrendPanel />
                </div>

                {/* Correlation matrix */}
                <div className="card">
                    <div className="card-title"><span className="card-title-icon">🔗</span>Pearson Correlation Matrix</div>
                    <CorrelationMatrix />
                </div>
            </div>
        </Layout>
    );
}
