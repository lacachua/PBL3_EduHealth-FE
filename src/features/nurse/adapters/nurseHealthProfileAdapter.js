import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import {
  adaptStudentDetailResponse,
  adaptStudentHealthProfileResponse,
} from '../../students/adapters/studentManagementAdapter';
import {
  getNurseHealthProfileSupplementaryMock,
  NURSE_HEALTH_CLASS_LABEL_MAP,
} from '../mocks/nurseHealthProfileDetailMock';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const round1 = (value) => {
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 10) / 10;
};

const formatDate = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('vi-VN');
};

const calculateAgeLabel = (value) => {
  if (!value) return '--';
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return '--';

  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  const dayDiff = now.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  if (age < 0) {
    return '--';
  }

  return `${age} tuổi`;
};

const normalizeClassName = (classId, className) => {
  return NURSE_HEALTH_CLASS_LABEL_MAP[classId]
    || NURSE_HEALTH_CLASS_LABEL_MAP[className]
    || className
    || '--';
};

const parseAllergyList = (profile, rawEnvelopeData) => {
  const source = rawEnvelopeData?.healthProfile?.allergies;
  if (Array.isArray(source) && source.length) {
    return source
      .map((item) => ({
        id: item.id || '',
        allergyTypeId: item.allergyTypeId || '',
        label: item.allergyTypeName || '',
        note: item.note || '',
      }))
      .filter((item) => item.label);
  }

  const fallback = String(profile?.allergies || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return fallback.map((label, index) => ({
    id: `fallback-${index + 1}`,
    allergyTypeId: '',
    label,
    note: '',
  }));
};

export const adaptNurseHealthHistoryResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (envelope?.success === false) {
    return {
      items: [],
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 1,
    };
  }

  const source = Array.isArray(envelope.data)
    ? envelope.data
    : Array.isArray(envelope.data?.items)
      ? envelope.data.items
      : [];

  const items = source.map((item) => ({
    id: item.visitId || item.id || '',
    visitDate: item.visitDate || null,
    visitDateLabel: formatDate(item.visitDate),
    nurseName: item.nurse?.fullName || '--',
    diseaseName: item.diseaseType?.name || 'Khong xac dinh',
    symptoms: item.symptoms || '--',
    diagnosis: item.diagnosis || '--',
    treatment: item.treatment || '--',
    note: item.note || '',
    prescriptions: Array.isArray(item.prescriptions)
      ? item.prescriptions.map((prescription) => ({
        id: prescription.prescriptionId || '',
        medicineId: prescription.medicineId || '',
        medicineName: prescription.medicineName || '--',
        quantity: Number(prescription.quantity || 0),
        usageInstruction: prescription.usageInstruction || prescription.dosage || '--',
      }))
      : [],
  }));

  return {
    items,
    page: Number(envelope.meta?.page || 1),
    pageSize: Number(envelope.meta?.pageSize || 10),
    totalItems: Number(envelope.meta?.totalItems || items.length),
    totalPages: Number(envelope.meta?.totalPages || 1),
  };
};

export const adaptNurseExaminationHistoryResponse = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);

  if (envelope?.success === false) {
    return [];
  }

  const source = Array.isArray(envelope.data)
    ? envelope.data
    : Array.isArray(envelope.data?.items)
      ? envelope.data.items
      : [];

  return source.map((item) => ({
    id: item.id || '',
    visitDate: item.visitDate || null,
    visitDateLabel: formatDate(item.visitDate),
    nurseName: item.nurse?.fullName || '--',
    diseaseName: item.diseaseType?.name || 'Khong xac dinh',
    symptoms: item.symptoms || '--',
    diagnosis: item.diagnosis || '--',
    hasPrescription: Boolean(item.hasPrescription),
  }));
};

const deriveMedicationHistory = (healthHistoryItems = []) => {
  const records = [];

  healthHistoryItems.forEach((item) => {
    item.prescriptions.forEach((prescription) => {
      records.push({
        id: `${item.id}-${prescription.id || prescription.medicineId}`,
        visitDateLabel: item.visitDateLabel,
        medicineName: prescription.medicineName,
        quantity: prescription.quantity,
        usageInstruction: prescription.usageInstruction,
        sourceVisitId: item.id,
      });
    });
  });

  return records;
};

const deriveHealthAlerts = ({ profile, detail, allergyItems }) => {
  const alerts = [];

  if (allergyItems.length) {
    alerts.push({
      key: 'allergy',
      title: 'Dị ứng',
      description: allergyItems.map((item) => item.label).join(', '),
      tone: 'danger',
      variant: 'allergy',
      icon: 'allergy',
    });
  }

  if (profile?.eyeStatus) {
    alerts.push({
      key: 'eye',
      title: 'Tình trạng mắt',
      description: profile.eyeStatus,
      tone: 'info',
      variant: 'vision',
      icon: 'visibility',
    });
  }

  if (profile?.chronicNote) {
    alerts.push({
      key: 'chronic',
      title: 'Bệnh nền',
      description: profile.chronicNote,
      tone: 'warning',
      variant: 'chronic',
      icon: 'monitor_heart',
    });
  }

  if (profile?.generalHealthNote || detail?.medicalHistoryNotes) {
    alerts.push({
      key: 'nutrition',
      title: 'Lưu ý sức khỏe',
      description: profile?.generalHealthNote || detail?.medicalHistoryNotes || '',
      tone: 'warning',
      variant: 'nutrition',
      icon: 'nutrition',
    });
  }

  return alerts;
};

