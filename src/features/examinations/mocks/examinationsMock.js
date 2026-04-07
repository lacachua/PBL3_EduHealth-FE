const diseaseNameById = {
  DIS001: 'Cam cum',
  DIS002: 'Dau bung',
  DIS003: 'Dau hong',
};

const studentProfileByStudentId = {
  STD001: {
    studentId: 'STD001',
    studentCode: 'HS001',
    fullName: 'Tran Van An',
    classId: 'CLS001',
    className: '4/2',
    gender: 'MALE',
  },
  STD002: {
    studentId: 'STD002',
    studentCode: 'HS002',
    fullName: 'Nguyen Thi Binh',
    classId: 'CLS001',
    className: '4/2',
    gender: 'FEMALE',
  },
  STD003: {
    studentId: 'STD003',
    studentCode: 'HS003',
    fullName: 'Le Gia Bao',
    classId: 'CLS002',
    className: '5/1',
    gender: 'MALE',
  },
};

const defaultNurse = {
  userId: 'USR001',
  fullName: 'Nurse Minh Anh',
};

const toIso = (value) => new Date(value).toISOString();

const initialExaminations = [
  {
    id: 'VIS001',
    visitDate: toIso('2026-04-02T08:30:00Z'),
    student: { ...studentProfileByStudentId.STD001 },
    nurse: { ...defaultNurse },
    diseaseType: { id: 'DIS001', name: diseaseNameById.DIS001 },
    symptoms: 'Sot nhe, dau hong',
    diagnosis: 'Cam cum thong thuong',
    treatment: 'Nghi ngoi, theo doi 24h',
    note: 'Da thong bao phu huynh',
    prescriptions: [
      {
        prescriptionId: 'VP001',
        medicineId: 'MED001',
        medicineName: 'Paracetamol 500mg',
        quantity: 1,
        dosage: '1 vien/lan',
        usageInstruction: 'Uong sau an',
      },
    ],
    createdAt: toIso('2026-04-02T08:35:00Z'),
  },
  {
    id: 'VIS002',
    visitDate: toIso('2026-04-03T09:20:00Z'),
    student: { ...studentProfileByStudentId.STD002 },
    nurse: { ...defaultNurse },
    diseaseType: { id: 'DIS002', name: diseaseNameById.DIS002 },
    symptoms: 'Dau bung nhe',
    diagnosis: 'Roi loan tieu hoa',
    treatment: 'Nghi tai phong y te 30 phut',
    note: null,
    prescriptions: [],
    createdAt: toIso('2026-04-03T09:25:00Z'),
  },
  {
    id: 'VIS003',
    visitDate: toIso('2026-04-05T07:50:00Z'),
    student: { ...studentProfileByStudentId.STD003 },
    nurse: { ...defaultNurse },
    diseaseType: { id: 'DIS003', name: diseaseNameById.DIS003 },
    symptoms: 'Dau hong, met moi',
    diagnosis: 'Viem hong cap',
    treatment: 'Nghi ngoi, bo sung nuoc am',
    note: 'Can theo doi them trong ngay',
    prescriptions: [
      {
        prescriptionId: 'VP002',
        medicineId: 'MED002',
        medicineName: 'ORS',
        quantity: 2,
        dosage: '2 goi/ngay',
        usageInstruction: 'Pha voi nuoc am',
      },
    ],
    createdAt: toIso('2026-04-05T07:55:00Z'),
  },
];

let mockExaminations = initialExaminations.map((item) => ({
  ...item,
  student: { ...item.student },
  nurse: { ...item.nurse },
  diseaseType: item.diseaseType ? { ...item.diseaseType } : null,
  prescriptions: item.prescriptions.map((prescription) => ({ ...prescription })),
}));

let examinationSequence = 4;
let prescriptionSequence = 100;

