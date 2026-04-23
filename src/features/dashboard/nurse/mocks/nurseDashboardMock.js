const toIsoAt = (daysOffset, hour, minute = 0) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

const getMockRecentExaminations = () => ([
  {
    visitId: 1,
    code: 'VIS001',
    studentName: 'Nguyen Gia Bao',
    visitDate: toIsoAt(0, 8, 5),
    diagnosis: 'Nghi cam cum',
  },
  {
    visitId: 2,
    code: 'VIS002',
    studentName: 'Tran Phuong Anh',
    visitDate: toIsoAt(0, 9, 10),
    diagnosis: 'Kiem tra dinh ky',
  },
  {
    visitId: 3,
    code: 'VIS003',
    studentName: 'Le Tuan Hai',
    visitDate: toIsoAt(-1, 8, 40),
    diagnosis: 'Tray xuoc tay',
  },
  {
    visitId: 4,
    code: 'VIS004',
    studentName: 'Pham Hoai Nam',
    visitDate: toIsoAt(-1, 10, 0),
    diagnosis: 'Dau hong',
  },
  {
    visitId: 5,
    code: 'VIS005',
    studentName: 'Bui Thanh Long',
    visitDate: toIsoAt(-2, 9, 5),
    diagnosis: 'Dau bung nhe',
  },
]);

const getMockLowStockMedicines = () => ([
  {
    medicineId: 1,
    code: 'MED001',
    name: 'Paracetamol 500mg',
    stockQuantity: 18,
    warningThreshold: 30,
    expiryDate: null,
  },
  {
    medicineId: 4,
    code: 'MED004',
    name: 'Oresol',
    stockQuantity: 10,
    warningThreshold: 20,
    expiryDate: null,
  },
]);

const getMockExpiringMedicines = () => ([
  {
    medicineId: 7,
    code: 'MED007',
    name: 'Nuoc muoi sinh ly',
    stockQuantity: 24,
    warningThreshold: 10,
    expiryDate: toIsoAt(20, 0, 0),
  },
  {
    medicineId: 15,
    code: 'MED015',
    name: 'Kem boi da',
    stockQuantity: 8,
    warningThreshold: 8,
    expiryDate: toIsoAt(12, 0, 0),
  },
]);

export const getNurseDashboardMockSnapshot = () => {
  // Return NurseDashboardOverviewDto format wrapped in ApiResponse
  return {
    success: true,
    message: 'Mock: Lay thong tin tong quan Y ta thanh cong.',
    data: {
      totalVisitsToday: 3,
      recentExaminations: getMockRecentExaminations(),
      lowStockMedicines: getMockLowStockMedicines(),
      expiringMedicines: getMockExpiringMedicines(),
      pendingVaccinationsCount: 12,
    },
    errors: null,
    meta: null,
  };
};
