const baseClassRows = [
  { id: '1A1', className: '1A1', grade: '1', gradeLabel: 'Khối 1', studentCount: 35, examinationCount: 12, trackingCount: 2, medicineDispenseCount: 8, vaccinationRate: 100, status: 'safe' },
  { id: '1A2', className: '1A2', grade: '1', gradeLabel: 'Khối 1', studentCount: 36, examinationCount: 14, trackingCount: 3, medicineDispenseCount: 9, vaccinationRate: 97, status: 'safe' },
  { id: '1A3', className: '1A3', grade: '1', gradeLabel: 'Khối 1', studentCount: 34, examinationCount: 10, trackingCount: 2, medicineDispenseCount: 6, vaccinationRate: 95, status: 'safe' },
  { id: '2A1', className: '2A1', grade: '2', gradeLabel: 'Khối 2', studentCount: 38, examinationCount: 15, trackingCount: 3, medicineDispenseCount: 7, vaccinationRate: 92, status: 'watch' },
  { id: '2A2', className: '2A2', grade: '2', gradeLabel: 'Khối 2', studentCount: 37, examinationCount: 13, trackingCount: 2, medicineDispenseCount: 5, vaccinationRate: 89, status: 'watch' },
  { id: '2A3', className: '2A3', grade: '2', gradeLabel: 'Khối 2', studentCount: 39, examinationCount: 14, trackingCount: 2, medicineDispenseCount: 6, vaccinationRate: 91, status: 'safe' },
  { id: '3A1', className: '3A1', grade: '3', gradeLabel: 'Khối 3', studentCount: 40, examinationCount: 19, trackingCount: 4, medicineDispenseCount: 11, vaccinationRate: 87, status: 'watch' },
  { id: '3A2', className: '3A2', grade: '3', gradeLabel: 'Khối 3', studentCount: 41, examinationCount: 18, trackingCount: 4, medicineDispenseCount: 10, vaccinationRate: 86, status: 'watch' },
  { id: '4A1', className: '4A1', grade: '4', gradeLabel: 'Khối 4', studentCount: 42, examinationCount: 20, trackingCount: 5, medicineDispenseCount: 12, vaccinationRate: 84, status: 'watch' },
  { id: '4A2', className: '4A2', grade: '4', gradeLabel: 'Khối 4', studentCount: 42, examinationCount: 21, trackingCount: 6, medicineDispenseCount: 13, vaccinationRate: 82, status: 'alert' },
  { id: '5A1', className: '5A1', grade: '5', gradeLabel: 'Khối 5', studentCount: 41, examinationCount: 24, trackingCount: 7, medicineDispenseCount: 15, vaccinationRate: 80, status: 'alert' },
  { id: '5A2', className: '5A2', grade: '5', gradeLabel: 'Khối 5', studentCount: 42, examinationCount: 28, trackingCount: 9, medicineDispenseCount: 15, vaccinationRate: 78, status: 'alert' },
  { id: '5A3', className: '5A3', grade: '5', gradeLabel: 'Khối 5', studentCount: 40, examinationCount: 23, trackingCount: 6, medicineDispenseCount: 14, vaccinationRate: 79, status: 'alert' },
];

const trendDatasetByRange = {
  'this-week': [
    { label: 'Thứ 2', health: 36, vaccination: 22, medicine: 18, overview: 43 },
    { label: 'Thứ 3', health: 41, vaccination: 26, medicine: 19, overview: 49 },
    { label: 'Thứ 4', health: 39, vaccination: 24, medicine: 17, overview: 47 },
    { label: 'Thứ 5', health: 45, vaccination: 29, medicine: 20, overview: 53 },
    { label: 'Thứ 6', health: 48, vaccination: 31, medicine: 22, overview: 57 },
    { label: 'Thứ 7', health: 28, vaccination: 18, medicine: 11, overview: 31 },
  ],
  'this-month': [
    { label: 'Tuần 01', health: 124, vaccination: 86, medicine: 66, overview: 145 },
    { label: 'Tuần 02', health: 280, vaccination: 194, medicine: 143, overview: 322 },
    { label: 'Tuần 03', health: 412, vaccination: 278, medicine: 210, overview: 468 },
    { label: 'Tuần 04', health: 586, vaccination: 364, medicine: 286, overview: 648 },
    { label: 'Tuần 05', health: 490, vaccination: 332, medicine: 244, overview: 552 },
  ],
  'this-quarter': [
    { label: 'Tháng 01', health: 1180, vaccination: 742, medicine: 588, overview: 1324 },
    { label: 'Tháng 02', health: 1265, vaccination: 784, medicine: 612, overview: 1418 },
    { label: 'Tháng 03', health: 1378, vaccination: 823, medicine: 638, overview: 1512 },
  ],
  'custom-range': [
    { label: 'Mốc 1', health: 304, vaccination: 190, medicine: 140, overview: 351 },
    { label: 'Mốc 2', health: 352, vaccination: 223, medicine: 167, overview: 409 },
    { label: 'Mốc 3', health: 338, vaccination: 215, medicine: 161, overview: 396 },
    { label: 'Mốc 4', health: 366, vaccination: 232, medicine: 175, overview: 428 },
  ],
};

