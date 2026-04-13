import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import {
  CAMPAIGN_STATUS_META,
  TARGET_TYPE_META,
  VACCINATION_STATUS_META,
} from '../constants/vaccinationConstants';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeCampaignDisplayName = (value, fallbackId = '') => {
  const raw = String(value || '').trim();
  if (!raw) {
    return fallbackId ? `Đợt tiêm ${fallbackId}` : '--';
  }

  // Keep UI wording friendly when legacy/migration names leak into payload.
  if (/legacy\s+campaign|^campaign\b/i.test(raw)) {
    return fallbackId ? `Đợt tiêm ${fallbackId}` : 'Đợt tiêm cũ';
  }

  return raw;
};

const sanitizeCampaignNote = (value) => {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }

  if (/auto-?created|migration|legacy student vaccinations|internal|seed data|backfill/i.test(raw)) {
    return '';
  }

  return raw;
};

const toDateLabel = (value) => {
  if (!value) {
    return '--';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString('vi-VN');
};

const toIsoDate = (value) => {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().slice(0, 10);
};

const resolveCampaignStatus = (value) => {
  const key = String(value || '').toUpperCase();
  return CAMPAIGN_STATUS_META[key] || CAMPAIGN_STATUS_META.UNKNOWN;
};

const resolveStudentVaccinationStatus = (value) => {
  const key = String(value || '').toUpperCase();
  return VACCINATION_STATUS_META[key] || VACCINATION_STATUS_META.UNKNOWN;
};

const resolveTargetTypeLabel = (value) => {
  const key = String(value || '').toUpperCase();
  return TARGET_TYPE_META[key] || 'Không xác định';
};

const toCampaignStatistics = (statistics = {}) => {
  const totalStudents = toNumber(statistics.totalStudents, 0);
  const doneCount = toNumber(statistics.doneCount, 0);

  return {
    totalStudents,
    doneCount,
    pendingCount: toNumber(statistics.pendingCount, 0),
    postponedCount: toNumber(statistics.postponedCount, 0),
    contraindicatedCount: toNumber(statistics.contraindicatedCount, 0),
    absentCount: toNumber(statistics.absentCount, 0),
    progressPercent: totalStudents > 0 ? Math.round((doneCount / totalStudents) * 100) : 0,
  };
};

const toPaginationMeta = (meta = {}, fallbackSize = 10, fallbackTotalItems = 0) => {
  const totalItems = toNumber(meta?.totalItems, fallbackTotalItems);
  const pageSize = toNumber(meta?.pageSize, fallbackSize);

  return {
    page: Math.max(1, toNumber(meta?.page, 1)),
    pageSize: Math.max(1, pageSize),
    totalItems: Math.max(0, totalItems),
    totalPages: Math.max(0, toNumber(meta?.totalPages, totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0)),
  };
};

export const mapCampaignListEnvelope = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  const rows = Array.isArray(envelope?.data) ? envelope.data : [];

  const mappedRows = rows.map((item) => {
    const statistics = toCampaignStatistics(item?.statistics || {});
    const statusMeta = resolveCampaignStatus(item?.status);

    return {
      id: item?.id || '--',
      name: normalizeCampaignDisplayName(item?.name, item?.id),
      vaccineName: item?.vaccineName || '--',
      doseNumber: toNumber(item?.doseNumber, 0),
      scheduledDate: item?.scheduledDate || null,
      scheduledDateLabel: toDateLabel(item?.scheduledDate),
      targetType: String(item?.targetType || '').toUpperCase(),
      targetTypeLabel: resolveTargetTypeLabel(item?.targetType),
      status: String(item?.status || '').toUpperCase(),
      statusLabel: statusMeta.label,
      statusBadgeClassName: statusMeta.badgeClassName,
      statistics,
    };
  });

  return {
    rows: mappedRows,
    ...toPaginationMeta(envelope?.meta, 10, mappedRows.length),
    message: envelope?.message || '',
  };
};

