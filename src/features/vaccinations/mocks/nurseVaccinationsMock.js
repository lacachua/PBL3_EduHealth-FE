const toIsoTimestamp = (value) => new Date(value).toISOString();

const today = new Date();
const offsetDate = (days) => {
  const next = new Date(today);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
};

const cloneDeep = (value) => JSON.parse(JSON.stringify(value));

const createEnvelope = ({ message, data, meta = null }) => ({
  success: true,
  message,
  data,
  errors: null,
  meta,
  timestamp: new Date().toISOString(),
  traceId: 'mock-vaccinations-trace-id',
});

const throwMockApiError = (status, message, errors = []) => {
  const error = new Error(message);
  error.response = {
    status,
    data: {
      success: false,
      message,
      errors,
    },
  };
  throw error;
};

const statuses = ['PENDING', 'DONE', 'POSTPONED', 'CONTRAINDICATED', 'ABSENT'];

let campaignSequence = 4;
let studentVaccinationSequence = 45;

const campaignsStore = [
  {
    id: 'VAC001',
    name: 'Cúm mùa học kỳ II',
    vaccineName: 'Influvac Tetra',
    doseNumber: 1,
    scheduledDate: offsetDate(7),
    targetType: 'CLASS',
    targetClassIds: ['CLS001', 'CLS002'],
    note: 'Phụ huynh ký phiếu đồng thuận trước ngày tiêm.',
    status: 'ACTIVE',
    createdAt: toIsoTimestamp('2026-03-15T08:30:00Z'),
  },
  {
    id: 'VAC002',
    name: 'Tiêm nhắc sởi rubella',
    vaccineName: 'MMR II',
    doseNumber: 2,
    scheduledDate: offsetDate(-5),
    targetType: 'STUDENT',
    targetClassIds: [],
    note: null,
    status: 'ACTIVE',
    createdAt: toIsoTimestamp('2026-03-21T03:00:00Z'),
  },
  {
    id: 'VAC003',
    name: 'Uốn ván cuối năm',
    vaccineName: 'Td vaccine',
    doseNumber: 1,
    scheduledDate: offsetDate(-28),
    targetType: 'CLASS',
    targetClassIds: ['CLS005'],
    note: 'Đợt hoàn tất tháng trước.',
    status: 'COMPLETED',
    createdAt: toIsoTimestamp('2026-02-20T08:30:00Z'),
  },
];

