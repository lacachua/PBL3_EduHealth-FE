import {
    VACCINATION_CAMPAIGN_PAGE_SIZE,
    VACCINATION_PENDING_PAGE_SIZE,
    VACCINATION_STUDENT_PAGE_SIZE,
} from '../constants/vaccinationConstants';

const toPositiveInt = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const normalizeText = (value) => String(value || '').trim();

export const buildCampaignListQuery = (query = {}) => {
    const normalizedKeyword = normalizeText(query.keyword);

    return {
        page: toPositiveInt(query.page, 1),
        pageSize: toPositiveInt(query.pageSize, VACCINATION_CAMPAIGN_PAGE_SIZE),
        ...(normalizedKeyword ? { keyword: normalizedKeyword } : {}),
        ...(query.status && query.status !== 'all' ? { status: String(query.status).trim().toUpperCase() } : {}),
    };
};

export const buildCampaignStudentsQuery = (query = {}) => {
    const normalizedKeyword = normalizeText(query.keyword);

    return {
        page: toPositiveInt(query.page, 1),
        pageSize: toPositiveInt(query.pageSize, VACCINATION_STUDENT_PAGE_SIZE),
        ...(normalizedKeyword ? { keyword: normalizedKeyword } : {}),
        ...(query.status && query.status !== 'all' ? { status: String(query.status).trim().toUpperCase() } : {}),
    };
};

export const buildPendingQuery = (query = {}) => {
    const normalizedCampaignId = normalizeText(query.campaignId);
    const normalizedClassId = normalizeText(query.classId);

    return {
        page: toPositiveInt(query.page, 1),
        pageSize: toPositiveInt(query.pageSize, VACCINATION_PENDING_PAGE_SIZE),
        ...(normalizedCampaignId ? { campaignId: normalizedCampaignId } : {}),
        ...(normalizedClassId ? { classId: normalizedClassId } : {}),
    };
};

export const buildCreateCampaignPayload = (values = {}) => {
    const targetType = String(values.targetType || 'CLASS').toUpperCase();
    const targetClassIds = Array.isArray(values.targetClassIds)
        ? values.targetClassIds.map((item) => String(item || '').trim()).filter(Boolean)
        : [];
    const targetStudentIds = Array.isArray(values.targetStudentIds)
        ? values.targetStudentIds
            .map((item) => Number(item))
            .filter((item) => Number.isInteger(item) && item > 0)
        : [];

    const payload = {
        name: normalizeText(values.name),
        vaccineName: normalizeText(values.vaccineName),
        doseNumber: toPositiveInt(values.doseNumber, 0),
        scheduledDate: values.scheduledDate || null,
        targetType,
        ...(normalizeText(values.note) ? { note: normalizeText(values.note) } : {}),
    };

    if (targetType === 'CLASS') {
        payload.targetClassIds = targetClassIds;
    }

    if (targetType === 'STUDENT') {
        payload.targetStudentIds = targetStudentIds;
    }

    return payload;
};

export const buildUpdateStudentVaccinationPayload = (values = {}) => {
    const payload = {
        status: String(values.status || '').toUpperCase(),
        vaccinatedAt: values.vaccinatedAt || null,
        lotNumber: normalizeText(values.lotNumber) || null,
        note: normalizeText(values.note) || null,
    };

    if (payload.status !== 'DONE') {
        payload.vaccinatedAt = null;
        payload.lotNumber = null;
    }

    return payload;
};
