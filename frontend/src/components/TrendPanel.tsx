import type { IndicatorKey } from '../types/api';
import { useData } from '../context/DataContext';

export default function TrendPanel() {
    const { indicators, trends } = useData();
    const indLabel = (key: IndicatorKey) => indicators.find((i: any) => i.key === key)?.label ?? key;
    const indColor = (key: IndicatorKey) => indicators.find((i: any) => i.key === key)?.color ?? '#fff';
    const indIcon = (key: IndicatorKey) => indicators.find((i: any) => i.key === key)?.icon ?? '';
    const indUnit = (key: IndicatorKey) => indicators.find((i: any) => i.key === key)?.unit ?? '';

    return (
        <div>
            <div style={{ marginBottom: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
                Linear regression across 26-year record (2000–2025). R² measures goodness of fit.
            </div>

            <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Indicator</th>
                            <th>Direction</th>
                            <th>Slope / Year</th>
                            <th>Change / Decade</th>
                            <th>R² Fit</th>
                            <th>R² Bar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trends.map(t => {
                            const color = indColor(t.indicator);
                            const dirConfig = {
                                rising: { cls: 'dir-rising', arrow: '↑', label: 'RISING' },
                                falling: { cls: 'dir-falling', arrow: '↓', label: 'FALLING' },
                                stable: { cls: 'dir-stable', arrow: '→', label: 'STABLE' },
                            }[t.direction];

                            const slopeStr = t.slope > 0
                                ? `+${t.slope.toFixed(4)}`
                                : t.slope.toFixed(4);

                            const decadeStr = t.changePerDecade > 0
                                ? `+${t.changePerDecade.toFixed(3)}`
                                : t.changePerDecade.toFixed(3);

                            return (
                                <tr key={t.indicator}>
                                    <td>
                                        <span style={{ color, fontWeight: 600 }}>
                                            {indIcon(t.indicator)} {indLabel(t.indicator)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`dir-badge ${dirConfig.cls}`}>
                                            {dirConfig.arrow} {dirConfig.label}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'JetBrains Mono', color: t.slope > 0 ? '#ef4444' : '#10b981' }}>
                                        {slopeStr} {indUnit(t.indicator)}
                                    </td>
                                    <td style={{ fontFamily: 'JetBrains Mono', color: t.changePerDecade > 0 ? '#ef4444' : '#10b981' }}>
                                        {decadeStr} {indUnit(t.indicator)}
                                    </td>
                                    <td style={{ fontFamily: 'JetBrains Mono', color: t.r2 >= 0.9 ? '#10b981' : t.r2 >= 0.7 ? '#f59e0b' : '#ef4444' }}>
                                        {t.r2.toFixed(3)}
                                    </td>
                                    <td>
                                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, width: 100, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${t.r2 * 100}%`, background: color, borderRadius: 4 }} />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
