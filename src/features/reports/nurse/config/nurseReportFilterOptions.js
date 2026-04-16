export const nurseReportFilterOptions = Object.freeze({
  timeRanges: [
    { value: 'this-week', label: 'Tuần này' },
    { value: 'this-month', label: 'Tháng này' },
    { value: 'this-quarter', label: 'Quý này' },
    { value: 'custom-range', label: 'Khoảng ngày' },
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
    { value: 'health', label: 'Sức khỏe' },
    { value: 'vaccination', label: 'Tiêm chủng' },
    { value: 'medicine', label: 'Cấp thuốc' },
  ],
  tableStatus: [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'safe', label: 'An toàn' },
    { value: 'watch', label: 'Đang theo dõi' },
    { value: 'alert', label: 'Cảnh báo' },
  ],
  pageSize: 6,
});

export const createNurseReportFilters = () => ({
  timeRange: nurseReportFilterOptions.timeRanges[1].value,
  grade: nurseReportFilterOptions.grades[0].value,
  classId: 'all',
  reportType: nurseReportFilterOptions.reportTypes[0].value,
});
