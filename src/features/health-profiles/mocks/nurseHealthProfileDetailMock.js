const fallbackProfiles = [
  {
    key: '1',
    detail: {
      userId: 1,
      studentCode: 'HS00124',
      fullName: 'Nguyen Lam Anh',
      dateOfBirth: '2017-05-12',
      classId: 1,
      className: '1/1',
      email: 'lamanh.parent@eduhealth.local',
      phone: '0901234567',
      gender: 'FEMALE',
      guardian: 'Nguyen Thi Lan',
      currentHeight: 121,
      currentWeight: 22.4,
      medicalHistoryNotes: 'Can theo doi thi luc va bo sung dinh duong.',
      isActive: true,
      updatedAt: '2026-04-03T08:12:00Z',
    },
    healthProfile: {
      studentId: 'STD001',
      studentCode: 'HS00124',
      fullName: 'Nguyen Lam Anh',
      classId: 'CLS001',
      className: '1/1',
      healthProfile: {
        heightCm: 121,
        weightKg: 22.4,
        bloodType: 'A',
        eyeStatus: 'Can thi nhe',
        chronicNote: '',
        generalHealthNote: 'Khuyen khich deo kinh khi hoc tap.',
        allergies: [
          {
            id: 'SA001',
            allergyTypeId: 'ALG001',
            allergyTypeName: 'Di ung hai san',
            note: 'Noi man do nhe',
          },
        ],
        updatedBy: {
          userId: 'USR002',
          fullName: 'Y ta Minh Hanh',
        },
        updatedAt: '2026-04-03T08:12:00Z',
      },
    },
    healthHistory: [
      {
        visitId: 'VIS2301',
        visitDate: '2026-03-27T09:30:00Z',
        nurse: { userId: 'USR002', fullName: 'Y ta Minh Hanh' },
        diseaseType: { id: 'DIS001', name: 'Cam lanh' },
        symptoms: 'Sot nhe, dau hong',
        diagnosis: 'Viem hong cap',
        treatment: 'Nghi ngoi, bo sung nuoc',
        note: 'Theo doi 3 ngay',
        prescriptions: [
          {
            prescriptionId: 'VP001',
            medicineId: 'MED001',
            medicineName: 'Paracetamol 250mg',
            quantity: 6,
            usageInstruction: '1 vien sau an, ngay 2 lan',
          },
        ],
      },
      {
        visitId: 'VIS2245',
        visitDate: '2026-01-18T08:10:00Z',
        nurse: { userId: 'USR003', fullName: 'Y ta Thu Ha' },
        diseaseType: { id: 'DIS008', name: 'Kiem tra dinh ky' },
        symptoms: 'Kiem tra suc khoe dinh ky hoc ky I',
        diagnosis: 'The trang on dinh',
        treatment: 'Duy tri van dong nhe',
        note: '',
        prescriptions: [],
      },
    ],
    vaccinations: [
      {
        id: 'VAC-1',
        vaccineName: 'Cum mua',
        administeredAt: '2025-10-12',
        location: 'Tram y te phuong',
        status: 'DONE',
      },
      {
        id: 'VAC-2',
        vaccineName: 'Soi - Quai bi - Rubella',
        administeredAt: '2024-05-20',
        location: 'Truong tieu hoc',
        status: 'DONE',
      },
    ],
    emergencyContacts: [
      { id: 'EC-1', relation: 'Me', fullName: 'Nguyen Thi Lan', phone: '0901234567', primary: true },
      { id: 'EC-2', relation: 'Bo', fullName: 'Nguyen Van Binh', phone: '0912345678', primary: false },
    ],
    growthIndicators: {
      weightForAgePercent: 91,
      heightForAgePercent: 88,
      note: 'Nam trong nguong phat trien binh thuong cua lua tuoi',
    },
  },
  {
    key: '2',
    detail: {
      userId: 2,
      studentCode: 'HS00156',
      fullName: 'Pham Van Nam',
      dateOfBirth: '2016-11-20',
      classId: 2,
      className: '2/2',
      email: 'phamnam.parent@eduhealth.local',
      phone: '0913123456',
      gender: 'MALE',
      guardian: 'Pham Thi Hoa',
      currentHeight: 128,
      currentWeight: 27.8,
      medicalHistoryNotes: 'Tien su hen phe quan nhe.',
      isActive: true,
      updatedAt: '2026-04-01T09:20:00Z',
    },
    healthProfile: {
      studentId: 'STD002',
      studentCode: 'HS00156',
      fullName: 'Pham Van Nam',
      classId: 'CLS002',
      className: '2/2',
      healthProfile: {
        heightCm: 128,
        weightKg: 27.8,
        bloodType: 'O',
        eyeStatus: '',
        chronicNote: 'Hen phe quan nhe, can theo doi khi troi lanh',
        generalHealthNote: 'The luc tot, can duy tri van dong',
        allergies: [],
        updatedBy: {
          userId: 'USR002',
          fullName: 'Y ta Minh Hanh',
        },
        updatedAt: '2026-04-01T09:20:00Z',
      },
    },
    healthHistory: [],
    vaccinations: [
      {
        id: 'VAC-3',
        vaccineName: 'Bach hau - Ho ga - Uon van',
        administeredAt: '2025-03-16',
        location: 'Benh vien Quan',
        status: 'DONE',
      },
    ],
    emergencyContacts: [
      { id: 'EC-3', relation: 'Me', fullName: 'Pham Thi Hoa', phone: '0913123456', primary: true },
    ],
    growthIndicators: {
      weightForAgePercent: 87,
      heightForAgePercent: 90,
      note: 'Chi so tang truong on dinh',
    },
  },
  {
    key: '3',
    detail: {
      userId: 3,
      studentCode: 'HS00212',
      fullName: 'Tran Hoang My',
      dateOfBirth: '2015-02-05',
      classId: 3,
      className: '4/1',
      email: 'hoangmy.parent@eduhealth.local',
      phone: '0977567890',
      gender: 'FEMALE',
      guardian: 'Tran Thi Mai',
      currentHeight: 136.5,
      currentWeight: 33.2,
      medicalHistoryNotes: 'Can theo doi dinh duong, co dau hieu can thi.',
      isActive: true,
      updatedAt: '2026-03-30T08:30:00Z',
    },
    healthProfile: {
      studentId: 'STD003',
      studentCode: 'HS00212',
      fullName: 'Tran Hoang My',
      classId: 'CLS003',
      className: '4/1',
      healthProfile: {
        heightCm: 136.5,
        weightKg: 33.2,
        bloodType: 'B',
        eyeStatus: 'Can thi 1.5 do',
        chronicNote: '',
        generalHealthNote: 'Can bo sung canxi va vitamin D',
        allergies: [
          {
            id: 'SA005',
            allergyTypeId: 'ALG005',
            allergyTypeName: 'Di ung sua bo',
            note: '',
          },
        ],
        updatedBy: {
          userId: 'USR003',
          fullName: 'Y ta Thu Ha',
        },
        updatedAt: '2026-03-30T08:30:00Z',
      },
    },
    healthHistory: [],
    vaccinations: [],
    emergencyContacts: [
      { id: 'EC-4', relation: 'Me', fullName: 'Tran Thi Mai', phone: '0977567890', primary: true },
      { id: 'EC-5', relation: 'Bo', fullName: 'Tran Quoc Khanh', phone: '0988111111', primary: false },
    ],
    growthIndicators: {
      weightForAgePercent: 84,
      heightForAgePercent: 86,
      note: 'Can theo doi bo sung dinh duong trong hoc ky toi',
    },
  },
  {
    key: '4',
    detail: {
      userId: 4,
      studentCode: 'HS00245',
      fullName: 'Le Quang Huy',
      dateOfBirth: '2014-08-15',
      classId: 4,
      className: '5/3',
      email: 'quanghuy.parent@eduhealth.local',
      phone: '0987000111',
      gender: 'MALE',
      guardian: 'Le Thi Huong',
      currentHeight: 141,
      currentWeight: 37.1,
      medicalHistoryNotes: '',
      isActive: true,
      updatedAt: '2026-03-26T10:00:00Z',
    },
    healthProfile: {
      studentId: 'STD004',
      studentCode: 'HS00245',
      fullName: 'Le Quang Huy',
      classId: 'CLS004',
      className: '5/3',
      healthProfile: {
        heightCm: 141,
        weightKg: 37.1,
        bloodType: 'AB',
        eyeStatus: 'Thi luc binh thuong',
        chronicNote: '',
        generalHealthNote: '',
        allergies: [],
        updatedBy: {
          userId: 'USR002',
          fullName: 'Y ta Minh Hanh',
        },
        updatedAt: '2026-03-26T10:00:00Z',
      },
    },
    healthHistory: [],
    vaccinations: [
      {
        id: 'VAC-4',
        vaccineName: 'COVID-19 mui nhac lai',
        administeredAt: '2025-09-10',
        location: 'Truong tieu hoc',
        status: 'DONE',
      },
    ],
    emergencyContacts: [
      { id: 'EC-6', relation: 'Me', fullName: 'Le Thi Huong', phone: '0987000111', primary: true },
    ],
    growthIndicators: {
      weightForAgePercent: 89,
      heightForAgePercent: 91,
      note: 'Tang truong deu, phu hop lua tuoi',
    },
  },
];

