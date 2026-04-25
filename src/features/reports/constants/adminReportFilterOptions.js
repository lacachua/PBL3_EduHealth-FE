export const adminReportFilterOptions = {
  reportTypes: [
    'Đánh giá sức khỏe tổng hợp định kỳ',
    'Giám sát tiêm chủng & miễn dịch',
    'Theo dõi biến động bệnh truyền nhiễm',
    'Hiệu quả quản lý dược phẩm học đường',
  ],
  periods: ['Học kỳ 1 - 2023/24', 'Học kỳ 2 - 2023/24', 'Năm học 2023/24'],
  supportsGradeScope: false,
  gradeScopes: ['Toàn trường'],
  classOptions: [{ id: 'all', label: 'Toàn bộ lớp' }],
  riskThresholds: ['Tất cả mức độ', 'Cao (Cảnh báo đỏ)', 'Trung bình (Theo dõi)', 'Ổn định'],
};
