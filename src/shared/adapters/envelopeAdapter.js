export const extractRows = (envelope, options = {}) => {
    const { itemKeys = [] } = options;

    if (!envelope || envelope.success === false) return [];

    if (Array.isArray(envelope.data)) return envelope.data;
    if (Array.isArray(envelope.data?.items)) return envelope.data.items;

    for (const key of itemKeys) {
        if (Array.isArray(envelope.data?.[key])) {
            return envelope.data[key];
        }
    }

    return [];
};

export const extractMeta = (envelope, defaults = {}) => {
    const {
        page = 1,
        pageSize = 10,
        totalItems = 0,
        totalPages = 1,
    } = defaults;

    if (!envelope || envelope.success === false) {
        return { page, pageSize, totalItems, totalPages };
    }

    const meta = envelope.meta || {};

    return {
        page: Number(meta.page || page),
        pageSize: Number(meta.pageSize || pageSize),
        totalItems: Number(meta.totalItems || meta.total || totalItems),
        totalPages: Number(meta.totalPages || totalPages),
    };
};

export const extractItem = (envelope, options = {}) => {
    const { itemKey = 'item' } = options;

    if (!envelope || envelope.success === false || !envelope.data) return null;

    if (envelope.data[itemKey] && typeof envelope.data[itemKey] === 'object') {
        return envelope.data[itemKey];
    }

    if (typeof envelope.data === 'object' && !Array.isArray(envelope.data)) {
        return envelope.data;
    }

    return null;
};