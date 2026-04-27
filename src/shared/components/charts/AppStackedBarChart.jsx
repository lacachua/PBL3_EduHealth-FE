import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import EmptyState from '../core/EmptyState';
import { CHART_AXIS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP } from './chartTokens';

const AppStackedBarChart = ({
    data,
    xKey = 'label',
    series = [],
    height = 240,
    yTickFormatter,
    tooltipFormatter,
    showLegend = true,
    emptyTitle = 'Chưa có dữ liệu',
    emptyDescription = 'Biểu đồ sẽ hiển thị khi có dữ liệu phù hợp.',
}) => {
    const safeData = Array.isArray(data) ? data : [];
    const safeSeries = Array.isArray(series) ? series : [];

    if (!safeData.length || !safeSeries.length) {
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
                    cursor={{ fill: 'var(--app-primary-soft)', opacity: 0.4 }}
                />
                {showLegend ? (
                    <Legend
                        wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 8 }}
                    />
                ) : null}
                {safeSeries.map((s, index) => (
                    <Bar
                        key={s.key}
                        dataKey={s.key}
                        name={s.label}
                        stackId="stack"
                        fill={CHART_COLORS[s.color] || s.color || CHART_COLORS.primary}
                        radius={index === safeSeries.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        maxBarSize={56}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AppStackedBarChart;
