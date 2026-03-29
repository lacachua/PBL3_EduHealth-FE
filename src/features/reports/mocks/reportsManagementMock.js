const rows = [
  { id: 'REP-0326-01', title: 'Báo cáo hồ sơ học sinh theo lớp', reportType: 'students', range: 'week', scope: 'all', generatedAt: '2026-03-28 08:45', status: 'ready' },
  { id: 'REP-0326-02', title: 'Báo cáo tổng hợp lượt khám tại phòng y tế', reportType: 'visits', range: 'month', scope: 'all', generatedAt: '2026-03-27 16:10', status: 'ready' },
  { id: 'REP-0326-03', title: 'Báo cáo sử dụng thuốc theo học sinh', reportType: 'medicine-usage', range: 'quarter', scope: 'khoi 2', generatedAt: '2026-03-26 10:30', status: 'processing' },
  { id: 'REP-0326-04', title: 'Báo cáo tiến độ tiêm chủng theo khối', reportType: 'vaccinations', range: 'school-year', scope: 'khoi 1', generatedAt: '2026-03-25 15:20', status: 'ready' },
];

const applyFilters = (data, query) => data.filter((item) => {
  const byType = !query.reportType || query.reportType === 'all' || item.reportType === query.reportType;
  const byRange = !query.range || query.range === 'all' || item.range === query.range;
  const byScope = !query.scope || query.scope === 'all' || item.scope === query.scope;
  return byType && byRange && byScope;
});

export const getReportsManagementMockEnvelope = (query = {}) => {
  const filtered = applyFilters(rows, query);

  return {
    success: true,
    message: 'Tải dữ liệu báo cáo thành công',
    data: {
      reports: filtered,
    },
    errors: null,
    meta: {
      source: 'mock',
      totalItems: filtered.length,
    },
  };
};
