const getDefaultDateRange = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    fromDate: firstDayOfMonth.toISOString().split('T')[0],
    toDate: lastDayOfMonth.toISOString().split('T')[0],
  };
};

export const nurseReportFilterOptions = Object.freeze({
  datePresets: [
    { value: 'today', label: 'Hôm nay' },
    { value: 'this-week', label: 'Tuần này' },
    { value: 'this-month', label: 'Tháng này' },
    { value: 'this-quarter', label: 'Quý này' },
    { value: 'this-year', label: 'Năm nay' },
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

export const createNurseReportFilters = () => {
  const defaultRange = getDefaultDateRange();
  return {
    fromDate: defaultRange.fromDate,
    toDate: defaultRange.toDate,
    grade: 'all',
    classId: 'all',
    reportType: 'overview',
  };
};

export const calculateDateRangeFromPreset = (preset) => {
  const now = new Date();
  let fromDate;
  let toDate = new Date(now);

  switch (preset) {
    case 'today':
      fromDate = new Date(now);
      break;
    case 'this-week': {
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - diff);
      break;
    }
    case 'this-month':
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'this-quarter': {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      fromDate = new Date(now.getFullYear(), quarterStartMonth, 1);
      toDate = new Date(now.getFullYear(), quarterStartMonth + 3, 0);
      break;
    }
    case 'this-year':
      fromDate = new Date(now.getFullYear(), 0, 1);
      toDate = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      return getDefaultDateRange();
  }

  return {
    fromDate: fromDate.toISOString().split('T')[0],
    toDate: toDate.toISOString().split('T')[0],
  };
};