const deriveGrowthIndicators = ({ heightCm, weightKg, fallbackGrowth }) => {
  const h = toNumber(heightCm);
  const w = toNumber(weightKg);
  const bmi = h && w ? round1(w / ((h / 100) ** 2)) : null;

  return {
    bmi,
    bmiLabel: bmi === null
      ? 'Chưa có dữ liệu'
      : bmi < 14
        ? 'Cần theo dõi dinh dưỡng'
        : bmi <= 19
          ? 'Bình thường'
          : 'Cần giám sát cân nặng',
    weightForAgePercent: fallbackGrowth?.weightForAgePercent ?? 0,
    heightForAgePercent: fallbackGrowth?.heightForAgePercent ?? 0,
    note: fallbackGrowth?.note || 'Dữ liệu tham chiếu theo lứa tuổi học sinh tiểu học.',
  };
};

export const buildNurseHealthProfileViewModel = ({
  studentId,
  detailEnvelope,
  profileEnvelope,
  healthHistoryEnvelope,
  examinationEnvelope,
}) => {
  const detail = adaptStudentDetailResponse(detailEnvelope);
  const profile = adaptStudentHealthProfileResponse(profileEnvelope);
  const healthHistory = adaptNurseHealthHistoryResponse(healthHistoryEnvelope);
  const examinationHistory = adaptNurseExaminationHistoryResponse(examinationEnvelope);

  const normalizedDetail = normalizeApiEnvelope(detailEnvelope)?.data || {};
  const rawProfileEnvelope = normalizeApiEnvelope(profileEnvelope);
  const supplementary = getNurseHealthProfileSupplementaryMock(studentId);
  const allergyItems = parseAllergyList(profile, rawProfileEnvelope.data);
  const medicationHistory = deriveMedicationHistory(healthHistory.items);
  const growth = deriveGrowthIndicators({
    heightCm: profile?.heightCm,
    weightKg: profile?.weightKg,
    fallbackGrowth: supplementary.growthIndicators,
  });

  const classNameDisplay = normalizeClassName(detail?.classId, detail?.className || rawProfileEnvelope?.data?.className);

  const header = {
    studentId: detail?.studentId || detail?.apiId || detail?.id || studentId,
    studentCode: rawProfileEnvelope?.data?.studentCode || detail?.studentCode || '--',
    fullName: rawProfileEnvelope?.data?.fullName || detail?.fullName || '--',
    className: classNameDisplay,
    dateOfBirthLabel: formatDate(detail?.dateOfBirth),
    ageLabel: calculateAgeLabel(detail?.dateOfBirth),
    genderLabel: detail?.genderLabel || '--',
    statusLabel: detail?.statusLabel || 'Hoạt động',
    statusTone: detail?.statusTone || 'success',
    phone: detail?.phoneNumber || detail?.phone || '--',
    email: detail?.email || '--',
    guardian: detail?.guardian || detail?.parentName || '--',
    avatarUrl:
      normalizedDetail.avatarUrl ||
      normalizedDetail.avatar ||
      normalizedDetail.profileImageUrl ||
      normalizedDetail.photoUrl ||
      '',
  };

  const alerts = deriveHealthAlerts({ profile, detail, allergyItems });

  const metrics = {
    height: toNumber(profile?.heightCm),
    weight: toNumber(profile?.weightKg),
    bmi: growth.bmi,
    bloodType: profile?.bloodType || '--',
    note: growth.bmiLabel,
  };

  const normalizedGuardianName = String(header.guardian || '').trim();
  const normalizedGuardianPhone = String(header.phone || '').trim();

  const emergencyContacts = (normalizedGuardianName && normalizedGuardianName !== '--')
    || (normalizedGuardianPhone && normalizedGuardianPhone !== '--')
    ? [
      {
        id: `guardian-${header.studentId || 'default'}`,
        relation: 'Người giám hộ',
        fullName: normalizedGuardianName && normalizedGuardianName !== '--' ? normalizedGuardianName : '--',
        phone: normalizedGuardianPhone && normalizedGuardianPhone !== '--' ? normalizedGuardianPhone : '--',
        primary: true,
      },
    ]
    : [];

  return {
    header,
    profile,
    metrics,
    alerts,
    allergyItems,
    healthHistory,
    examinationHistory,
    medicationHistory,
    vaccinations: supplementary.vaccinations,
    emergencyContacts,
    growth,
  };
};

const normalizeNullableText = (value) => {
  const normalized = String(value || '').trim();
  return normalized ? normalized : null;
};

const normalizeNullableNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const buildNurseHealthProfileUpdatePayload = (values = {}) => {
  return {
    heightCm: normalizeNullableNumber(values.heightCm),
    weightKg: normalizeNullableNumber(values.weightKg),
    bloodType: normalizeNullableText(values.bloodType),
    eyeStatus: normalizeNullableText(values.eyeStatus),
    chronicNote: normalizeNullableText(values.chronicNote),
    generalHealthNote: normalizeNullableText(values.generalHealthNote),
  };
};
