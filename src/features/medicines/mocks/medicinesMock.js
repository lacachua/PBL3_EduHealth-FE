const medicines = [
  {
    id: 'MED001',
    name: 'Paracetamol 500mg',
    activeIngredient: 'Paracetamol',
    unit: 'VIEN',
    packaging: 'Hộp 10 vỉ',
    warningThreshold: 50,
    currentStock: 120,
    nearestExpiryDate: '2026-08-30',
    isLowStock: false,
    isExpiringSoon: false,
    status: 'ACTIVE',
    note: 'Giảm đau, hạ sốt',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-28T13:30:00Z',
  },
  {
    id: 'MED002',
    name: 'ORS',
    activeIngredient: 'Oresol',
    unit: 'GOI',
    packaging: 'Hộp 24 gói',
    warningThreshold: 20,
    currentStock: 12,
    nearestExpiryDate: '2026-04-10',
    isLowStock: true,
    isExpiringSoon: true,
    status: 'ACTIVE',
    note: 'Bù nước điện giải',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-03-28T14:00:00Z',
  },
  {
    id: 'MED003',
    name: 'Amoxicillin',
    activeIngredient: 'Amoxicillin',
    unit: 'VIEN',
    packaging: 'Hộp 10 vỉ',
    warningThreshold: 40,
    currentStock: 35,
    nearestExpiryDate: '2026-04-05',
    isLowStock: true,
    isExpiringSoon: true,
    status: 'INACTIVE',
    note: 'Tạm ngưng sử dụng',
    createdAt: '2026-01-03T08:00:00Z',
    updatedAt: '2026-03-27T10:00:00Z',
  },
];

const movementMap = {
  MED001: [
    {
      movementId: 'MSL001',
      type: 'IMPORT',
      quantity: 100,
      stockBefore: 20,
      stockAfter: 120,
      batchNumber: 'BATCH-2026-001',
      expiryDate: '2026-08-30',
      reason: null,
      createdBy: { userId: 'USR001', fullName: 'Nguyễn Thị Lan' },
      createdAt: '2026-03-28T14:10:00Z',
    },
  ],
  MED002: [
    {
      movementId: 'MSL002',
      type: 'DISPOSE',
      quantity: 5,
      stockBefore: 17,
      stockAfter: 12,
      batchNumber: 'BATCH-2025-008',
      expiryDate: '2026-03-20',
      reason: 'EXPIRED',
      createdBy: { userId: 'USR002', fullName: 'Trần Minh Anh' },
      createdAt: '2026-03-28T14:20:00Z',
    },
  ],
};

const applyMedicineFilters = (rows, query = {}) => {
  const keyword = (query.keyword || '').trim().toLowerCase();
  const status = query.status || 'all';

  return rows.filter((item) => {
    const byKeyword = !keyword
      || item.name.toLowerCase().includes(keyword)
      || item.activeIngredient.toLowerCase().includes(keyword);
    const byStatus = status === 'all' || item.status === status;
    const byLowStock = !query.lowStock || item.isLowStock;
    const byExpiring = !query.expiring || item.isExpiringSoon;

    return byKeyword && byStatus && byLowStock && byExpiring;
  });
};

export const getMedicinesMockEnvelope = (query = {}) => {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);

  const filtered = applyMedicineFilters(medicines, query);
  const start = (page - 1) * pageSize;

  return {
    success: true,
    message: 'Mock: lấy danh sách thuốc thành công.',
    data: filtered.slice(start, start + pageSize),
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

export const getMedicineDetailMockEnvelope = (medicineId) => {
  const found = medicines.find((item) => item.id === medicineId);

  if (!found) {
    return {
      success: false,
      message: 'Mock: không tìm thấy thuốc.',
      data: null,
      errors: [{ field: 'id', message: 'Medicine not found' }],
      meta: { source: 'mock' },
    };
  }

  return {
    success: true,
    message: 'Mock: lấy chi tiết thuốc thành công.',
    data: found,
    errors: null,
    meta: { source: 'mock' },
  };
};

export const getMedicineAlertsMockEnvelope = (query = {}) => {
  const type = (query.type || 'ALL').toUpperCase();

  const alerts = medicines
    .flatMap((item) => {
      const rows = [];
      if (item.isLowStock) {
        rows.push({
          medicineId: item.id,
          medicineName: item.name,
          alertType: 'LOW_STOCK',
          currentStock: item.currentStock,
          warningThreshold: item.warningThreshold,
          message: 'Thuốc sắp hết hàng.',
        });
      }
      if (item.isExpiringSoon) {
        rows.push({
          medicineId: item.id,
          medicineName: item.name,
          alertType: 'EXPIRING',
          nearestExpiryDate: item.nearestExpiryDate,
          message: 'Thuốc sắp hết hạn.',
        });
      }
      return rows;
    })
    .filter((alert) => type === 'ALL' || alert.alertType === type);

  return {
    success: true,
    message: 'Mock: lấy danh sách cảnh báo thành công.',
    data: alerts,
    errors: null,
    meta: { source: 'mock' },
  };
};

export const getMedicineMovementsMockEnvelope = (medicineId, query = {}) => {
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 5);
  const sourceRows = movementMap[medicineId] || [];

  const start = (page - 1) * pageSize;
  const pagedRows = sourceRows.slice(start, start + pageSize);

  return {
    success: true,
    message: 'Mock: lấy lịch sử biến động kho thành công.',
    data: pagedRows,
    errors: null,
    meta: {
      page,
      pageSize,
      totalItems: sourceRows.length,
      totalPages: Math.max(1, Math.ceil(sourceRows.length / pageSize)),
      source: 'mock',
    },
  };
};