const studentVaccinationsStore = [
  {
    studentVaccinationId: 'SV001',
    campaignId: 'VAC001',
    student: {
      studentId: 'STD001',
      studentCode: 'HS001',
      fullName: 'Nguyễn Minh An',
      classId: 'CLS001',
      className: 'Lớp 4A',
    },
    status: 'PENDING',
    vaccinatedAt: null,
    lotNumber: null,
    note: null,
    updatedAt: toIsoTimestamp('2026-04-01T03:00:00Z'),
  },
  {
    studentVaccinationId: 'SV002',
    campaignId: 'VAC001',
    student: {
      studentId: 'STD002',
      studentCode: 'HS002',
      fullName: 'Trần Gia Bảo',
      classId: 'CLS001',
      className: 'Lớp 4A',
    },
    status: 'DONE',
    vaccinatedAt: offsetDate(-1),
    lotNumber: 'LOT-2026-01',
    note: 'Ổn định sau theo dõi 30 phút.',
    updatedAt: toIsoTimestamp('2026-04-02T03:00:00Z'),
  },
  {
    studentVaccinationId: 'SV003',
    campaignId: 'VAC001',
    student: {
      studentId: 'STD003',
      studentCode: 'HS003',
      fullName: 'Lê Thu Hà',
      classId: 'CLS002',
      className: 'Lớp 4B',
    },
    status: 'POSTPONED',
    vaccinatedAt: null,
    lotNumber: null,
    note: 'Sốt nhẹ vào sáng ngày tiêm.',
    updatedAt: toIsoTimestamp('2026-04-01T03:00:00Z'),
  },
  {
    studentVaccinationId: 'SV004',
    campaignId: 'VAC001',
    student: {
      studentId: 'STD004',
      studentCode: 'HS004',
      fullName: 'Phạm Hoài Nam',
      classId: 'CLS002',
      className: 'Lớp 4B',
    },
    status: 'ABSENT',
    vaccinatedAt: null,
    lotNumber: null,
    note: 'Vắng mặt có phép.',
    updatedAt: toIsoTimestamp('2026-04-01T03:00:00Z'),
  },
  {
    studentVaccinationId: 'SV005',
    campaignId: 'VAC002',
    student: {
      studentId: 'STD005',
      studentCode: 'HS005',
      fullName: 'Đỗ Tường Vy',
      classId: 'CLS006',
      className: 'Lớp 5A',
    },
    status: 'PENDING',
    vaccinatedAt: null,
    lotNumber: null,
    note: null,
    updatedAt: toIsoTimestamp('2026-04-01T03:00:00Z'),
  },
  {
    studentVaccinationId: 'SV006',
    campaignId: 'VAC002',
    student: {
      studentId: 'STD006',
      studentCode: 'HS006',
      fullName: 'Ngô Anh Khoa',
      classId: 'CLS006',
      className: 'Lớp 5A',
    },
    status: 'CONTRAINDICATED',
    vaccinatedAt: null,
    lotNumber: null,
    note: 'Có tiền sử phản vệ nhóm vaccine tương tự.',
    updatedAt: toIsoTimestamp('2026-04-01T03:00:00Z'),
  },
  {
    studentVaccinationId: 'SV007',
    campaignId: 'VAC002',
    student: {
      studentId: 'STD007',
      studentCode: 'HS007',
      fullName: 'Bùi Thanh Long',
      classId: 'CLS007',
      className: 'Lớp 5B',
    },
    status: 'DONE',
    vaccinatedAt: offsetDate(-4),
    lotNumber: 'LOT-2026-02',
    note: null,
    updatedAt: toIsoTimestamp('2026-04-01T03:00:00Z'),
  },
  {
    studentVaccinationId: 'SV008',
    campaignId: 'VAC003',
    student: {
      studentId: 'STD008',
      studentCode: 'HS008',
      fullName: 'Nguyễn Phúc Hân',
      classId: 'CLS005',
      className: 'Lớp 9A',
    },
    status: 'DONE',
    vaccinatedAt: offsetDate(-27),
    lotNumber: 'LOT-TD-09',
    note: null,
    updatedAt: toIsoTimestamp('2026-04-01T03:00:00Z'),
  },
  {
    studentVaccinationId: 'SV009',
    campaignId: 'VAC003',
    student: {
      studentId: 'STD009',
      studentCode: 'HS009',
      fullName: 'Vũ Quang Minh',
      classId: 'CLS005',
      className: 'Lớp 9A',
    },
    status: 'DONE',
    vaccinatedAt: offsetDate(-28),
    lotNumber: 'LOT-TD-10',
    note: null,
    updatedAt: toIsoTimestamp('2026-04-01T03:00:00Z'),
  },
];

const buildStats = (campaignId) => {
  const rows = studentVaccinationsStore.filter((item) => item.campaignId === campaignId);

  return {
    totalStudents: rows.length,
    doneCount: rows.filter((item) => item.status === 'DONE').length,
    pendingCount: rows.filter((item) => item.status === 'PENDING').length,
    postponedCount: rows.filter((item) => item.status === 'POSTPONED').length,
    contraindicatedCount: rows.filter((item) => item.status === 'CONTRAINDICATED').length,
    absentCount: rows.filter((item) => item.status === 'ABSENT').length,
  };
};

