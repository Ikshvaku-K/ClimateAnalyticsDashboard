import { useState } from 'react';
import type { IndicatorKey } from '../types/api';
import { useData } from '../context/DataContext';

const SHORT_LABELS: Record<IndicatorKey, string> = {
    gmst: 'GMST',
    co2: 'CO₂',
    seaIce: 'ICE',
    seaLevel: 'SLR',
    oceanHeat: 'OHC',
    extremeIndex: 'EXI',
};

function corr2color(v: number): string {
    // -1 → blue, 0 → mid-gray, +1 → red
    const abs = Math.abs(v);
    if (v > 0) {
        const r = Math.round(100 + 155 * abs);
        const g = Math.round(50 * (1 - abs));
        return `rgba(${r}, ${g}, ${g}, ${0.3 + 0.7 * abs})`;
    } else {
        const b = Math.round(100 + 155 * abs);
        const rg = Math.round(50 * (1 - abs));
        return `rgba(${rg}, ${rg}, ${b}, ${0.3 + 0.7 * abs})`;
    }
}

export default function CorrelationMatrix() {
    const { correlationMatrix, indicators } = useData();
    const [hovered, setHovered] = useState<{ x: IndicatorKey; y: IndicatorKey } | null>(null);

    const KEYS = indicators.map((i: any) => i.key as IndicatorKey);

    const get = (x: IndicatorKey, y: IndicatorKey) =>
        correlationMatrix.find(c => c.x === x && c.y === y)?.value ?? 0;

    return (
        <div>
            <div style={{ marginBottom: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
                Pearson correlation coefficients across all 6 indicators (2000–2025). 🔴 Strong positive · 🔵 Strong negative.
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 14, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 0, borderRadius: 4, overflow: 'hidden' }}>
                    {[-1, -0.5, 0, 0.5, 1].map(v => (
                        <div key={v} style={{ width: 32, height: 16, background: corr2color(v) }} />
                    ))}
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>-1 ←→ +1</span>
                {hovered && (
                    <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)', background: 'var(--bg-surface)', padding: '3px 10px', borderRadius: 6 }}>
                        {SHORT_LABELS[hovered.x]} × {SHORT_LABELS[hovered.y]}: {get(hovered.x, hovered.y).toFixed(3)}
                    </span>
                )}
            </div>

            {/* Matrix */}
            <div style={{ overflowX: 'auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `60px ${KEYS.map(() => '1fr').join(' ')}`,
                    gap: 3,
                    minWidth: 400,
                }}>
                    {/* Header row */}
                    <div />
                    {KEYS.map(k => (
                        <div key={k} className="corr-axis-label"
                            style={{ padding: '4px 2px', color: hovered?.x === k ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: 10 }}>
                            {SHORT_LABELS[k]}
                        </div>
                    ))}

                    {/* Data rows */}
                    {KEYS.map(ky => (
                        <>
                            <div key={`label-${ky}`} style={{ display: 'flex', alignItems: 'center', fontSize: 10, fontWeight: 600, color: hovered?.y === ky ? 'var(--text-primary)' : 'var(--text-muted)', justifyContent: 'flex-end', paddingRight: 6 }}>
                                {SHORT_LABELS[ky]}
                            </div>
                            {KEYS.map(kx => {
                                const v = get(kx, ky);
                                const isH = hovered?.x === kx || hovered?.y === ky;
                                return (
                                    <div
                                        key={`${kx}-${ky}`}
                                        className="corr-cell"
                                        style={{
                                            background: corr2color(v),
                                            color: Math.abs(v) > 0.5 ? '#fff' : 'rgba(255,255,255,0.6)',
                                            outline: isH ? '1px solid rgba(255,255,255,0.3)' : 'none',
                                        }}
                                        onMouseEnter={() => setHovered({ x: kx, y: ky })}
                                        onMouseLeave={() => setHovered(null)}
                                        title={`${SHORT_LABELS[kx]} × ${SHORT_LABELS[ky]}: r = ${v}`}
                                    >
                                        {kx === ky ? '1.00' : v.toFixed(2)}
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}
