import { useCallback, useEffect, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { adaptUserListResponse } from '../adapters/userManagementAdapter';
import { getUsers } from '../services/userManagementApi';
import { USER_FILTER_DEFAULTS, USER_PAGE_SIZE } from '../schemas/userManagementSchema';

const defaultTableData = {
    rows: [],
    page: 1,
    pageSize: USER_PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
};

export const useUsersList = () => {
    const [filters, setFilters] = useState(USER_FILTER_DEFAULTS);
    const [page, setPage] = useState(1);
    const [tableData, setTableData] = useState(defaultTableData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchList = useCallback(async (overrides = {}) => {
        setLoading(true);
        setError('');

        try {
            const query = {
                page: overrides.page ?? page,
                pageSize: USER_PAGE_SIZE,
                keyword: overrides.keyword ?? filters.keyword,
                role: (overrides.role ?? filters.role) === 'all' ? undefined : (overrides.role ?? filters.role),
                status: (overrides.status ?? filters.status) === 'all' ? undefined : (overrides.status ?? filters.status),
            };

            const envelope = await getUsers(query);
            setTableData(adaptUserListResponse(envelope));
        } catch (apiError) {
            setError(normalizeApiMessage(apiError));
            setTableData(defaultTableData);
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchList({ page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFiltersChange = (nextFilters) => {
        setFilters(nextFilters);
        setPage(1);
        fetchList({ ...nextFilters, page: 1 });
    };

    const onResetFilters = () => {
        setFilters(USER_FILTER_DEFAULTS);
        setPage(1);
        fetchList({ ...USER_FILTER_DEFAULTS, page: 1 });
    };

    const onPageChange = (nextPage) => {
        setPage(nextPage);
        fetchList({ page: nextPage });
    };

    const refreshList = useCallback(() => {
        fetchList({ page });
    }, [fetchList, page]);

    const refreshListAtPage1 = useCallback(() => {
        setPage(1);
        fetchList({ page: 1 });
    }, [fetchList]);

    return {
        // State
        filters,
        page,
        tableData,
        loading,
        error,

        // Actions
        fetchList,
        onFiltersChange,
        onResetFilters,
        onPageChange,
        refreshList,
        refreshListAtPage1,
    };
};