const sortByCreatedAtDesc = (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();

const sortStudentsByName = (left, right) => String(left.student?.fullName || '').localeCompare(String(right.student?.fullName || ''), 'vi');

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const buildPagedResult = (rows, page, pageSize) => {
  const totalItems = rows.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const offset = (page - 1) * pageSize;

  return {
    items: rows.slice(offset, offset + pageSize),
    meta: {
      page,
      pageSize,
      totalItems,
      totalPages,
      source: 'mock',
    },
  };
};

export const getVaccinationCampaignsMockEnvelope = (query = {}) => {
  const page = toPositiveNumber(query.page, 1);
  const pageSize = toPositiveNumber(query.pageSize, 10);
  const keyword = String(query.keyword || '').trim().toLowerCase();
  const status = String(query.status || '').trim().toUpperCase();

  const rows = campaignsStore
    .filter((campaign) => {
      if (keyword) {
        const text = `${campaign.name} ${campaign.vaccineName}`.toLowerCase();
        if (!text.includes(keyword)) {
          return false;
        }
      }

      if (status && campaign.status !== status) {
        return false;
      }

      return true;
    })
    .sort(sortByCreatedAtDesc)
    .map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      vaccineName: campaign.vaccineName,
      doseNumber: campaign.doseNumber,
      scheduledDate: campaign.scheduledDate,
      targetType: campaign.targetType,
      status: campaign.status,
      statistics: buildStats(campaign.id),
    }));

  const paged = buildPagedResult(rows, page, pageSize);

  return createEnvelope({
    message: 'Mock: Lấy danh sách đợt tiêm thành công.',
    data: paged.items,
    meta: paged.meta,
  });
};

export const createVaccinationCampaignMockEnvelope = (payload = {}) => {
  const name = String(payload.name || '').trim();
  const vaccineName = String(payload.vaccineName || '').trim();
  const targetType = String(payload.targetType || '').trim().toUpperCase();
  const doseNumber = Number(payload.doseNumber);

  if (!name) {
    throwMockApiError(400, 'Dữ liệu không hợp lệ.', [{ field: 'name', code: 'REQUIRED', message: 'name là bắt buộc.' }]);
  }

  if (!vaccineName) {
    throwMockApiError(400, 'Dữ liệu không hợp lệ.', [{ field: 'vaccineName', code: 'REQUIRED', message: 'vaccineName là bắt buộc.' }]);
  }

  if (!Number.isFinite(doseNumber) || doseNumber <= 0) {
    throwMockApiError(400, 'Dữ liệu không hợp lệ.', [{ field: 'doseNumber', code: 'INVALID_DOSE', message: 'doseNumber phải lớn hơn 0.' }]);
  }

  if (targetType !== 'CLASS' && targetType !== 'STUDENT') {
    throwMockApiError(400, 'Dữ liệu không hợp lệ.', [{ field: 'targetType', code: 'INVALID_TARGET_TYPE', message: 'targetType chỉ nhận CLASS hoặc STUDENT.' }]);
  }

  const targetClassIds = Array.isArray(payload.targetClassIds)
    ? payload.targetClassIds.map((item) => String(item || '').trim()).filter(Boolean)
    : [];

  const targetStudentIds = Array.isArray(payload.targetStudentIds)
    ? payload.targetStudentIds.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item > 0)
    : [];

  if (targetType === 'CLASS' && !targetClassIds.length) {
    throwMockApiError(400, 'Dữ liệu không hợp lệ.', [{ field: 'targetClassIds', code: 'REQUIRED', message: 'targetClassIds là bắt buộc khi targetType=CLASS.' }]);
  }

  if (targetType === 'STUDENT' && !targetStudentIds.length) {
    throwMockApiError(400, 'Dữ liệu không hợp lệ.', [{ field: 'targetStudentIds', code: 'REQUIRED', message: 'targetStudentIds là bắt buộc khi targetType=STUDENT.' }]);
  }

  campaignSequence += 1;

  const nextId = `VAC${String(campaignSequence).padStart(3, '0')}`;
  const scheduledDate = String(payload.scheduledDate || offsetDate(1));
  const createdAt = new Date().toISOString();

  const nextCampaign = {
    id: nextId,
    name,
    vaccineName,
    doseNumber,
    scheduledDate,
    targetType,
    targetClassIds,
    note: String(payload.note || '').trim() || null,
    status: 'ACTIVE',
    createdAt,
  };

  campaignsStore.unshift(nextCampaign);

  const generatedStudentIds = targetType === 'STUDENT'
    ? targetStudentIds.map((studentId) => `STD${String(studentId).padStart(3, '0')}`)
    : targetClassIds.flatMap((classId, index) => [
      `STD${String(campaignSequence * 10 + index + 1).padStart(3, '0')}`,
      `STD${String(campaignSequence * 10 + index + 2).padStart(3, '0')}`,
    ]);

  generatedStudentIds.forEach((studentCode, index) => {
    studentVaccinationSequence += 1;
    studentVaccinationsStore.push({
      studentVaccinationId: `SV${String(studentVaccinationSequence).padStart(3, '0')}`,
      campaignId: nextId,
      student: {
        studentId: studentCode,
        studentCode: `HS${studentCode.slice(3)}`,
        fullName: `Học sinh ${studentCode.slice(3)}`,
        classId: targetType === 'CLASS' ? targetClassIds[index % targetClassIds.length] : 'CLS001',
        className: targetType === 'CLASS' ? `Lớp ${targetClassIds[index % targetClassIds.length].replace('CLS', '')}` : 'Lớp 4A',
      },
      status: 'PENDING',
      vaccinatedAt: null,
      lotNumber: null,
      note: null,
      updatedAt: new Date().toISOString(),
    });
  });

  return createEnvelope({
    message: 'Mock: Tạo đợt tiêm thành công.',
    data: {
      id: nextCampaign.id,
      name: nextCampaign.name,
      vaccineName: nextCampaign.vaccineName,
      doseNumber: nextCampaign.doseNumber,
      scheduledDate: nextCampaign.scheduledDate,
      targetType: nextCampaign.targetType,
      targetClassIds: cloneDeep(nextCampaign.targetClassIds),
      generatedStudentRecords: generatedStudentIds.length,
      status: nextCampaign.status,
      createdAt: nextCampaign.createdAt,
    },
  });
};

