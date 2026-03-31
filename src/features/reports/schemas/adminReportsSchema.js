export const ADMIN_REPORT_ENDPOINTS = Object.freeze({
  dashboard: '/api/v1/reports/admin/dashboard',
  classDetail: '/api/v1/reports/admin/classes/:classId',
  export: '/api/v1/reports/admin/export',
  directive: '/api/v1/reports/admin/classes/:classId/directive',
});

export const ADMIN_REPORT_TYPE_TO_KEY = Object.freeze({
  'Đánh giá sức khỏe tổng hợp định kỳ': 'health-overview',
  'Giám sát tiêm chủng & Miễn dịch': 'vaccination-monitoring',
  'Theo dõi biến động bệnh truyền nhiễm': 'infectious-monitoring',
  'Hiệu quả quản lý dược phẩm học đường': 'medicine-operations',
});

export const ADMIN_GRADE_SCOPE_TO_KEY = Object.freeze({
  'Toàn trường': 'all',
  'Khối 1': 'grade-1',
  'Khối 2': 'grade-2',
  'Khối 3': 'grade-3',
  'Khối 4': 'grade-4',
  'Khối 5': 'grade-5',
});

export const ADMIN_RISK_THRESHOLD_TO_KEY = Object.freeze({
  'Tất cả mức độ': 'all',
  'Cao (Cảnh báo đỏ)': 'high',
  'Trung bình (Theo dõi)': 'medium',
  'Ổn định': 'stable',
});

export const buildAdminReportsQuery = (filters = {}) => {
  const params = {};

  if (filters.reportType) {
    params.reportType = ADMIN_REPORT_TYPE_TO_KEY[filters.reportType] || filters.reportType;
  }

  if (filters.classId && filters.classId !== 'all') {
    params.classId = filters.classId;
  }

  if (filters.period) {
    params.period = filters.period;
  }

  if (filters.fromDate) {
    params.fromDate = filters.fromDate;
  }

  if (filters.toDate) {
    params.toDate = filters.toDate;
  }

  if (filters.supportsGradeScope && filters.gradeScope && filters.gradeScope !== 'Toàn trường') {
    params.gradeScope = ADMIN_GRADE_SCOPE_TO_KEY[filters.gradeScope] || filters.gradeScope;
  }

  if (filters.riskThreshold) {
    params.riskThreshold = ADMIN_RISK_THRESHOLD_TO_KEY[filters.riskThreshold] || filters.riskThreshold;
  }

  return params;
};