const diseaseBreakdown = [
  { id: 'flu', label: 'Cảm cúm', count: 58, color: 'var(--app-primary)' },
  { id: 'fever', label: 'Sốt cao', count: 36, color: 'var(--app-info)' },
  { id: 'digestive', label: 'Tiêu hóa', count: 20, color: 'var(--app-warning)' },
  { id: 'other', label: 'Khác', count: 14, color: 'var(--app-border)' },
];

const topMedicines = [
  { id: 'med-1', name: 'Paracetamol 500mg', category: 'Giảm đau, hạ sốt', usedQuantity: 156, deltaPercent: 8, trend: 'up', stockStatus: 'low' },
  { id: 'med-2', name: 'Nước muối sinh lý', category: 'Vệ sinh mũi họng', usedQuantity: 45, deltaPercent: 0, trend: 'stable', stockStatus: 'normal' },
  { id: 'med-3', name: 'Berberin', category: 'Hỗ trợ tiêu hóa', usedQuantity: 92, deltaPercent: -4, trend: 'down', stockStatus: 'normal' },
  { id: 'med-4', name: 'Oresol', category: 'Bù nước điện giải', usedQuantity: 71, deltaPercent: 5, trend: 'up', stockStatus: 'low' },
];

const riskAlerts = [
  {
    id: 'alert-1',
    tone: 'danger',
    title: 'Cảnh báo dịch tễ lớp 5A2',
    message: 'Ghi nhận 5 trường hợp sốt cao trong 48 giờ. Đề nghị theo dõi sức khỏe liên tục và thông báo phụ huynh.',
    timeLabel: '2 giờ trước',
  },
  {
    id: 'alert-2',
    tone: 'warning',
    title: 'Lô thuốc sắp hết hạn',
    message: 'Paracetamol lô H-2023 sẽ hết hạn trong tháng này. Ưu tiên sử dụng và lập kế hoạch bổ sung tồn kho.',
    timeLabel: 'Hôm qua',
  },
  {
    id: 'alert-3',
    tone: 'info',
    title: 'Nhắc lịch tiêm khối 1',
    message: 'Còn 12 học sinh chưa hoàn thành mũi nhắc lại MMR. Đề nghị gửi thông báo qua cổng phụ huynh.',
    timeLabel: '10/11/2023',
  },
];

const resolveMetricKey = (reportType) => {
  const normalized = String(reportType || 'overview').toLowerCase();
  if (normalized === 'health') return 'health';
  if (normalized === 'vaccination') return 'vaccination';
  if (normalized === 'medicine') return 'medicine';
  return 'overview';
};

const normalizeFilters = (filters = {}) => ({
  timeRange: String(filters.timeRange || 'this-month'),
  grade: String(filters.grade || 'all'),
  classId: String(filters.classId || 'all'),
  reportType: String(filters.reportType || 'overview'),
});

const toClassOptions = (rows) => {
  const options = rows.map((row) => ({ value: row.id, label: row.className }));
  return [{ value: 'all', label: 'Tất cả lớp' }, ...options];
};

export const getNurseReportsMockSnapshot = (filters = {}, overrides = {}) => {
  const normalizedFilters = normalizeFilters(filters);
  const trendRows = trendDatasetByRange[normalizedFilters.timeRange] || trendDatasetByRange['this-month'];
  const metricKey = resolveMetricKey(normalizedFilters.reportType);

  const rowsByGrade = normalizedFilters.grade === 'all'
    ? baseClassRows
    : baseClassRows.filter((row) => row.grade === normalizedFilters.grade);

  const classRows = normalizedFilters.classId === 'all'
    ? rowsByGrade
    : rowsByGrade.filter((row) => row.id === normalizedFilters.classId);

  const classOptions = toClassOptions(rowsByGrade);

  return {
    success: true,
    message: 'Lấy báo cáo y tế tổng hợp cho y tá thành công (mock).',
    data: {
      header: {
        title: 'Báo cáo y tế tổng hợp',
        description: 'Phân tích tình hình sức khỏe học sinh và hiệu quả hoạt động của trạm y tế theo từng lớp học.',
      },
      appliedFilters: normalizedFilters,
      filterOptions: {
        classOptions,
      },
      trend: trendRows.map((item) => ({
        label: item.label,
        value: item[metricKey],
      })),
      diseaseBreakdown,
      topMedicines,
      riskAlerts,
      classRows,
      generatedAt: new Date().toISOString(),
    },
    errors: null,
    meta: {
      source: overrides.source || 'mock',
      note: overrides.note || null,
    },
  };
};
