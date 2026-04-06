const MEDICINE_UNITS = ['VIEN', 'GOI', 'CHAI', 'HOP', 'TUYP', 'ONG', 'LO'];

let medicineSequence = 5;
let movementSequence = 7;

const nowIso = () => new Date().toISOString();

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isExpiringSoon = (dateOnlyValue) => {
  if (!dateOnlyValue) return false;
  const today = new Date();
  const threshold = new Date();
  threshold.setDate(today.getDate() + 30);
  const parsed = new Date(`${dateOnlyValue}T00:00:00`);
  return !Number.isNaN(parsed.getTime()) && parsed <= threshold;
};

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

const createEnvelope = ({ message, data, meta = null }) => ({
  success: true,
  message,
  data,
  meta,
  timestamp: nowIso(),
  traceId: 'mock-medicine-trace-id',
});

const medicines = [
  {
    id: 'MED001',
    name: 'Paracetamol 500mg',
    activeIngredient: 'Acetaminophen',
    unit: 'VIEN',
    packaging: 'Hop 10 vi x 10 vien',
    warningThreshold: 100,
    currentStock: 450,
    status: 'ACTIVE',
    note: 'Uong sau khi an.',
    createdAt: '2026-03-20T02:00:00Z',
    updatedAt: '2026-04-05T09:15:00Z',
  },
  {
    id: 'MED002',
    name: 'Amoxicillin 250mg',
    activeIngredient: 'Amoxicillin Trihydrate',
    unit: 'GOI',
    packaging: 'Hop 24 goi',
    warningThreshold: 50,
    currentStock: 12,
    status: 'ACTIVE',
    note: null,
    createdAt: '2026-03-21T02:00:00Z',
    updatedAt: '2026-04-05T08:10:00Z',
  },
  {
    id: 'MED003',
    name: 'Cough Syrup Alpha',
    activeIngredient: 'Dextromethorphan',
    unit: 'CHAI',
    packaging: 'Thung 20 chai 100ml',
    warningThreshold: 20,
    currentStock: 0,
    status: 'INACTIVE',
    note: 'Ngung su dung do het nhu cau.',
    createdAt: '2026-03-15T02:00:00Z',
    updatedAt: '2026-04-01T10:30:00Z',
  },
  {
    id: 'MED004',
    name: 'Strepsils Original',
    activeIngredient: 'Amylmetacresol',
    unit: 'VIEN',
    packaging: 'Hop 2 vi x 12 vien',
    warningThreshold: 30,
    currentStock: 80,
    status: 'ACTIVE',
    note: null,
    createdAt: '2026-03-11T02:00:00Z',
    updatedAt: '2026-04-02T06:00:00Z',
  },
];

const movements = [
  {
    movementId: 'MSL001',
    medicineId: 'MED001',
    type: 'IMPORT',
    quantity: 200,
    stockBefore: 250,
    stockAfter: 450,
    expiryDate: daysFromNow(240),
    batchNumber: 'LOT-2026-001',
    reason: null,
    note: 'Nhap bo sung dau nam',
    createdBy: { userId: 'USR001', fullName: 'Nurse Minh Anh' },
    createdAt: '2026-04-03T03:10:00Z',
  },
  {
    movementId: 'MSL002',
    medicineId: 'MED002',
    type: 'IMPORT',
    quantity: 20,
    stockBefore: 0,
    stockAfter: 20,
    expiryDate: daysFromNow(16),
    batchNumber: 'LOT-2026-011',
    reason: null,
    note: null,
    createdBy: { userId: 'USR001', fullName: 'Nurse Minh Anh' },
    createdAt: '2026-04-04T06:30:00Z',
  },
  {
    movementId: 'MSL003',
    medicineId: 'MED002',
    type: 'DISPOSE',
    quantity: 8,
    stockBefore: 20,
    stockAfter: 12,
    expiryDate: daysFromNow(16),
    batchNumber: 'LOT-2026-011',
    reason: 'DAMAGED',
    note: 'Vo bao bi trong qua trinh bao quan',
    createdBy: { userId: 'USR001', fullName: 'Nurse Minh Anh' },
    createdAt: '2026-04-05T01:00:00Z',
  },
  {
    movementId: 'MSL004',
    medicineId: 'MED003',
    type: 'DISPOSE',
    quantity: 10,
    stockBefore: 10,
    stockAfter: 0,
    expiryDate: daysFromNow(-5),
    batchNumber: 'LOT-2025-015',
    reason: 'EXPIRED',
    note: null,
    createdBy: { userId: 'USR001', fullName: 'Nurse Minh Anh' },
    createdAt: '2026-04-01T00:30:00Z',
  },
  {
    movementId: 'MSL005',
    medicineId: 'MED004',
    type: 'IMPORT',
    quantity: 80,
    stockBefore: 0,
    stockAfter: 80,
    expiryDate: daysFromNow(20),
    batchNumber: 'LOT-2026-009',
    reason: null,
    note: null,
    createdBy: { userId: 'USR002', fullName: 'Nurse Thu Ha' },
    createdAt: '2026-04-02T05:15:00Z',
  },
];