export const mapCampaignDetailEnvelope = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  const item = envelope?.data && typeof envelope.data === 'object' ? envelope.data : null;
  if (!item) {
    return null;
  }

  const statusMeta = resolveCampaignStatus(item.status);

  return {
    id: item.id || '--',
    name: normalizeCampaignDisplayName(item.name, item.id),
    vaccineName: item.vaccineName || '--',
    doseNumber: toNumber(item.doseNumber, 0),
    scheduledDate: item.scheduledDate || null,
    scheduledDateLabel: toDateLabel(item.scheduledDate),
    targetType: String(item.targetType || '').toUpperCase(),
    targetTypeLabel: resolveTargetTypeLabel(item.targetType),
    targetClassIds: Array.isArray(item.targetClassIds) ? item.targetClassIds : [],
    note: sanitizeCampaignNote(item.note),
    createdAt: item.createdAt || null,
    createdAtLabel: toDateLabel(item.createdAt),
    status: String(item.status || '').toUpperCase(),
    statusLabel: statusMeta.label,
    statusBadgeClassName: statusMeta.badgeClassName,
    statistics: toCampaignStatistics(item.statistics || {}),
  };
};

const mapStudentBrief = (student) => ({
  userId: student?.userId || null,
  studentId: student?.studentId || '--',
  studentCode: student?.studentCode || '--',
  fullName: student?.fullName || '--',
  classId: student?.classId || '--',
  className: student?.className || '--',
});

export const mapCampaignStudentsEnvelope = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  const rows = Array.isArray(envelope?.data) ? envelope.data : [];

  const mappedRows = rows.map((item) => {
    const statusMeta = resolveStudentVaccinationStatus(item?.status);

    return {
      studentVaccinationId: item?.studentVaccinationId || '--',
      student: mapStudentBrief(item?.student),
      status: String(item?.status || '').toUpperCase(),
      statusLabel: statusMeta.label,
      statusBadgeClassName: statusMeta.badgeClassName,
      vaccinatedAt: item?.vaccinatedAt || null,
      vaccinatedAtLabel: toDateLabel(item?.vaccinatedAt),
      vaccinatedAtIso: toIsoDate(item?.vaccinatedAt),
      lotNumber: item?.lotNumber || '',
      note: item?.note || '',
    };
  });

  return {
    rows: mappedRows,
    ...toPaginationMeta(envelope?.meta, 10, mappedRows.length),
    message: envelope?.message || '',
  };
};

export const mapPendingVaccinationsEnvelope = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  const rows = Array.isArray(envelope?.data) ? envelope.data : [];

  const mappedRows = rows.map((item) => {
    const statusMeta = resolveStudentVaccinationStatus(item?.status);

    return {
      studentVaccinationId: item?.studentVaccinationId || '--',
      campaignId: item?.campaignId || '--',
      campaignName: normalizeCampaignDisplayName(item?.campaignName, item?.campaignId),
      student: mapStudentBrief(item?.student),
      status: String(item?.status || '').toUpperCase(),
      statusLabel: statusMeta.label,
      statusBadgeClassName: statusMeta.badgeClassName,
      scheduledDate: item?.scheduledDate || null,
      scheduledDateLabel: toDateLabel(item?.scheduledDate),
      vaccinatedAt: null,
      vaccinatedAtLabel: '--',
      vaccinatedAtIso: '',
      lotNumber: '',
      note: '',
    };
  });

  return {
    rows: mappedRows,
    ...toPaginationMeta(envelope?.meta, 10, mappedRows.length),
    message: envelope?.message || '',
  };
};

export const mapStudentVaccinationHistoryEnvelope = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  const rows = Array.isArray(envelope?.data) ? envelope.data : [];

  return rows.map((item) => {
    const statusMeta = resolveStudentVaccinationStatus(item?.status);

    return {
      studentVaccinationId: item?.studentVaccinationId || '--',
      campaignId: item?.campaignId || '--',
      campaignName: normalizeCampaignDisplayName(item?.campaignName, item?.campaignId),
      vaccineName: item?.vaccineName || '--',
      doseNumber: toNumber(item?.doseNumber, 0),
      scheduledDate: item?.scheduledDate || null,
      scheduledDateLabel: toDateLabel(item?.scheduledDate),
      status: String(item?.status || '').toUpperCase(),
      statusLabel: statusMeta.label,
      statusBadgeClassName: statusMeta.badgeClassName,
      vaccinatedAt: item?.vaccinatedAt || null,
      vaccinatedAtLabel: toDateLabel(item?.vaccinatedAt),
      lotNumber: item?.lotNumber || '',
      note: item?.note || '',
    };
  });
};

export const mapCreateCampaignResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  return envelope?.data || null;
};

export const mapUpdateStudentVaccinationResponse = (payload) => {
  const envelope = normalizeApiEnvelope(payload);
  return envelope?.data || null;
};
