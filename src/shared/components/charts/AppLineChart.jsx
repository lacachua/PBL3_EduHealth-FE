import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import EmptyState from '../core/EmptyState';
import { CHART_AXIS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP } from './chartTokens';

const AppLineChart = ({
    data,
    xKey = 'label',
    yKey = 'value',
    color = 'primary',
    height = 200,
    showArea = true,
    yTickFormatter,
    tooltipFormatter,
    emptyTitle = 'Chưa có dữ liệu',
    emptyDescription = 'Biểu đồ sẽ hiển thị khi có dữ liệu phù hợp.',
}) => {
    const safeData = Array.isArray(data) ? data : [];
    const lineColor = CHART_COLORS[color] || color;
    const gradientId = `area-gradient-${yKey}`;

    if (!safeData.length) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={safeData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={lineColor} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={lineColor} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
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
                    cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: '4 2' }}
                />
                <Area
                    type="monotone"
                    dataKey={yKey}
                    stroke={lineColor}
                    strokeWidth={2.5}
                    fill={showArea ? `url(#${gradientId})` : 'none'}
                    dot={{ fill: lineColor, r: 3, strokeWidth: 0 }}
                    activeDot={{ fill: lineColor, r: 5, strokeWidth: 2, stroke: 'var(--app-surface)' }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default AppLineChart;