const toNearestExpiryDate = (medicineId) => {
  const dates = movements
    .filter((item) => item.medicineId === medicineId && item.expiryDate)
    .map((item) => item.expiryDate)
    .sort();

  return dates[0] || null;
};

const toMedicineListItem = (medicine) => {
  const nearestExpiryDate = toNearestExpiryDate(medicine.id);
  const isLowStock = medicine.currentStock <= medicine.warningThreshold;

  return {
    id: medicine.id,
    name: medicine.name,
    activeIngredient: medicine.activeIngredient,
    unit: medicine.unit,
    packaging: medicine.packaging,
    warningThreshold: medicine.warningThreshold,
    currentStock: medicine.currentStock,
    nearestExpiryDate,
    isLowStock,
    isExpiringSoon: isExpiringSoon(nearestExpiryDate),
    status: medicine.status,
  };
};

const toMedicineDetailItem = (medicine) => {
  const listItem = toMedicineListItem(medicine);

  return {
    ...listItem,
    note: medicine.note,
    createdAt: medicine.createdAt,
    updatedAt: medicine.updatedAt,
  };
};

const isMedicineNameExists = (name, excludeId = null) => {
  const normalized = String(name || '').trim().toLowerCase();
  return medicines.some((item) => item.id !== excludeId && item.name.toLowerCase() === normalized);
};

const withPagination = (items, page, pageSize) => {
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const offset = (page - 1) * pageSize;

  return {
    pageItems: items.slice(offset, offset + pageSize),
    meta: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
};

export const mockGetMedicines = async (query = {}) => {
  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const keyword = String(query.keyword || '').trim().toLowerCase();
  const status = String(query.status || '').trim();

  const rows = medicines
    .map(toMedicineListItem)
    .filter((item) => {
      if (keyword) {
        const byName = item.name.toLowerCase().includes(keyword);
        const byIngredient = String(item.activeIngredient || '').toLowerCase().includes(keyword);
        if (!byName && !byIngredient) return false;
      }

      if (status && status !== 'all' && item.status !== status) {
        return false;
      }

      if (query.lowStock === true && !item.isLowStock) {
        return false;
      }

      if (query.expiring === true && !item.isExpiringSoon) {
        return false;
      }

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const { pageItems, meta } = withPagination(rows, page, pageSize);

  return createEnvelope({
    message: 'Mock: Lay danh sach thuoc thanh cong.',
    data: pageItems,
    meta,
  });
};

export const mockGetMedicineById = async (id) => {
  const medicine = medicines.find((item) => item.id === id);
  if (!medicine) {
    throwMockApiError(404, 'Khong tim thay thuoc.', [
      {
        field: 'id',
        code: 'MEDICINE_NOT_FOUND',
        message: 'Khong ton tai thuoc voi id da cung cap.',
      },
    ]);
  }

  return createEnvelope({
    message: 'Mock: Lay chi tiet thuoc thanh cong.',
    data: toMedicineDetailItem(medicine),
  });
};

export const mockCreateMedicine = async (payload) => {
  const name = String(payload?.name || '').trim();
  const unit = String(payload?.unit || '').trim().toUpperCase();
  const warningThreshold = Number(payload?.warningThreshold);

  if (!name) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'name', code: 'REQUIRED', message: 'name bat buoc.' },
    ]);
  }

  if (!MEDICINE_UNITS.includes(unit)) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'unit', code: 'INVALID_UNIT', message: 'unit khong hop le.' },
    ]);
  }

  if (!Number.isFinite(warningThreshold) || warningThreshold <= 0) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      {
        field: 'warningThreshold',
        code: 'INVALID_WARNING_THRESHOLD',
        message: 'Muc canh bao phai lon hon 0.',
      },
    ]);
  }

  if (isMedicineNameExists(name)) {
    throwMockApiError(409, 'Thuoc da ton tai.', [
      {
        field: 'name',
        code: 'MEDICINE_ALREADY_EXISTS',
        message: 'Ten thuoc da ton tai trong he thong.',
      },
    ]);
  }

  const created = {
    id: `MED${String(medicineSequence).padStart(3, '0')}`,
    name,
    activeIngredient: payload?.activeIngredient ? String(payload.activeIngredient).trim() : null,
    unit,
    packaging: payload?.packaging ? String(payload.packaging).trim() : null,
    warningThreshold,
    currentStock: 0,
    status: 'ACTIVE',
    note: payload?.note ? String(payload.note).trim() : null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  medicineSequence += 1;
  medicines.push(created);

  return createEnvelope({
    message: 'Mock: Tao thuoc thanh cong.',
    data: toMedicineDetailItem(created),
  });
};

