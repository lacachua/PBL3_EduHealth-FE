import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import EmptyState from '../core/EmptyState';
import { CHART_COLORS } from './chartTokens';

const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 80;

/**
 * AppDonutChart — shared donut chart wrapper with hover tooltip.
 *
 * Props:
 *   data            — array of objects
 *   nameKey         — key for slice name (default: 'name')
 *   valueKey        — key for slice value (default: 'value')
 *   colorKey        — key for slice color (default: 'color')
 *   ratioKey        — key for percentage ratio (default: 'ratio')
 *   unit            — unit label for tooltip (default: 'ca')
 *   centerLabel     — string shown above center number (default: '')
 *   centerValue     — string/number shown as center number
 *   centerSublabel  — string shown below center number (default: '')
 *   height          — chart height in px (default: 180)
 *   innerRadius     — donut inner radius (default: 52)
 *   outerRadius     — donut outer radius (default: 80)
 *   showTooltip     — enable hover tooltip (default: true)
 *   emptyTitle      — empty state title
 *   emptyDescription — empty state description
 */
const AppDonutChart = ({
    data,
    nameKey = 'name',
    valueKey = 'value',
    colorKey = 'color',
    ratioKey = 'ratio',
    unit = 'ca',
    centerLabel = '',
    centerValue,
    centerSublabel = '',
    height = 180,
    innerRadius = 52,
    outerRadius = 80,
    showTooltip = true,
    emptyTitle = 'Chưa có dữ liệu',
    emptyDescription = 'Biểu đồ sẽ hiển thị khi có dữ liệu phù hợp.',
}) => {
    const safeData = Array.isArray(data) ? data : [];
    const [tooltip, setTooltip] = useState(null);

    if (!safeData.length) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    const resolveColor = (item) => {
        const raw = item[colorKey];
        if (!raw) return CHART_COLORS.neutral;
        return CHART_COLORS[raw] || raw;
    };

    const handleMouseEnter = (entry, index, event) => {
        if (!showTooltip) return;

        const nativeEvent = event?.nativeEvent || event;
        if (!nativeEvent || typeof nativeEvent.clientX !== 'number') return;

        const name = entry[nameKey] || '';
        const value = entry[valueKey] || 0;
        const ratio = entry[ratioKey] || 0;

        const x = Math.min(
            Math.max(nativeEvent.clientX + 12, 12),
            window.innerWidth - TOOLTIP_WIDTH - 12
        );
        const y = Math.min(
            Math.max(nativeEvent.clientY + 12, 12),
            window.innerHeight - TOOLTIP_HEIGHT - 12
        );

        setTooltip({ name, value, ratio, x, y });
    };

    const handleMouseMove = (entry, index, event) => {
        if (!showTooltip || !tooltip) return;

        const nativeEvent = event?.nativeEvent || event;
        if (!nativeEvent || typeof nativeEvent.clientX !== 'number') return;

        const x = Math.min(
            Math.max(nativeEvent.clientX + 12, 12),
            window.innerWidth - TOOLTIP_WIDTH - 12
        );
        const y = Math.min(
            Math.max(nativeEvent.clientY + 12, 12),
            window.innerHeight - TOOLTIP_HEIGHT - 12
        );

        setTooltip((prev) => ({ ...prev, x, y }));
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const renderTooltip = () => {
        if (!tooltip || !showTooltip || typeof document === 'undefined') {
            return null;
        }

        return createPortal(
            <div
                className="pointer-events-none fixed z-[9999] rounded-xl border border-outline-variant bg-surface px-3 py-2 text-sm shadow-xl"
                style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`,
                }}
            >
                <div className="font-semibold text-on-surface">{tooltip.name}</div>
                <div className="text-on-surface-variant">
                    {tooltip.value} {unit} · {tooltip.ratio}%
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div className="relative" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={safeData}
                        dataKey={valueKey}
                        nameKey={nameKey}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        strokeWidth={2}
                        stroke="var(--app-surface)"
                        paddingAngle={2}
                        isAnimationActive={false}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {safeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={resolveColor(entry)} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {centerValue !== undefined ? (
                <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                >
                    <div className="text-center">
                        {centerLabel ? (
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-muted">
                                {centerLabel}
                            </p>
                        ) : null}
                        <p className="text-[1.6rem] font-extrabold leading-none text-on-surface">
                            {centerValue}
                        </p>
                        {centerSublabel ? (
                            <p className="text-[11px] font-semibold text-on-surface-variant">
                                {centerSublabel}
                            </p>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {renderTooltip()}
        </div>
    );
};

export default AppDonutChart;