const pickFallback = (studentId) => {
  if (studentId === undefined || studentId === null || studentId === '') {
    return fallbackProfiles[0];
  }

  const normalized = String(studentId);
  const exact = fallbackProfiles.find((item) =>
    String(item.detail.userId) === normalized
    || item.healthProfile.studentId === normalized
    || item.healthProfile.studentCode === normalized
  );

  if (exact) {
    return exact;
  }

  const parsed = Number(normalized);
  if (Number.isFinite(parsed) && parsed > 0) {
    return fallbackProfiles[(parsed - 1) % fallbackProfiles.length];
  }

  return fallbackProfiles[0];
};

export const NURSE_HEALTH_CLASS_LABEL_MAP = {
  '1': '1/1',
  '2': '2/2',
  '3': '4/1',
  '4': '5/3',
  CLS001: '1/1',
  CLS002: '2/2',
  CLS003: '4/1',
  CLS004: '5/3',
  '1/1': '1/1',
  '2/2': '2/2',
  '4/1': '4/1',
  '5/3': '5/3',
};

export const getNurseHealthStudentDetailMockEnvelope = (studentId) => {
  const fallback = pickFallback(studentId);
  return {
    success: true,
    message: 'Mock student detail',
    data: fallback.detail,
    errors: null,
    meta: null,
  };
};

