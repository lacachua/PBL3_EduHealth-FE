export const nurseReportFilterOptions = Object.freeze({
  timeRanges: [
    { value: 'today', label: 'Hôm nay' },
    { value: 'this-week', label: 'Tuần này' },
    { value: 'this-month', label: 'Tháng này' },
    { value: 'this-quarter', label: 'Quý này' },
    { value: 'this-year', label: 'Năm nay' },
    { value: 'custom', label: 'Tùy chọn' },
  ],
  grades: [
    { value: 'all', label: 'Tất cả khối' },
    { value: '1', label: 'Khối 1' },
    { value: '2', label: 'Khối 2' },
    { value: '3', label: 'Khối 3' },
    { value: '4', label: 'Khối 4' },
    { value: '5', label: 'Khối 5' },
  ],
  reportTypes: [
    { value: 'overview', label: 'Tổng hợp' },
    { value: 'health', label: 'Khám bệnh' },
    { value: 'vaccination', label: 'Tiêm chủng' },
    { value: 'medicine', label: 'Cấp thuốc' },
  ],
  pageSize: 6,
});

export const createNurseReportFilters = () => ({
  timeRange: 'this-month',
  grade: 'all',
  classId: 'all',
  reportType: 'overview',
});