export const mockUpdateMedicine = async (id, payload) => {
  const medicine = medicines.find((item) => item.id === id);
  if (!medicine) {
    throwMockApiError(404, 'Khong tim thay thuoc.', [
      { field: 'id', code: 'MEDICINE_NOT_FOUND', message: 'Khong ton tai thuoc voi id da cung cap.' },
    ]);
  }

  if (
    payload?.name === undefined
    && payload?.activeIngredient === undefined
    && payload?.unit === undefined
    && payload?.packaging === undefined
    && payload?.warningThreshold === undefined
    && payload?.note === undefined
  ) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'body', code: 'NO_FIELDS', message: 'It nhat 1 field phai duoc gui len.' },
    ]);
  }

  if (payload?.name !== undefined) {
    const nextName = String(payload.name || '').trim();
    if (!nextName) {
      throwMockApiError(400, 'Du lieu khong hop le.', [
        { field: 'name', code: 'REQUIRED', message: 'name bat buoc.' },
      ]);
    }

    if (isMedicineNameExists(nextName, medicine.id)) {
      throwMockApiError(409, 'Thuoc da ton tai.', [
        { field: 'name', code: 'MEDICINE_ALREADY_EXISTS', message: 'Ten thuoc da ton tai trong he thong.' },
      ]);
    }

    medicine.name = nextName;
  }

  if (payload?.activeIngredient !== undefined) {
    medicine.activeIngredient = payload.activeIngredient ? String(payload.activeIngredient).trim() : null;
  }

  if (payload?.unit !== undefined) {
    const unit = String(payload.unit || '').trim().toUpperCase();
    if (!MEDICINE_UNITS.includes(unit)) {
      throwMockApiError(400, 'Du lieu khong hop le.', [
        { field: 'unit', code: 'INVALID_UNIT', message: 'unit khong hop le.' },
      ]);
    }

    medicine.unit = unit;
  }

  if (payload?.packaging !== undefined) {
    medicine.packaging = payload.packaging ? String(payload.packaging).trim() : null;
  }

  if (payload?.warningThreshold !== undefined) {
    const warningThreshold = Number(payload.warningThreshold);
    if (!Number.isFinite(warningThreshold) || warningThreshold <= 0) {
      throwMockApiError(400, 'Du lieu khong hop le.', [
        {
          field: 'warningThreshold',
          code: 'INVALID_WARNING_THRESHOLD',
          message: 'Muc canh bao phai lon hon 0.',
        },
      ]);
    }

    medicine.warningThreshold = warningThreshold;
  }

  if (payload?.note !== undefined) {
    medicine.note = payload.note ? String(payload.note).trim() : null;
  }

  medicine.updatedAt = nowIso();

  return createEnvelope({
    message: 'Mock: Cap nhat thuoc thanh cong.',
    data: {
      id: medicine.id,
      name: medicine.name,
      activeIngredient: medicine.activeIngredient,
      unit: medicine.unit,
      packaging: medicine.packaging,
      warningThreshold: medicine.warningThreshold,
      note: medicine.note,
      updatedAt: medicine.updatedAt,
    },
  });
};

