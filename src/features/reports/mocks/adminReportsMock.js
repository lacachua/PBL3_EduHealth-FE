export const adminReportFilterOptions = {
  reportTypes: [
    'Đánh giá sức khỏe tổng hợp định kỳ',
    'Giám sát tiêm chủng & Miễn dịch',
    'Theo dõi biến động bệnh truyền nhiễm',
    'Hiệu quả quản lý dược phẩm học đường',
  ],
  periods: ['Học kỳ 1 - 2023/24', 'Học kỳ 2 - 2023/24', 'Năm học 2023/24'],
  supportsGradeScope: false,
  gradeScopes: ['Toàn trường'],
  classOptions: [{ id: 'all', label: 'Toàn bộ lớp' }],
  riskThresholds: ['Tất cả mức độ', 'Cao (Cảnh báo đỏ)', 'Trung bình (Theo dõi)', 'Ổn định'],
};

export const adminReportHeader = {
  title: 'Báo cáo quản trị y tế học đường',
  description: 'Đánh giá tổng quát sức khỏe học sinh toàn trường và theo dõi biến động bệnh lý định kỳ.',
};

export const adminReportSummaryCards = [
  {
    id: 'total-students',
    label: 'Tổng học sinh',
    value: '131',
    icon: 'groups',
    iconTone: 'slate',
    note: null,
    noteTone: 'neutral',
  },
  {
    id: 'stable',
    label: 'Sức khỏe ổn định',
    value: '108',
    icon: 'check_circle',
    iconFill: true,
    iconTone: 'success',
    note: '82.4% trên sĩ số hiện có',
    noteTone: 'success-soft',
  },
  {
    id: 'follow-up',
    label: 'Cần theo dõi',
    value: '14',
    icon: 'visibility',
    iconTone: 'warning',
    note: null,
    noteTone: 'neutral',
  },
  {
    id: 'critical',
    label: 'Cảnh báo y tế',
    value: '9',
    valueTone: 'danger',
    icon: 'warning',
    iconTone: 'danger',
    note: null,
    noteTone: 'neutral',
  },
  {
    id: 'vaccine-coverage',
    label: 'Tỷ lệ hoàn thành tiêm chủng',
    value: '86%',
    icon: 'vaccines',
    iconTone: 'slate',
    note: null,
    noteTone: 'neutral',
    progress: 86,
  },
];

export const adminHealthDistributionByGrade = [];

export const adminClassHealthRows = [
  {
    id: 'class-1-1',
    classId: 'class-1-1',
    className: '1/1',
    classSize: 32,
    stable: 22,
    followUp: 5,
    highRisk: 5,
    vaccinationCompletionRate: 82,
    riskLabel: 'Rất Cao',
    riskTone: 'danger',
    rowTone: 'danger',
  },
  {
    id: 'class-3-4',
    classId: 'class-3-4',
    className: '3/4',
    classSize: 34,
    stable: 28,
    followUp: 3,
    highRisk: 3,
    vaccinationCompletionRate: 74,
    riskLabel: 'Trung bình',
    riskTone: 'warning',
    rowTone: 'warning',
  },
  {
    id: 'class-2-3',
    classId: 'class-2-3',
    className: '2/3',
    classSize: 35,
    stable: 32,
    followUp: 2,
    highRisk: 1,
    vaccinationCompletionRate: 89,
    riskLabel: 'Ổn định',
    riskTone: 'success',
    rowTone: 'default',
  },
  {
    id: 'class-4-2',
    classId: 'class-4-2',
    className: '4/2',
    classSize: 30,
    stable: 26,
    followUp: 4,
    highRisk: 0,
    vaccinationCompletionRate: 90,
    riskLabel: 'Ổn định',
    riskTone: 'success',
    rowTone: 'default',
  },
];

export const adminHighPriorityAlerts = [
  {
    id: 'alert-1-1',
    classId: 'class-1-1',
    className: 'Lớp 1/1',
    severity: 'KHẨN CẤP',
    severityTone: 'danger',
    description: '5 học sinh - Nghi ngờ Sốt phát ban',
    metric: '5 học sinh cảnh báo',
    updatedAt: 'Cập nhật: 10 phút trước',
    updatedAtShort: '10 phút',
  },
  {
    id: 'alert-3-4',
    classId: 'class-3-4',
    className: 'Lớp 3/4',
    severity: 'THEO DÕI',
    severityTone: 'warning',
    description: '3 học sinh - Đau mắt đỏ',
    metric: '3 học sinh theo dõi',
    updatedAt: 'Cập nhật: 2 giờ trước',
    updatedAtShort: '2 giờ',
  },
];

export const adminLowSupplies = [
  { id: 'sup-1', name: 'Paracetamol (Viên)', remaining: '5 vỉ', tone: 'danger', thresholdLabel: 'Ngưỡng tối thiểu: 12 vỉ' },
  { id: 'sup-2', name: 'Băng gạc tiệt trùng', remaining: '12 cuộn', tone: 'warning', thresholdLabel: 'Ngưỡng tối thiểu: 20 cuộn' },
  { id: 'sup-3', name: 'Dung dịch sát khuẩn', remaining: '2 chai', tone: 'warning', thresholdLabel: 'Ngưỡng tối thiểu: 8 chai' },
];