const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const createEnvelope = ({ message, data, meta = null }) => ({
  success: true,
  message,
  data,
  errors: null,
  meta,
  timestamp: new Date().toISOString(),
  traceId: 'mock-examination-trace-id',
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

const toListItem = (item) => ({
  id: item.id,
  visitDate: item.visitDate,
  student: {
    studentId: item.student.studentId,
    studentCode: item.student.studentCode,
    fullName: item.student.fullName,
    classId: item.student.classId,
    className: item.student.className,
  },
  nurse: {
    userId: item.nurse.userId,
    fullName: item.nurse.fullName,
  },
  diseaseType: item.diseaseType,
  symptoms: item.symptoms,
  diagnosis: item.diagnosis,
  hasPrescription: item.prescriptions.length > 0,
});

export const getExaminationsMockEnvelope = (query = {}) => {
  const page = toPositiveNumber(query.page, 1);
  const pageSize = toPositiveNumber(query.pageSize, 10);

  const studentId = query.studentId ? String(query.studentId).trim().toUpperCase() : '';
  const classId = query.classId ? String(query.classId).trim().toUpperCase() : '';
  const diseaseTypeId = query.diseaseTypeId ? String(query.diseaseTypeId).trim().toUpperCase() : '';
  const fromDate = query.fromDate ? new Date(`${query.fromDate}T00:00:00`) : null;
  const toDate = query.toDate ? new Date(`${query.toDate}T23:59:59`) : null;

  const filtered = mockExaminations
    .filter((item) => {
      if (studentId && item.student.studentId.toUpperCase() !== studentId) return false;
      if (classId && item.student.classId.toUpperCase() !== classId) return false;
      if (diseaseTypeId && String(item.diseaseType?.id || '').toUpperCase() !== diseaseTypeId) return false;

      const visitDate = new Date(item.visitDate);
      if (fromDate && visitDate < fromDate) return false;
      if (toDate && visitDate > toDate) return false;

      return true;
    })
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
    .map(toListItem);

  const totalItems = filtered.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const offset = (page - 1) * pageSize;
  const data = filtered.slice(offset, offset + pageSize);

  return createEnvelope({
    message: 'Mock: Lay danh sach phieu kham thanh cong.',
    data,
    meta: {
      page,
      pageSize,
      totalItems,
      totalPages,
      source: 'mock',
    },
  });
};

export const getExaminationDetailMockEnvelope = (examinationId) => {
  const found = mockExaminations.find((item) => item.id === examinationId);

  if (!found) {
    throwMockApiError(404, 'Khong tim thay phieu kham.', [
      { field: 'id', code: 'EXAMINATION_NOT_FOUND', message: 'Khong ton tai phieu kham voi id da cung cap.' },
    ]);
  }

  return createEnvelope({
    message: 'Mock: Lay chi tiet phieu kham thanh cong.',
    data: {
      ...found,
      student: { ...found.student },
      nurse: { ...found.nurse },
      diseaseType: found.diseaseType ? { ...found.diseaseType } : null,
      prescriptions: found.prescriptions.map((item) => ({ ...item })),
    },
  });
};

export const createExaminationMockEnvelope = (payload = {}) => {
  const studentId = String(payload.studentId || '').trim().toUpperCase();
  const visitDate = payload.visitDate ? new Date(payload.visitDate) : null;
  const symptoms = String(payload.symptoms || '').trim();
  const diagnosis = String(payload.diagnosis || '').trim();
  const treatment = String(payload.treatment || '').trim();

  if (!studentId) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'studentId', code: 'REQUIRED', message: 'studentId bat buoc.' },
    ]);
  }

  if (!visitDate || Number.isNaN(visitDate.getTime())) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'visitDate', code: 'INVALID_DATE', message: 'visitDate khong hop le.' },
    ]);
  }

  if (!symptoms || !diagnosis || !treatment) {
    throwMockApiError(400, 'Du lieu khong hop le.', [
      { field: 'body', code: 'MISSING_REQUIRED_FIELDS', message: 'symptoms, diagnosis, treatment la bat buoc.' },
    ]);
  }

  const studentProfile = studentProfileByStudentId[studentId] || {
    studentId,
    studentCode: studentId,
    fullName: `Hoc sinh ${studentId}`,
    classId: 'CLS001',
    className: '4/2',
    gender: 'UNKNOWN',
  };

  const diseaseTypeId = payload.diseaseTypeId ? String(payload.diseaseTypeId).trim().toUpperCase() : '';

  const prescriptions = Array.isArray(payload.prescriptions)
    ? payload.prescriptions.map((item) => {
      const quantity = Number(item?.quantity || 0);
      if (!item?.medicineId || !Number.isFinite(quantity) || quantity <= 0) {
        throwMockApiError(400, 'Du lieu khong hop le.', [
          { field: 'prescriptions', code: 'INVALID_PRESCRIPTION', message: 'prescriptions khong hop le.' },
        ]);
      }

      const prescriptionId = `VP${String(prescriptionSequence).padStart(3, '0')}`;
      prescriptionSequence += 1;

      return {
        prescriptionId,
        medicineId: String(item.medicineId),
        medicineName: `Medicine ${item.medicineId}`,
        quantity,
        dosage: item.dosage ? String(item.dosage) : null,
        usageInstruction: item.usageInstruction ? String(item.usageInstruction) : null,
      };
    })
    : [];

  const created = {
    id: `VIS${String(examinationSequence).padStart(3, '0')}`,
    visitDate: visitDate.toISOString(),
    student: { ...studentProfile },
    nurse: { ...defaultNurse },
    diseaseType: diseaseTypeId
      ? {
          id: diseaseTypeId,
          name: diseaseNameById[diseaseTypeId] || diseaseTypeId,
        }
      : null,
    symptoms,
    diagnosis,
    treatment,
    note: payload.note ? String(payload.note).trim() : null,
    prescriptions,
    createdAt: new Date().toISOString(),
  };

  examinationSequence += 1;
  mockExaminations = [created, ...mockExaminations];

  return createEnvelope({
    message: 'Mock: Tao phieu kham thanh cong.',
    data: {
      ...created,
      student: { ...created.student },
      nurse: { ...created.nurse },
      diseaseType: created.diseaseType ? { ...created.diseaseType } : null,
      prescriptions: created.prescriptions.map((item) => ({ ...item })),
    },
  });
};