export const getVaccinationCampaignDetailMockEnvelope = (campaignId) => {
  const campaign = campaignsStore.find((item) => item.id === campaignId);
  if (!campaign) {
    throwMockApiError(404, 'Không tìm thấy đợt tiêm.', [{ field: 'id', code: 'VACCINATION_CAMPAIGN_NOT_FOUND', message: 'Không tồn tại đợt tiêm với id đã cung cấp.' }]);
  }

  return createEnvelope({
    message: 'Mock: Lấy chi tiết đợt tiêm thành công.',
    data: {
      id: campaign.id,
      name: campaign.name,
      vaccineName: campaign.vaccineName,
      doseNumber: campaign.doseNumber,
      scheduledDate: campaign.scheduledDate,
      targetType: campaign.targetType,
      targetClassIds: cloneDeep(campaign.targetClassIds),
      note: campaign.note,
      status: campaign.status,
      statistics: buildStats(campaign.id),
      createdAt: campaign.createdAt,
    },
  });
};

export const getVaccinationCampaignStudentsMockEnvelope = (campaignId, query = {}) => {
  const campaign = campaignsStore.find((item) => item.id === campaignId);
  if (!campaign) {
    throwMockApiError(404, 'Không tìm thấy đợt tiêm.', [{ field: 'id', code: 'VACCINATION_CAMPAIGN_NOT_FOUND', message: 'Không tồn tại đợt tiêm với id đã cung cấp.' }]);
  }

  const page = toPositiveNumber(query.page, 1);
  const pageSize = toPositiveNumber(query.pageSize, 10);
  const keyword = String(query.keyword || '').trim().toLowerCase();
  const status = String(query.status || '').trim().toUpperCase();

  const rows = studentVaccinationsStore
    .filter((item) => item.campaignId === campaignId)
    .filter((item) => {
      if (status && statuses.includes(status) && item.status !== status) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchable = `${item.student.studentCode} ${item.student.fullName} ${item.student.className}`.toLowerCase();
      return searchable.includes(keyword);
    })
    .sort(sortStudentsByName)
    .map((item) => ({
      studentVaccinationId: item.studentVaccinationId,
      student: cloneDeep(item.student),
      status: item.status,
      vaccinatedAt: item.vaccinatedAt,
      lotNumber: item.lotNumber,
      note: item.note,
    }));

  const paged = buildPagedResult(rows, page, pageSize);

  return createEnvelope({
    message: 'Mock: Lấy danh sách học sinh trong đợt tiêm thành công.',
    data: paged.items,
    meta: paged.meta,
  });
};