export const getNurseHealthProfileMockEnvelope = (studentId) => {
  const fallback = pickFallback(studentId);
  return {
    success: true,
    message: 'Mock student health profile',
    data: fallback.healthProfile,
    errors: null,
    meta: null,
  };
};

export const getNurseHealthHistoryMockEnvelope = (studentId, query = {}) => {
  const fallback = pickFallback(studentId);
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const items = fallback.healthHistory.slice(from, to);

  return {
    success: true,
    message: 'Mock student health history',
    data: items,
    errors: null,
    meta: {
      page,
      pageSize,
      totalItems: fallback.healthHistory.length,
      totalPages: Math.max(1, Math.ceil(fallback.healthHistory.length / pageSize)),
    },
  };
};

export const getNurseHealthExaminationMockEnvelope = (studentId) => {
  const fallback = pickFallback(studentId);
  const items = fallback.healthHistory.map((visit) => ({
    id: visit.visitId,
    visitDate: visit.visitDate,
    student: {
      studentId: fallback.healthProfile.studentId,
      studentCode: fallback.healthProfile.studentCode,
      fullName: fallback.healthProfile.fullName,
      classId: fallback.healthProfile.classId,
      className: fallback.healthProfile.className,
    },
    nurse: {
      userId: visit.nurse.userId,
      fullName: visit.nurse.fullName,
    },
    diseaseType: visit.diseaseType,
    symptoms: visit.symptoms || '',
    diagnosis: visit.diagnosis || '',
    hasPrescription: Boolean(visit.prescriptions?.length),
  }));

  return {
    success: true,
    message: 'Mock examinations for student',
    data: items,
    errors: null,
    meta: {
      page: 1,
      pageSize: 10,
      totalItems: items.length,
      totalPages: 1,
    },
    timestamp: new Date().toISOString(),
    traceId: 'mock-trace-id',
  };
};

export const getNurseHealthProfileStudentsMockRows = () => {
  return fallbackProfiles.map((item) => ({
    id: item.detail.userId,
    studentId: item.detail.userId,
    userId: item.detail.userId,
    studentCode: item.detail.studentCode,
    fullName: item.detail.fullName,
    dateOfBirth: item.detail.dateOfBirth,
    gender: item.detail.gender,
    classId: item.detail.classId,
    className: item.detail.className,
    email: item.detail.email,
    phone: item.detail.phone,
    medicalHistoryNotes: item.detail.medicalHistoryNotes,
    currentHeight: item.detail.currentHeight,
    currentWeight: item.detail.currentWeight,
    updatedAt: item.detail.updatedAt,
  }));
};