export const mockUpdateMedicineStatus = async (id, payload) => {
  const medicine = medicines.find((item) => item.id === id);
  if (!medicine) {
    throwMockApiError(404, 'Khong tim thay thuoc.', [
      { field: 'id', code: 'MEDICINE_NOT_FOUND', message: 'Khong ton tai thuoc voi id da cung cap.' },
    ]);
  }

  const status = String(payload?.status || '').trim().toUpperCase();
  if (!['ACTIVE', 'INACTIVE'].includes(status)) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'status', code: 'INVALID_STATUS', message: 'status chi duoc phep la ACTIVE hoac INACTIVE.' },
    ]);
  }

  medicine.status = status;
  medicine.updatedAt = nowIso();

  return createEnvelope({
    message: 'Mock: Cap nhat trang thai thuoc thanh cong.',
    data: {
      id: medicine.id,
      status,
      reason: payload?.reason ? String(payload.reason).trim() : null,
      updatedAt: medicine.updatedAt,
    },
  });
};

const createMovementItem = ({
  medicine,
  type,
  quantity,
  stockBefore,
  stockAfter,
  expiryDate,
  batchNumber,
  reason,
  note,
}) => {
  const movementId = `MSL${String(movementSequence).padStart(3, '0')}`;
  movementSequence += 1;

  const movement = {
    movementId,
    medicineId: medicine.id,
    type,
    quantity,
    stockBefore,
    stockAfter,
    expiryDate: expiryDate || null,
    batchNumber: batchNumber || null,
    reason: reason || null,
    note: note || null,
    createdBy: {
      userId: 'USR001',
      fullName: 'Nurse Minh Anh',
    },
    createdAt: nowIso(),
  };

  movements.push(movement);

  return movement;
};