export const adminLowVaccinationCoverage = [
  {
    id: 'vac-1',
    label: 'Khối 1 (Viêm gan B)',
    coverage: 82,
    tone: 'success',
  },
  {
    id: 'vac-2',
    label: 'Khối 3 (Bạch hầu)',
    coverage: 74,
    tone: 'warning',
    note: 'Chưa đạt mục tiêu 90%',
  },
];

export const adminClassDrawerDetails = {
  'class-1-1': {
    id: 'class-1-1',
    classId: 'class-1-1',
    className: '1/1',
    studentCount: 32,
    teacherName: 'Nguyễn Thị Minh',
    urgencyLabel: 'Đang theo dõi khẩn cấp',
    urgencyTone: 'danger',
    recipientStats: {
      students: 32,
    },
    distribution: { stable: 22, followUp: 5, highRisk: 5, stablePct: 68, followUpPct: 16, highRiskPct: 16 },
    vaccination: {
      completionRate: 82,
      completed: 26,
      pending: 6,
      statusLabel: 'Cần bổ sung hồ sơ tiêm nhắc lại',
      statusTone: 'warning',
    },
    highlightedIssues: [
      'Nghi ngờ ổ dịch sốt phát ban trong lớp',
      'Mật độ học sinh theo dõi hô hấp tăng trong 7 ngày gần đây',
    ],
    riskAnalysis: [
      {
        id: 'risk-1',
        tone: 'danger',
        title: '5 học sinh sốt > 38.5°C',
        description: 'Ghi nhận triệu chứng phát ban tay chân. Nghi ngờ ổ dịch truyền nhiễm cục bộ.',
      },
      {
        id: 'risk-2',
        tone: 'warning',
        title: 'Tiêm chủng chưa hoàn tất',
        description: 'Còn 6 học sinh chưa nộp giấy chứng nhận tiêm nhắc lại mũi Viêm gan B.',
      },
    ],
    recommendation: 'Tăng tần suất kiểm tra triệu chứng đầu giờ, phối hợp phụ huynh hoàn tất tiêm nhắc lại và khử khuẩn lớp sau mỗi buổi học.',
  },
  'class-3-4': {
    id: 'class-3-4',
    classId: 'class-3-4',
    className: '3/4',
    studentCount: 34,
    teacherName: 'Trần Thị Loan',
    urgencyLabel: 'Theo dõi định kỳ',
    urgencyTone: 'warning',
    recipientStats: {
      students: 34,
    },
    distribution: { stable: 28, followUp: 3, highRisk: 3, stablePct: 82, followUpPct: 9, highRiskPct: 9 },
    vaccination: {
      completionRate: 74,
      completed: 25,
      pending: 9,
      statusLabel: 'Tỷ lệ hoàn thành thấp hơn ngưỡng 90%',
      statusTone: 'danger',
    },
    highlightedIssues: [
      'Tập trung ca đau mắt đỏ theo cụm bàn cuối lớp',
      'Một số học sinh chưa nộp minh chứng tiêm chủng',
    ],
    riskAnalysis: [
      {
        id: 'risk-3',
        tone: 'warning',
        title: '3 học sinh viêm kết mạc',
        description: 'Đã ghi nhận và phân loại theo nhóm theo dõi trong 48 giờ tiếp theo.',
      },
      {
        id: 'risk-4',
        tone: 'neutral',
        title: 'Tỷ lệ tiêm nhắc lại đạt 88%',
        description: 'Cần nhắc phụ huynh hoàn thiện hồ sơ cho 4 học sinh còn thiếu.',
      },
    ],
    recommendation: 'Ưu tiên truyền thông phòng ngừa đau mắt đỏ, rà soát danh sách chưa tiêm nhắc lại và cập nhật tiến độ theo từng tuần.',
  },
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const resolveRiskLevelFromThreshold = (threshold) => {
  if (threshold === 'Cao (Cảnh báo đỏ)') return 'danger';
  if (threshold === 'Trung bình (Theo dõi)') return 'warning';
  if (threshold === 'Ổn định') return 'success';
  return 'all';
};

const buildClassOptions = (rows) => {
  const options = rows.map((row) => ({ id: row.classId || row.id, label: `Lớp ${row.className}` }));
  return [{ id: 'all', label: 'Toàn bộ lớp' }, ...options];
};

const toChartDataByClass = (rows) => {
  return rows.map((row) => ({
    id: row.classId || row.id,
    label: `Lớp ${row.className}`,
    stable: row.stable,
    followUp: row.followUp,
    highRisk: row.highRisk,
    stablePct: row.classSize ? Math.round((row.stable / row.classSize) * 100) : 0,
    followUpPct: row.classSize ? Math.round((row.followUp / row.classSize) * 100) : 0,
    highRiskPct: row.classSize ? Math.round((row.highRisk / row.classSize) * 100) : 0,
  }));
};

const applyClassAndRiskFilters = (state, filters) => {
  const selectedClassId = filters.classId || 'all';
  const riskTone = resolveRiskLevelFromThreshold(filters.riskThreshold);

  const classRows = state.classRows.filter((item) => {
    const byClass = selectedClassId === 'all' || (item.classId || item.id) === selectedClassId;
    const byRisk = riskTone === 'all' || item.riskTone === riskTone;
    return byClass && byRisk;
  });

  const chartData = toChartDataByClass(classRows);
  const classIds = new Set(classRows.map((item) => item.id));
  const highPriorityAlerts = state.highPriorityAlerts.filter((item) => {
    if (selectedClassId === 'all') return true;
    return item.classId === selectedClassId;
  });

  const classDetails = Object.entries(state.classDetails).reduce((accumulator, [classId, detail]) => {
    if (!classIds.has(classId) && classRows.length > 0) {
      return accumulator;
    }
    accumulator[classId] = detail;
    return accumulator;
  }, {});

  return {
    ...state,
    chartData,
    classRows,
    highPriorityAlerts,
    classDetails,
  };
};

const buildSummaryFromRows = (state) => {
  const total = state.classRows.reduce((sum, row) => sum + row.classSize, 0);
  const stable = state.classRows.reduce((sum, row) => sum + row.stable, 0);
  const followUp = state.classRows.reduce((sum, row) => sum + row.followUp, 0);
  const highRisk = state.classRows.reduce((sum, row) => sum + row.highRisk, 0);
  const vaccinationRate = state.classRows.length
    ? Math.round(state.classRows.reduce((sum, row) => sum + Number(row.vaccinationCompletionRate || 0), 0) / state.classRows.length)
    : 0;
  const stableRate = total ? ((stable / total) * 100).toFixed(1) : '0.0';

  return state.summaryCards.map((card) => {
    if (card.id === 'total-students') {
      return { ...card, value: String(total || 0) };
    }
    if (card.id === 'stable') {
      return { ...card, value: String(stable || 0), note: `${stableRate}% trên sĩ số hiện có` };
    }
    if (card.id === 'follow-up') {
      return { ...card, value: String(followUp || 0) };
    }
    if (card.id === 'critical') {
      return { ...card, value: String(highRisk || 0) };
    }
    if (card.id === 'vaccine-coverage') {
      return { ...card, value: `${vaccinationRate}%`, progress: vaccinationRate };
    }
    return card;
  });
};

export const getAdminReportsDashboardModel = (filters = {}) => {
  const base = {
    header: clone(adminReportHeader),
    filterOptions: clone(adminReportFilterOptions),
    summaryCards: clone(adminReportSummaryCards),
    chartData: clone(adminHealthDistributionByGrade),
    classRows: clone(adminClassHealthRows),
    highPriorityAlerts: clone(adminHighPriorityAlerts),
    lowSupplies: clone(adminLowSupplies),
    lowVaccinationCoverage: clone(adminLowVaccinationCoverage),
    classDetails: clone(adminClassDrawerDetails),
  };

  base.filterOptions.classOptions = buildClassOptions(base.classRows);
  const withFilters = applyClassAndRiskFilters(base, filters);
  const summaryCards = buildSummaryFromRows(withFilters);

  return {
    header: withFilters.header,
    filterOptions: withFilters.filterOptions,
    summaryCards,
    chartData: withFilters.chartData,
    chartMeta: {
      title: 'Phân bố trạng thái sức khỏe theo lớp',
      description: 'Theo dõi tỷ trọng ổn định, theo dõi và nguy cơ cao trên từng lớp học.',
      grouping: 'class',
      groupingHint: null,
    },
    classRows: withFilters.classRows,
    sidePanel: {
      highPriorityAlerts: withFilters.highPriorityAlerts,
      lowSupplies: withFilters.lowSupplies,
      lowVaccinationCoverage: withFilters.lowVaccinationCoverage,
    },
    classDetails: withFilters.classDetails,
  };
};

export const getAdminReportsDashboardMockEnvelope = (filters = {}) => {
  const model = getAdminReportsDashboardModel(filters);
  return {
    success: true,
    message: 'Tải dữ liệu báo cáo quản trị thành công',
    data: model,
    errors: null,
    meta: {
      source: 'mock',
      totalClasses: model.classRows.length,
    },
  };
};

export const getAdminReportsClassDetailMockEnvelope = ({ classId, filters = {} }) => {
  const model = getAdminReportsDashboardModel(filters);
  return {
    success: true,
    message: 'Tải chi tiết lớp thành công',
    data: {
      detail: model.classDetails[classId] || null,
    },
    errors: null,
    meta: {
      source: 'mock',
      classId,
    },
  };
};

export const getSaveDirectiveMockEnvelope = ({ classId, note }) => {
  return {
    success: true,
    message: 'Lưu chỉ đạo thành công',
    data: {
      classId,
      note,
      savedAt: new Date().toISOString(),
    },
    errors: null,
    meta: {
      source: 'mock',
    },
  };
};
