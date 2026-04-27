export const CHART_COLORS = {
    primary: 'var(--app-primary)',
    info: 'var(--app-info)',
    success: 'var(--app-success)',
    warning: 'var(--app-warning)',
    danger: 'var(--app-danger)',
    neutral: 'var(--app-text-muted)',
};

export const CHART_AXIS = {
    stroke: 'var(--app-border-strong)',
    tick: 'var(--app-text-soft)',
    fontSize: 11,
};

export const CHART_GRID = {
    stroke: 'var(--app-border)',
    strokeDasharray: '3 3',
};

export const CHART_TOOLTIP = {
    contentStyle: {
        background: 'var(--app-surface)',
        border: '1px solid var(--app-border-strong)',
        borderRadius: 10,
        fontSize: 12,
        color: 'var(--app-text)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
    },
    labelStyle: {
        color: 'var(--app-text-muted)',
        fontWeight: 700,
        marginBottom: 2,
    },
    itemStyle: {
        color: 'var(--app-text)',
        fontWeight: 600,
    },
};
