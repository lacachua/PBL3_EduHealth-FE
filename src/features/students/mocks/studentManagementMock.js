const studentRows = [
  {
    id: 'STU-1001',
    studentId: 'STU-1001',
    studentCode: 'HS-1001',
    fullName: 'Nguyen Minh Chau',
    dateOfBirth: '2016-09-10',
    gender: 'MALE',
    classId: 'CLS001',
    className: '4A',
    username: 'minhchau1001',
    email: 'minh.chau.ph@school.local',
    phoneNumber: '0909123123',
    identifier: 'ID-HS-1001',
    address: 'Khu do thi Linh Dam, Hoang Mai, Ha Noi',
    guardian: 'Nguyen Van Minh',
    guardianPhone: '0909123123',
    emergencyContactNote: 'Lien he me sau 17:00',
    status: 'ACTIVE',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-28T09:10:00Z',
    heightCm: 132,
    weightKg: 29.4,
    bloodType: 'A',
    eyeStatus: 'Can thi luc 9/10',
    chronicNote: '',
    generalHealthNote: 'The trang tot',
    allergies: 'Di ung tom muc nhe',
    medicalHistory: 'Tung sot xuat huyet nam 2023',
    lastExaminationDate: '2026-03-20',
    updatedBy: 'Y ta Le Thu Ha',
    healthProfileUpdatedAt: '2026-03-28T09:10:00Z',
  },
  {
    id: 'STU-1002',
    studentId: 'STU-1002',
    studentCode: 'HS-1002',
    fullName: 'Tran Gia Han',
    dateOfBirth: '2015-12-22',
    gender: 'FEMALE',
    classId: 'CLS002',
    className: '4B',
    username: 'giahan1002',
    email: 'gia.han.ph@school.local',
    phoneNumber: '0918123888',
    identifier: 'ID-HS-1002',
    address: 'Pho Quan Hoa, Cau Giay, Ha Noi',
    guardian: 'Tran Thi Lan',
    guardianPhone: '0918123888',
    emergencyContactNote: 'Bo me deu co the lien lac',
    status: 'PENDING_APPROVAL',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-27T14:22:00Z',
    heightCm: 129,
    weightKg: 27.1,
    bloodType: 'O',
    eyeStatus: 'Can theo doi can thi',
    chronicNote: '',
    generalHealthNote: 'Can bo sung vitamin D',
    allergies: '',
    medicalHistory: '',
    lastExaminationDate: '2026-03-18',
    updatedBy: 'Y ta Pham Bao Yen',
    healthProfileUpdatedAt: '2026-03-27T14:22:00Z',
  },
  {
    id: 'STU-1003',
    studentId: 'STU-1003',
    studentCode: 'HS-1003',
    fullName: 'Le Quoc Bao',
    dateOfBirth: '2014-05-13',
    gender: 'MALE',
    classId: 'CLS003',
    className: '5A',
    username: 'quocbao1003',
    email: 'quoc.bao.ph@school.local',
    phoneNumber: '0986555444',
    identifier: 'ID-HS-1003',
    address: 'Khu do thi Van Quan, Ha Dong, Ha Noi',
    guardian: 'Le Van Hieu',
    guardianPhone: '0986555444',
    emergencyContactNote: 'Lien he bo khi co viec gap',
    status: 'TEMP_SUSPENDED',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-27T16:40:00Z',
    heightCm: 138,
    weightKg: 34.8,
    bloodType: 'B',
    eyeStatus: '',
    chronicNote: 'Hen phe quan nhe',
    generalHealthNote: 'Can theo doi dinh ky',
    allergies: 'Di ung phan hoa',
    medicalHistory: 'Nhap vien 2024 do hen',
    lastExaminationDate: '2026-03-11',
    updatedBy: 'Bac si Nguyen Hai Dang',
    healthProfileUpdatedAt: '2026-03-27T16:40:00Z',
  },
  {
    id: 'STU-1004',
    studentId: 'STU-1004',
    studentCode: 'HS-1004',
    fullName: 'Pham Khanh Linh',
    dateOfBirth: '2015-02-01',
    gender: 'FEMALE',
    classId: 'CLS001',
    className: '4A',
    username: 'khanhlinh1004',
    email: 'khanh.linh.ph@school.local',
    phoneNumber: '0933555444',
    identifier: 'ID-HS-1004',
    address: 'Duong Nguyen Khanh Toan, Cau Giay, Ha Noi',
    guardian: 'Pham Thi My',
    guardianPhone: '0933555444',
    emergencyContactNote: '',
    status: 'ACTIVE',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-27T14:11:00Z',
    heightCm: 134,
    weightKg: 31.2,
    bloodType: 'AB',
    eyeStatus: 'Binh thuong',
    chronicNote: '',
    generalHealthNote: 'Can duy tri the duc deu',
    allergies: '',
    medicalHistory: '',
    lastExaminationDate: '2026-03-16',
    updatedBy: 'Y ta Le Thu Ha',
    healthProfileUpdatedAt: '2026-03-27T14:11:00Z',
  },
  {
    id: 'STU-1005',
    studentId: 'STU-1005',
    studentCode: 'HS-1005',
    fullName: 'Doan Tuan Kiet',
    dateOfBirth: '2014-08-29',
    gender: 'MALE',
    classId: 'CLS003',
    className: '5A',
    username: 'tuankiet1005',
    email: 'tuan.kiet.ph@school.local',
    phoneNumber: '0988111122',
    identifier: 'ID-HS-1005',
    address: 'Pho Xa Dan, Dong Da, Ha Noi',
    guardian: 'Doan Van Loc',
    guardianPhone: '0988111122',
    emergencyContactNote: 'Co the goi cho co ruot so 2',
    status: 'TRANSFERRED',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-27T11:02:00Z',
    heightCm: 140,
    weightKg: 35.2,
    bloodType: 'O',
    eyeStatus: 'Can thi luc 8/10',
    chronicNote: '',
    generalHealthNote: 'Da chuyen truong tu 2026-03-26',
    allergies: '',
    medicalHistory: '',
    lastExaminationDate: '2026-03-09',
    updatedBy: 'Y ta Pham Bao Yen',
    healthProfileUpdatedAt: '2026-03-27T11:02:00Z',
  },
  {
    id: 'STU-1006',
    studentId: 'STU-1006',
    studentCode: 'HS-1006',
    fullName: 'Vo Bao Ngan',
    dateOfBirth: '2016-01-15',
    gender: 'FEMALE',
    classId: 'CLS002',
    className: '4B',
    username: 'baongan1006',
    email: 'bao.ngan.ph@school.local',
    phoneNumber: '0909000222',
    identifier: 'ID-HS-1006',
    address: 'Ngo 120 Truong Chinh, Dong Da, Ha Noi',
    guardian: 'Vo Thi Van',
    guardianPhone: '0909000222',
    emergencyContactNote: '',
    status: 'LOCKED',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-27T09:56:00Z',
    heightCm: null,
    weightKg: 23.1,
    bloodType: '',
    eyeStatus: '',
    chronicNote: '',
    generalHealthNote: 'Thieu thong tin can nang/chieu cao',
    allergies: '',
    medicalHistory: '',
    lastExaminationDate: '',
    updatedBy: 'N/A',
    healthProfileUpdatedAt: '2026-03-27T09:56:00Z',
  },
  {
    id: 'STU-1007',
    studentId: 'STU-1007',
    studentCode: 'HS-1007',
    fullName: 'Nguyen Hoang Long',
    dateOfBirth: '2015-11-07',
    gender: 'MALE',
    classId: 'CLS001',
    className: '4A',
    username: 'hoanglong1007',
    email: 'hoang.long.ph@school.local',
    phoneNumber: '0966777333',
    identifier: 'ID-HS-1007',
    address: 'Pho Pham Van Dong, Bac Tu Liem, Ha Noi',
    guardian: 'Nguyen Hoang Son',
    guardianPhone: '0966777333',
    emergencyContactNote: 'Lien he me truoc',
    status: 'PENDING_APPROVAL',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-26T17:42:00Z',
    heightCm: 131,
    weightKg: 26.3,
    bloodType: 'A',
    eyeStatus: '',
    chronicNote: '',
    generalHealthNote: '',
    allergies: '',
    medicalHistory: '',
    lastExaminationDate: '2026-03-08',
    updatedBy: 'Y ta Le Thu Ha',
    healthProfileUpdatedAt: '2026-03-26T17:42:00Z',
  },
  {
    id: 'STU-1008',
    studentId: 'STU-1008',
    studentCode: 'HS-1008',
    fullName: 'Tran Duc Anh',
    dateOfBirth: '2014-10-22',
    gender: 'MALE',
    classId: 'CLS003',
    className: '5A',
    username: 'ducanh1008',
    email: 'duc.anh.ph@school.local',
    phoneNumber: '0910999888',
    identifier: 'ID-HS-1008',
    address: 'Pho Nguyen Chi Thanh, Dong Da, Ha Noi',
    guardian: 'Tran Duc Minh',
    guardianPhone: '0910999888',
    emergencyContactNote: '',
    status: 'ACTIVE',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-26T15:10:00Z',
    heightCm: 136,
    weightKg: 32.1,
    bloodType: 'B',
    eyeStatus: 'Can deo kinh can nhe',
    chronicNote: '',
    generalHealthNote: '',
    allergies: 'Di ung sua bo',
    medicalHistory: '',
    lastExaminationDate: '2026-03-05',
    updatedBy: 'Bac si Nguyen Hai Dang',
    healthProfileUpdatedAt: '2026-03-26T15:10:00Z',
  },
  {
    id: 'STU-1009',
    studentId: 'STU-1009',
    studentCode: 'HS-1009',
    fullName: 'Le Quynh Mai',
    dateOfBirth: '2015-03-14',
    gender: 'FEMALE',
    classId: 'CLS002',
    className: '4B',
    username: 'quynhmai1009',
    email: 'quynh.mai.ph@school.local',
    phoneNumber: '0909555001',
    identifier: 'ID-HS-1009',
    address: 'Khu do thi Trung Hoa Nhan Chinh, Thanh Xuan, Ha Noi',
    guardian: 'Le Thi Hanh',
    guardianPhone: '0909555001',
    emergencyContactNote: '',
    status: 'TEMP_SUSPENDED',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-26T10:35:00Z',
    heightCm: 133,
    weightKg: 30.8,
    bloodType: 'AB',
    eyeStatus: '',
    chronicNote: 'Can theo doi cot song',
    generalHealthNote: '',
    allergies: '',
    medicalHistory: 'Co vat ly tri lieu 2025',
    lastExaminationDate: '2026-03-02',
    updatedBy: 'Y ta Pham Bao Yen',
    healthProfileUpdatedAt: '2026-03-26T10:35:00Z',
  },
  {
    id: 'STU-1010',
    studentId: 'STU-1010',
    studentCode: 'HS-1010',
    fullName: 'Bui Gia Bao',
    dateOfBirth: '2014-06-30',
    gender: 'MALE',
    classId: 'CLS003',
    className: '5A',
    username: 'giabao1010',
    email: 'gia.bao.ph@school.local',
    phoneNumber: '0944111999',
    identifier: 'ID-HS-1010',
    address: 'Pho Le Trong Tan, Thanh Xuan, Ha Noi',
    guardian: 'Bui Van Tuan',
    guardianPhone: '0944111999',
    emergencyContactNote: 'Lien he bo me trong gio hanh chinh',
    status: 'ACTIVE',
    createdAt: '2025-09-01T08:30:00Z',
    updatedAt: '2026-03-25T16:45:00Z',
    heightCm: 141,
    weightKg: 34.1,
    bloodType: 'O',
    eyeStatus: 'Binh thuong',
    chronicNote: '',
    generalHealthNote: 'The luc tot',
    allergies: '',
    medicalHistory: '',
    lastExaminationDate: '2026-03-01',
    updatedBy: 'Y ta Le Thu Ha',
    healthProfileUpdatedAt: '2026-03-25T16:45:00Z',
  },
];

