import {
  NURSE_DASHBOARD_ACTIVE_CAMPAIGN_LIMIT,
  NURSE_DASHBOARD_MEDICINE_ALERT_LIMIT,
  NURSE_DASHBOARD_PENDING_LIMIT,
  NURSE_DASHBOARD_RECENT_EXAM_LIMIT,
} from '../constants/nurseDashboardConfig';

const createEnvelope = ({ message, data, meta = null }) => ({
  success: true,
  message,
  data,
  errors: null,
  meta,
});

const toIsoAt = (daysOffset, hour, minute = 0) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

const sortByVisitDateDesc = (left, right) => {
  const leftTime = new Date(left?.visitDate || 0).getTime();
  const rightTime = new Date(right?.visitDate || 0).getTime();
  return rightTime - leftTime;
};

const getMockExaminations = () => ([
  {
    id: 'VIS-MOCK-001',
    visitDate: toIsoAt(-6, 8, 5),
    student: {
      studentId: 'STD010',
      studentCode: 'HS010',
      fullName: 'Nguyen Gia Bao',
      className: '4A2',
    },
    diagnosis: 'Nghi cam cum',
    hasPrescription: true,
  },
  {
    id: 'VIS-MOCK-002',
    visitDate: toIsoAt(-5, 9, 10),
    student: {
      studentId: 'STD021',
      studentCode: 'HS021',
      fullName: 'Tran Phuong Anh',
      className: '2B',
    },
    diagnosis: 'Kiem tra dinh ky',
    hasPrescription: false,
  },
  {
    id: 'VIS-MOCK-003',
    visitDate: toIsoAt(-4, 8, 40),
    student: {
      studentId: 'STD033',
      studentCode: 'HS033',
      fullName: 'Le Tuan Hai',
      className: '5C',
    },
    diagnosis: 'Tray xuoc tay',
    hasPrescription: false,
  },
  {
    id: 'VIS-MOCK-004',
    visitDate: toIsoAt(-3, 10, 0),
    student: {
      studentId: 'STD008',
      studentCode: 'HS008',
      fullName: 'Pham Hoai Nam',
      className: '4B',
    },
    diagnosis: 'Dau hong',
    hasPrescription: true,
  },
  {
    id: 'VIS-MOCK-005',
    visitDate: toIsoAt(-2, 9, 5),
    student: {
      studentId: 'STD018',
      studentCode: 'HS018',
      fullName: 'Bui Thanh Long',
      className: '3A1',
    },
    diagnosis: 'Dau bung nhe',
    hasPrescription: true,
  },
  {
    id: 'VIS-MOCK-006',
    visitDate: toIsoAt(-1, 8, 30),
    student: {
      studentId: 'STD014',
      studentCode: 'HS014',
      fullName: 'Do Tuong Vy',
      className: '1C',
    },
    diagnosis: 'Sot nhe',
    hasPrescription: true,
  },
  {
    id: 'VIS-MOCK-007',
    visitDate: toIsoAt(0, 7, 45),
    student: {
      studentId: 'STD011',
      studentCode: 'HS011',
      fullName: 'Nguyen Minh An',
      className: '4A',
    },
    diagnosis: 'Ho, sot',
    hasPrescription: true,
  },
  {
    id: 'VIS-MOCK-008',
    visitDate: toIsoAt(0, 9, 15),
    student: {
      studentId: 'STD006',
      studentCode: 'HS006',
      fullName: 'Ngo Anh Khoa',
      className: '5A',
    },
    diagnosis: 'Theo doi dau dau',
    hasPrescription: false,
  },
  {
    id: 'VIS-MOCK-009',
    visitDate: toIsoAt(0, 10, 5),
    student: {
      studentId: 'STD004',
      studentCode: 'HS004',
      fullName: 'Le Thu Ha',
      className: '2A1',
    },
    diagnosis: 'Vet thuong nho',
    hasPrescription: false,
  },
]);

const getMockMedicineAlerts = () => ([
  {
    medicineId: 'MED001',
    medicineName: 'Paracetamol 500mg',
    alertType: 'LOW_STOCK',
    currentStock: 18,
    warningThreshold: 30,
    nearestExpiryDate: toIsoAt(120, 0, 0),
    message: 'So luong ton kho duoi nguong canh bao.',
  },
  {
    medicineId: 'MED004',
    medicineName: 'Oresol',
    alertType: 'LOW_STOCK',
    currentStock: 10,
    warningThreshold: 20,
    nearestExpiryDate: toIsoAt(45, 0, 0),
    message: 'Can bo sung ton kho trong ngay.',
  },
  {
    medicineId: 'MED007',
    medicineName: 'Nuoc muoi sinh ly',
    alertType: 'EXPIRING',
    currentStock: 24,
    warningThreshold: 10,
    nearestExpiryDate: toIsoAt(20, 0, 0),
    message: 'Lo thuoc sap den han su dung.',
  },
  {
    medicineId: 'MED015',
    medicineName: 'Kem boi da',
    alertType: 'EXPIRING',
    currentStock: 8,
    warningThreshold: 8,
    nearestExpiryDate: toIsoAt(12, 0, 0),
    message: 'Can uu tien xuat truoc han.',
  },
]);

