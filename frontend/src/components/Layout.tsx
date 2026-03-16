import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';



interface LayoutProps {
    children: React.ReactNode;
    pageTitle: string;
}

const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/analytics', label: 'Analytics', icon: '🔬' },
    { path: '/forecast', label: 'Forecast', icon: '🔮' },
];

export default function Layout({ children, pageTitle }: LayoutProps) {
    const { riskScores, climateDataset, indicators } = useData();
    const currentRiskScore = riskScores.length > 0 ? riskScores[riskScores.length - 1] : null;

    const latest = climateDataset.length > 0 ? climateDataset[climateDataset.length - 1] : { gmst: 0, co2: 0, seaIce: 0, seaLevel: 0 };
    const prev = climateDataset.length > 1 ? climateDataset[climateDataset.length - 2] : { gmst: 0, co2: 0, seaIce: 0, seaLevel: 0 };

    const score = currentRiskScore?.score ?? 0;
    const riskColor = score >= 75 ? '#ef4444'
        : score >= 55 ? '#f97316'
            : score >= 35 ? '#f59e0b'
                : '#10b981';

    return (
        <div className="app-shell">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-title">CLIMATE</div>
                    <div className="logo-title" style={{ color: '#3b82f6' }}>ANALYTICS</div>
                    <div className="logo-sub">Risk Terminal</div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-label">Navigation</div>
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                    <div className="nav-section-label" style={{ marginTop: 16 }}>Indicators</div>
                    {indicators.map((ind: any) => (
                        <div key={ind.key} className="nav-link" style={{ fontSize: 11 }}>
                            <span style={{ color: ind.color, fontSize: 12 }}>●</span>
                            <span style={{ color: 'var(--text-muted)' }}>{ind.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div><span className="live-dot" />LIVE — 2025 Dataset</div>
                    <div style={{ marginTop: 4 }}>Data: 2000–2025 · 26 years</div>
                </div>
            </aside>

            {/* Main */}
            <div className="main-area">
                {/* Top bar */}
                <header className="top-bar">
                    <div className="top-bar-title">{pageTitle}</div>

                    <div className="ticker-strip">
                        <div className="ticker-item">
                            <span className="ticker-label">GMST</span>
                            <span className="ticker-value">+{latest.gmst}°C</span>
                            <span className="ticker-change up">▲ {(latest.gmst - prev.gmst).toFixed(2)}</span>
                        </div>
                        <div className="ticker-item">
                            <span className="ticker-label">CO₂</span>
                            <span className="ticker-value">{latest.co2} ppm</span>
                            <span className="ticker-change up">▲ {(latest.co2 - prev.co2).toFixed(1)}</span>
                        </div>
                        <div className="ticker-item">
                            <span className="ticker-label">ICE</span>
                            <span className="ticker-value">{latest.seaIce}M km²</span>
                            <span className="ticker-change down">▼ {Math.abs(latest.seaIce - prev.seaIce).toFixed(2)}</span>
                        </div>
                        <div className="ticker-item">
                            <span className="ticker-label">SLR</span>
                            <span className="ticker-value">{latest.seaLevel}mm</span>
                            <span className="ticker-change up">▲ {(latest.seaLevel - prev.seaLevel).toFixed(1)}</span>
                        </div>
                    </div>

                    <div className="risk-badge">
                        <span className="risk-badge-label">RISK SCORE</span>
                        <span className="risk-badge-score" style={{ color: riskColor }}>
                            {score}
                        </span>
                    </div>
                </header>

                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