export const updateStudentVaccinationMockEnvelope = (studentVaccinationId, payload = {}) => {
  const record = studentVaccinationsStore.find((item) => item.studentVaccinationId === studentVaccinationId);
  if (!record) {
    throwMockApiError(404, 'Không tìm thấy bản ghi tiêm.', [{ field: 'id', code: 'STUDENT_VACCINATION_NOT_FOUND', message: 'Không tồn tại bản ghi tiêm với id đã cung cấp.' }]);
  }

  const status = String(payload.status || '').trim().toUpperCase();
  if (!statuses.includes(status)) {
    throwMockApiError(400, 'Dữ liệu không hợp lệ.', [{ field: 'status', code: 'INVALID_VACCINATION_STATUS', message: 'Trạng thái tiêm không hợp lệ.' }]);
  }

  record.status = status;
  record.vaccinatedAt = status === 'DONE' ? (payload.vaccinatedAt || null) : null;
  record.lotNumber = status === 'DONE' ? (String(payload.lotNumber || '').trim() || null) : null;
  record.note = String(payload.note || '').trim() || null;
  record.updatedAt = new Date().toISOString();

  return createEnvelope({
    message: 'Mock: Cập nhật trạng thái tiêm thành công.',
    data: {
      studentVaccinationId: record.studentVaccinationId,
      campaignId: record.campaignId,
      studentId: record.student.studentId,
      status: record.status,
      vaccinatedAt: record.vaccinatedAt,
      lotNumber: record.lotNumber,
      note: record.note,
      updatedAt: record.updatedAt,
    },
  });
};

export const getPendingVaccinationsMockEnvelope = (query = {}) => {
  const page = toPositiveNumber(query.page, 1);
  const pageSize = toPositiveNumber(query.pageSize, 10);
  const campaignId = String(query.campaignId || '').trim().toUpperCase();
  const classId = String(query.classId || '').trim().toUpperCase();

  const rows = studentVaccinationsStore
    .filter((item) => item.status !== 'DONE')
    .filter((item) => {
      if (campaignId && item.campaignId !== campaignId) {
        return false;
      }

      if (classId && String(item.student.classId || '').toUpperCase() !== classId) {
        return false;
      }

      return true;
    })
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .map((item) => {
      const campaign = campaignsStore.find((entry) => entry.id === item.campaignId);
      return {
        studentVaccinationId: item.studentVaccinationId,
        campaignId: item.campaignId,
        campaignName: campaign?.name || '--',
        student: cloneDeep(item.student),
        status: item.status,
        scheduledDate: campaign?.scheduledDate || null,
      };
    });

  const paged = buildPagedResult(rows, page, pageSize);

  return createEnvelope({
    message: 'Mock: Lấy danh sách chưa hoàn thành tiêm thành công.',
    data: paged.items,
    meta: paged.meta,
  });
};

export const getStudentVaccinationHistoryMockEnvelope = (studentId) => {
  const normalizedId = Number(studentId);
  const studentCode = Number.isFinite(normalizedId)
    ? `STD${String(normalizedId).padStart(3, '0')}`
    : String(studentId || '').toUpperCase();

  const rows = studentVaccinationsStore
    .filter((item) => item.student.studentId === studentCode)
    .map((item) => {
      const campaign = campaignsStore.find((entry) => entry.id === item.campaignId);
      return {
        studentVaccinationId: item.studentVaccinationId,
        campaignId: item.campaignId,
        campaignName: campaign?.name || '--',
        vaccineName: campaign?.vaccineName || '--',
        doseNumber: campaign?.doseNumber || 0,
        scheduledDate: campaign?.scheduledDate || null,
        status: item.status,
        vaccinatedAt: item.vaccinatedAt,
        lotNumber: item.lotNumber,
        note: item.note,
      };
    })
    .sort((left, right) => new Date(right.scheduledDate || 0).getTime() - new Date(left.scheduledDate || 0).getTime());

  if (!rows.length) {
    throwMockApiError(404, 'Không tìm thấy học sinh.', [{ field: 'id', code: 'STUDENT_NOT_FOUND', message: 'Không tồn tại học sinh với id đã cung cấp.' }]);
  }

  return createEnvelope({
    message: 'Mock: Lấy lịch sử tiêm thành công.',
    data: rows,
    meta: { source: 'mock' },
  });
};