const getMockPendingVaccinations = () => ([
  {
    studentVaccinationId: 'SV-MOCK-001',
    campaignId: 'VAC-MOCK-001',
    campaignName: 'Tiem soi khoi 1',
    student: {
      studentId: 'STD001',
      studentCode: 'HS001',
      fullName: 'Tran Gia Bao',
      className: '1A',
    },
    status: 'PENDING',
    scheduledDate: toIsoAt(1, 0, 0),
  },
  {
    studentVaccinationId: 'SV-MOCK-002',
    campaignId: 'VAC-MOCK-001',
    campaignName: 'Tiem soi khoi 1',
    student: {
      studentId: 'STD002',
      studentCode: 'HS002',
      fullName: 'Pham Linh Chi',
      className: '1A',
    },
    status: 'POSTPONED',
    scheduledDate: toIsoAt(1, 0, 0),
  },
  {
    studentVaccinationId: 'SV-MOCK-003',
    campaignId: 'VAC-MOCK-002',
    campaignName: 'Tiem uon van khoi 5',
    student: {
      studentId: 'STD003',
      studentCode: 'HS003',
      fullName: 'Do Khanh Nhi',
      className: '5B',
    },
    status: 'ABSENT',
    scheduledDate: toIsoAt(2, 0, 0),
  },
  {
    studentVaccinationId: 'SV-MOCK-004',
    campaignId: 'VAC-MOCK-003',
    campaignName: 'Tiem cum mua hoc ky II',
    student: {
      studentId: 'STD004',
      studentCode: 'HS004',
      fullName: 'Vu Quang Minh',
      className: '4C',
    },
    status: 'CONTRAINDICATED',
    scheduledDate: toIsoAt(3, 0, 0),
  },
]);

const getMockCampaigns = () => ([
  {
    id: 'VAC-MOCK-001',
    name: 'Tiem soi khoi 1',
    status: 'ACTIVE',
    scheduledDate: toIsoAt(1, 0, 0),
    statistics: {
      totalStudents: 130,
      doneCount: 82,
      pendingCount: 48,
    },
  },
  {
    id: 'VAC-MOCK-002',
    name: 'Tiem uon van khoi 5',
    status: 'ACTIVE',
    scheduledDate: toIsoAt(2, 0, 0),
    statistics: {
      totalStudents: 96,
      doneCount: 60,
      pendingCount: 36,
    },
  },
  {
    id: 'VAC-MOCK-003',
    name: 'Tiem cum mua hoc ky II',
    status: 'ACTIVE',
    scheduledDate: toIsoAt(3, 0, 0),
    statistics: {
      totalStudents: 164,
      doneCount: 112,
      pendingCount: 52,
    },
  },
]);

export const getNurseDashboardMockSnapshot = () => {
  const now = new Date();
  const examinations = getMockExaminations().sort(sortByVisitDateDesc);
  const recentExaminations = examinations.slice(0, NURSE_DASHBOARD_RECENT_EXAM_LIMIT);

  const medicineAlerts = getMockMedicineAlerts().slice(0, NURSE_DASHBOARD_MEDICINE_ALERT_LIMIT);
  const pendingVaccinations = getMockPendingVaccinations().slice(0, NURSE_DASHBOARD_PENDING_LIMIT);
  const activeCampaigns = getMockCampaigns().slice(0, NURSE_DASHBOARD_ACTIVE_CAMPAIGN_LIMIT);

  return {
    source: 'mock',
    generatedAt: now.toISOString(),
    sources: {
      examinationsWindow: createEnvelope({
        message: 'Mock: Lay du lieu kham 7 ngay thanh cong.',
        data: examinations,
        meta: {
          page: 1,
          pageSize: examinations.length,
          totalItems: examinations.length,
          totalPages: 1,
        },
      }),
      recentExaminations: createEnvelope({
        message: 'Mock: Lay danh sach kham gan day thanh cong.',
        data: recentExaminations,
        meta: {
          page: 1,
          pageSize: NURSE_DASHBOARD_RECENT_EXAM_LIMIT,
          totalItems: examinations.length,
          totalPages: 1,
        },
      }),
      medicineAlerts: createEnvelope({
        message: 'Mock: Lay canh bao kho thuoc thanh cong.',
        data: medicineAlerts,
        meta: {
          totalItems: medicineAlerts.length,
        },
      }),
      pendingVaccinations: createEnvelope({
        message: 'Mock: Lay danh sach tiem chung can xu ly thanh cong.',
        data: pendingVaccinations,
        meta: {
          page: 1,
          pageSize: NURSE_DASHBOARD_PENDING_LIMIT,
          totalItems: getMockPendingVaccinations().length,
          totalPages: 1,
        },
      }),
      activeCampaigns: createEnvelope({
        message: 'Mock: Lay chien dich dang hoat dong thanh cong.',
        data: activeCampaigns,
        meta: {
          page: 1,
          pageSize: NURSE_DASHBOARD_ACTIVE_CAMPAIGN_LIMIT,
          totalItems: getMockCampaigns().length,
          totalPages: 1,
        },
      }),
    },
    errors: {},
  };
};