export const mockStockInMedicine = async (id, payload) => {
  const medicine = medicines.find((item) => item.id === id);
  if (!medicine) {
    throwMockApiError(404, 'Khong tim thay thuoc.', [
      { field: 'id', code: 'MEDICINE_NOT_FOUND', message: 'Khong ton tai thuoc voi id da cung cap.' },
    ]);
  }

  const quantity = Number(payload?.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'quantity', code: 'INVALID_QUANTITY', message: 'quantity phai > 0.' },
    ]);
  }

  if (!payload?.expiryDate) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'expiryDate', code: 'INVALID_EXPIRY_DATE', message: 'expiryDate bat buoc va phai lon hon ngay hien tai.' },
    ]);
  }

  const today = new Date();
  const expiryDate = new Date(`${payload.expiryDate}T00:00:00`);
  const todayDateOnly = new Date(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T00:00:00`);

  if (Number.isNaN(expiryDate.getTime()) || expiryDate <= todayDateOnly) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'expiryDate', code: 'INVALID_EXPIRY_DATE', message: 'expiryDate phai lon hon ngay hien tai.' },
    ]);
  }

  const stockBefore = medicine.currentStock;
  const stockAfter = stockBefore + quantity;
  medicine.currentStock = stockAfter;
  medicine.updatedAt = nowIso();

  const movement = createMovementItem({
    medicine,
    type: 'IMPORT',
    quantity,
    stockBefore,
    stockAfter,
    expiryDate: payload.expiryDate,
    batchNumber: payload?.batchNumber ? String(payload.batchNumber).trim() : null,
    reason: null,
    note: payload?.note ? String(payload.note).trim() : null,
  });

  return createEnvelope({
    message: 'Mock: Nhap kho thanh cong.',
    data: {
      medicineId: medicine.id,
      movementId: movement.movementId,
      type: movement.type,
      quantity: movement.quantity,
      stockBefore: movement.stockBefore,
      stockAfter: movement.stockAfter,
      expiryDate: movement.expiryDate,
      batchNumber: movement.batchNumber,
      reason: movement.reason,
      createdAt: movement.createdAt,
    },
  });
};

export const mockDisposeMedicine = async (id, payload) => {
  const medicine = medicines.find((item) => item.id === id);
  if (!medicine) {
    throwMockApiError(404, 'Khong tim thay thuoc.', [
      { field: 'id', code: 'MEDICINE_NOT_FOUND', message: 'Khong ton tai thuoc voi id da cung cap.' },
    ]);
  }

  const quantity = Number(payload?.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'quantity', code: 'INVALID_QUANTITY', message: 'quantity phai > 0.' },
    ]);
  }

  const reason = String(payload?.reason || '').trim();
  if (!reason) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'reason', code: 'INVALID_REASON', message: 'reason bat buoc.' },
    ]);
  }

  if (quantity > medicine.currentStock) {
    throwMockApiError(400, 'So luong huy khong hop le.', [
      {
        field: 'quantity',
        code: 'DISPOSE_QUANTITY_EXCEEDS_STOCK',
        message: 'So luong huy vuot qua so luong ton kho.',
      },
    ]);
  }

  const stockBefore = medicine.currentStock;
  const stockAfter = stockBefore - quantity;
  medicine.currentStock = stockAfter;
  medicine.updatedAt = nowIso();

  const movement = createMovementItem({
    medicine,
    type: 'DISPOSE',
    quantity,
    stockBefore,
    stockAfter,
    expiryDate: payload?.expiryDate || null,
    batchNumber: payload?.batchNumber ? String(payload.batchNumber).trim() : null,
    reason: reason.toUpperCase(),
    note: payload?.note ? String(payload.note).trim() : null,
  });

  return createEnvelope({
    message: 'Mock: Huy thuoc thanh cong.',
    data: {
      medicineId: medicine.id,
      movementId: movement.movementId,
      type: movement.type,
      quantity: movement.quantity,
      stockBefore: movement.stockBefore,
      stockAfter: movement.stockAfter,
      expiryDate: movement.expiryDate,
      batchNumber: movement.batchNumber,
      reason: movement.reason,
      createdAt: movement.createdAt,
    },
  });
};

export const mockGetMedicineMovements = async (id, query = {}) => {
  const medicine = medicines.find((item) => item.id === id);
  if (!medicine) {
    return createEnvelope({
      message: 'Mock: Lay lich su bien dong kho thanh cong.',
      data: [],
      meta: {
        page: Number(query.page || 1),
        pageSize: Number(query.pageSize || 20),
        totalItems: 0,
        totalPages: 0,
      },
    });
  }

  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 20)));
  const type = String(query.type || '').trim();
  const fromDate = query.fromDate ? new Date(`${query.fromDate}T00:00:00`) : null;
  const toDate = query.toDate ? new Date(`${query.toDate}T23:59:59`) : null;

  const rows = movements
    .filter((item) => item.medicineId === medicine.id)
    .filter((item) => {
      if (type && item.type !== type) return false;
      const createdAt = new Date(item.createdAt);
      if (fromDate && createdAt < fromDate) return false;
      if (toDate && createdAt > toDate) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((item) => ({
      movementId: item.movementId,
      type: item.type,
      quantity: item.quantity,
      stockBefore: item.stockBefore,
      stockAfter: item.stockAfter,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      reason: item.reason,
      referenceType: null,
      referenceId: null,
      createdBy: item.createdBy,
      createdAt: item.createdAt,
    }));

  const { pageItems, meta } = withPagination(rows, page, pageSize);

  return createEnvelope({
    message: 'Mock: Lay lich su bien dong kho thanh cong.',
    data: pageItems,
    meta,
  });
};

export const mockGetMedicineAlerts = async (query = {}) => {
  const type = String(query.type || 'ALL').trim().toUpperCase();

  const alerts = medicines
    .filter((item) => item.status === 'ACTIVE')
    .map(toMedicineListItem)
    .flatMap((item) => {
      const rows = [];
      if (item.isLowStock) {
        rows.push({
          medicineId: item.id,
          medicineName: item.name,
          alertType: 'LOW_STOCK',
          currentStock: item.currentStock,
          warningThreshold: item.warningThreshold,
          nearestExpiryDate: item.nearestExpiryDate,
          message: 'Thuoc sap het hang.',
        });
      }

      if (item.isExpiringSoon) {
        rows.push({
          medicineId: item.id,
          medicineName: item.name,
          alertType: 'EXPIRING',
          currentStock: item.currentStock,
          warningThreshold: item.warningThreshold,
          nearestExpiryDate: item.nearestExpiryDate,
          message: 'Thuoc sap het han.',
        });
      }

      return rows;
    })
    .filter((item) => type === 'ALL' || item.alertType === type);

  return createEnvelope({
    message: 'Mock: Lay danh sach canh bao thanh cong.',
    data: alerts,
    meta: null,
  });
};