const statusMap = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngưng hoạt động',
};

const normalizeStatus = (value) => (String(value || '').toUpperCase() === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE');

const toStudentNumericId = (value) => {
  const direct = Number(value);
  if (Number.isInteger(direct) && direct > 0) {
    return direct;
  }

  const normalized = String(value || '').trim();
  if (!normalized) {
    return null;
  }

  const digits = normalized.replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  const parsed = Number(digits);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const toCanonicalStudentId = (row) => {
  const numericId = toStudentNumericId(row?.id ?? row?.studentId);
  if (!numericId) {
    return String(row?.studentId || '').trim() || 'STD001';
  }

  const compact = String(numericId).slice(-3).padStart(3, '0');
  return `STD${compact}`;
};

const toCanonicalStudentCode = (row) => {
  const numericId = toStudentNumericId(row?.id ?? row?.studentId);
  if (!numericId) {
    return String(row?.studentCode || '').trim() || 'HS001';
  }

  const compact = String(numericId).slice(-3).padStart(3, '0');
  return `HS${compact}`;
};

const toAllergyItems = (allergiesText = '') => {
  const source = String(allergiesText || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return source.map((allergyTypeName, index) => ({
    id: `ALG-${index + 1}`,
    allergyTypeId: `ALG${String(index + 1).padStart(3, '0')}`,
    allergyTypeName,
    note: '',
  }));
};

const resolveStudentRow = (studentId) => {
  const normalized = String(studentId || '').trim();
  const numeric = toStudentNumericId(normalized);

  return studentRows.find((row) => {
    const rowNumeric = toStudentNumericId(row.id ?? row.studentId);
    return row.id === studentId
      || row.studentId === studentId
      || row.studentCode === studentId
      || toCanonicalStudentId(row) === normalized
      || toCanonicalStudentCode(row) === normalized
      || (numeric && rowNumeric === numeric);
  }) || null;
};

const toHistoryItems = (row) => {
  const numericId = toStudentNumericId(row.id ?? row.studentId) || 1;
  const primaryDate = row.lastExaminationDate || String(row.updatedAt || '').slice(0, 10) || '2026-03-20';
  const allergyText = String(row.allergies || '').trim();
  const diseaseName = allergyText ? 'Theo dõi dị ứng' : 'Khám sức khỏe định kỳ';
  const diagnosis = row.medicalHistory
    ? `Theo dõi: ${row.medicalHistory}`
    : (row.generalHealthNote || 'Thể trạng ổn định');

  return [
    {
      visitId: `VIS-${numericId}-01`,
      visitDate: `${primaryDate}T08:30:00Z`,
      diseaseType: {
        id: 'DIS001',
        name: diseaseName,
      },
      symptoms: row.eyeStatus || 'Khám tổng quát theo định kỳ',
      diagnosis,
      treatment: 'Tiếp tục theo dõi và phối hợp phụ huynh theo dõi tại nhà.',
      note: row.generalHealthNote || '',
      prescriptions: [],
      nurse: {
        userId: 'USR002',
        fullName: row.updatedBy || 'Y tá phụ trách',
      },
    },
    {
      visitId: `VIS-${numericId}-02`,
      visitDate: `${String(row.createdAt || '2026-02-10').slice(0, 10)}T09:00:00Z`,
      diseaseType: {
        id: 'DIS008',
        name: 'Tư vấn sức khỏe học đường',
      },
      symptoms: 'Theo dõi chỉ số chiều cao, cân nặng',
      diagnosis: 'Các chỉ số cơ bản trong ngưỡng theo dõi',
      treatment: 'Khuyến nghị duy trì vận động và dinh dưỡng cân bằng.',
      note: '',
      prescriptions: [],
      nurse: {
        userId: 'USR003',
        fullName: 'Y tá học đường',
      },
    },
  ];
};

const applyFilters = (rows, query) => {
  const keyword = (query.keyword || query.search || '').trim().toLowerCase();

  return rows.filter((row) => {
    const byKeyword = !keyword
      || row.studentCode.toLowerCase().includes(keyword)
      || row.fullName.toLowerCase().includes(keyword)
      || row.username.toLowerCase().includes(keyword)
      || row.className.toLowerCase().includes(keyword);

    const byClass = !query.classId || query.classId === 'all' || row.classId === query.classId;
    const byGender = !query.gender || query.gender === 'all' || row.gender === query.gender;
    const normalizedStatus = normalizeStatus(row.status);
    const byStatus = !query.status || query.status === 'all' || normalizedStatus === query.status;
    const byActive = typeof query.isActive !== 'boolean'
      || (query.isActive ? normalizedStatus === 'ACTIVE' : normalizedStatus === 'INACTIVE');

    return byKeyword && byClass && byGender && byStatus && byActive;
  });
};

export const getStudentManagementMockEnvelope = (query = {}) => {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  const filtered = applyFilters(studentRows, query);
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    success: true,
    message: 'Tải danh sách học sinh thành công',
    data: {
      students: items.map((item) => {
        const status = normalizeStatus(item.status);

        return {
          ...item,
          id: toStudentNumericId(item.id ?? item.studentId),
          userId: toStudentNumericId(item.id ?? item.studentId),
          studentId: toCanonicalStudentId(item),
          studentCode: toCanonicalStudentCode(item),
          phone: item.phoneNumber,
          guardian: item.guardian,
          status,
          isActive: status === 'ACTIVE',
          currentHeight: item.heightCm ?? null,
          currentWeight: item.weightKg ?? null,
          medicalHistoryNotes: item.medicalHistory || '',
          statusLabel: statusMap[status] || 'Không rõ',
        };
      }),
    },
    errors: null,
    meta: {
      page,
      pageSize,
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      source: 'mock',
    },
  };
};

export const getStudentManagementDetailMockEnvelope = (studentId) => {
  const item = resolveStudentRow(studentId);

  if (!item) {
    return {
      success: false,
      message: 'Không tìm thấy học sinh',
      data: null,
      errors: [{ field: 'studentId', message: 'Không tìm thấy học sinh' }],
      meta: { source: 'mock' },
    };
  }

  const status = normalizeStatus(item.status);

  return {
    success: true,
    message: 'Lấy chi tiết học sinh thành công',
    data: {
      id: toStudentNumericId(item.id ?? item.studentId),
      userId: toStudentNumericId(item.id ?? item.studentId),
      studentId: toCanonicalStudentId(item),
      studentCode: toCanonicalStudentCode(item),
      fullName: item.fullName,
      dateOfBirth: item.dateOfBirth,
      gender: item.gender,
      classId: item.classId,
      className: item.className,
      username: item.username,
      email: item.email,
      phoneNumber: item.phoneNumber,
      phone: item.phoneNumber,
      identifier: item.identifier,
      address: item.address,
      guardian: item.guardian,
      guardianPhone: item.guardianPhone,
      emergencyContactNote: item.emergencyContactNote,
      status,
      statusLabel: statusMap[status] || 'Không rõ',
      isActive: status === 'ACTIVE',
      currentHeight: item.heightCm ?? null,
      currentWeight: item.weightKg ?? null,
      medicalHistoryNotes: item.medicalHistory || '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    },
    errors: null,
    meta: { source: 'mock' },
  };
};

export const getStudentHealthProfileMockEnvelope = (studentId) => {
  const item = resolveStudentRow(studentId);

  if (!item) {
    return {
      success: false,
      message: 'Không tìm thấy hồ sơ sức khỏe',
      data: null,
      errors: [{ field: 'studentId', message: 'Không tìm thấy hồ sơ sức khỏe' }],
      meta: { source: 'mock' },
    };
  }

  const allergies = toAllergyItems(item.allergies || '');

  return {
    success: true,
    message: 'Lấy hồ sơ sức khỏe thành công',
    data: {
      studentId: toCanonicalStudentId(item),
      studentCode: toCanonicalStudentCode(item),
      fullName: item.fullName,
      classId: item.classId,
      className: item.className,
      medicalHistoryNotes: item.medicalHistory || '',
      healthProfile: {
        heightCm: item.heightCm,
        weightKg: item.weightKg,
        bloodType: item.bloodType || '',
        eyeStatus: item.eyeStatus || '',
        chronicNote: item.chronicNote || '',
        generalHealthNote: item.generalHealthNote || '',
        allergies,
        updatedBy: {
          userId: 'USR002',
          fullName: item.updatedBy || 'Y tá học đường',
        },
        updatedAt: item.healthProfileUpdatedAt || item.updatedAt,
      },
      heightCm: item.heightCm,
      weightKg: item.weightKg,
      bloodType: item.bloodType || '',
      eyeStatus: item.eyeStatus || '',
      chronicNote: item.chronicNote || '',
      generalHealthNote: item.generalHealthNote || '',
      allergies: allergies.map((entry) => entry.allergyTypeName).join(', '),
      medicalHistory: item.medicalHistory || '',
      lastExaminationDate: item.lastExaminationDate || '',
      updatedBy: item.updatedBy || 'Y tá học đường',
      healthProfileUpdatedAt: item.healthProfileUpdatedAt || item.updatedAt,
      updatedAt: item.updatedAt,
    },
    errors: null,
    meta: { source: 'mock' },
  };
};

export const getStudentHealthHistoryMockEnvelope = (studentId, query = {}) => {
  const item = resolveStudentRow(studentId);

  if (!item) {
    return {
      success: false,
      message: 'Không tìm thấy lịch sử khám sức khỏe',
      data: null,
      errors: [{ field: 'studentId', message: 'Không tìm thấy lịch sử khám sức khỏe' }],
      meta: { source: 'mock' },
    };
  }

  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  const rows = toHistoryItems(item);
  const start = (page - 1) * pageSize;
  const items = rows.slice(start, start + pageSize);

  return {
    success: true,
    message: 'Lấy lịch sử khám sức khỏe thành công',
    data: items,
    errors: null,
    meta: {
      page,
      pageSize,
      totalItems: rows.length,
      totalPages: Math.max(1, Math.ceil(rows.length / pageSize)),
      source: 'mock',
    },
  };
};
