import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import EmptyState from '../core/EmptyState';
import { CHART_AXIS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP } from './chartTokens';

/**
 * AppBarChart — shared single-series bar chart wrapper.
 *
 * Props:
 *   data           — array of objects
 *   xKey           — key for x-axis category (default: 'label')
 *   yKey           — key for bar value (default: 'value')
 *   valueLabel     — human-readable series name shown in tooltip (default: yKey)
 *   color          — semantic key from CHART_COLORS or CSS var string (default: 'primary')
 *   height         — chart height in px (default: 200)
 *   yTickFormatter — optional function(value) => string
 *   tooltipFormatter — optional function(value, name) => [string, string]
 *   emptyTitle     — empty state title
 *   emptyDescription — empty state description
 */
const AppBarChart = ({
    data,
    xKey = 'label',
    yKey = 'value',
    valueLabel,
    color = 'primary',
    height = 200,
    yTickFormatter,
    tooltipFormatter,
    emptyTitle = 'Chưa có dữ liệu',
    emptyDescription = 'Biểu đồ sẽ hiển thị khi có dữ liệu phù hợp.',
}) => {
    const safeData = Array.isArray(data) ? data : [];
    const barColor = CHART_COLORS[color] || color;
    const resolvedLabel = valueLabel || yKey;

    if (!safeData.length) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={safeData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid
                    strokeDasharray={CHART_GRID.strokeDasharray}
                    stroke={CHART_GRID.stroke}
                    vertical={false}
                />
                <XAxis
                    dataKey={xKey}
                    tick={{ fill: CHART_AXIS.tick, fontSize: CHART_AXIS.fontSize, fontWeight: 600 }}
                    axisLine={{ stroke: CHART_AXIS.stroke }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: CHART_AXIS.tick, fontSize: CHART_AXIS.fontSize, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={yTickFormatter}
                    width={32}
                />
                <Tooltip
                    contentStyle={CHART_TOOLTIP.contentStyle}
                    labelStyle={CHART_TOOLTIP.labelStyle}
                    itemStyle={CHART_TOOLTIP.itemStyle}
                    formatter={tooltipFormatter}
                    cursor={{ fill: 'var(--app-primary-soft)', opacity: 0.5 }}
                />
                <Bar dataKey={yKey} name={resolvedLabel} fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AppBarChart;
