import { normalizeApiEnvelope } from '../../../shared/api/normalizeResponse';
import { extractRows, extractMeta } from '../../../shared/adapters/envelopeAdapter';
import { formatDateTime } from '../../../shared/utils/dateFormat';

const formatDateOnly = (value) => {
    if (!value) return '--';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString('vi-VN');
};

const mapStudentBrief = (student) => ({
    studentId: student?.studentId || '--',
    studentCode: student?.studentCode || '--',
    fullName: student?.fullName || '--',
    classId: student?.classId || '--',
    className: student?.className || '--',
    gender: student?.gender || null,
});

const mapNurseBrief = (nurse) => ({
    userId: nurse?.userId || '--',
    fullName: nurse?.fullName || '--',
});

const mapDiseaseType = (diseaseType) => {
    if (!diseaseType) return null;

    return {
        id: diseaseType.id || '--',
        name: diseaseType.name || '--',
    };
};

const mapPrescription = (prescription) => ({
    prescriptionId: prescription?.prescriptionId || '--',
    medicineId: prescription?.medicineId || '--',
    medicineName: prescription?.medicineName || '--',
    quantity: Number(prescription?.quantity || 0),
    dosage: prescription?.dosage || '--',
    usageInstruction: prescription?.usageInstruction || '--',
});

export const adaptExaminationListResponse = (payload) => {
    const envelope = normalizeApiEnvelope(payload);
    const rows = extractRows(envelope);
    const meta = extractMeta(envelope);

    return {
        rows: rows.map((item) => ({
            id: item.id || '--',
            visitDate: item.visitDate || null,
            visitDateLabel: formatDateOnly(item.visitDate),
            student: mapStudentBrief(item.student),
            studentName: item.student?.fullName || '--',
            studentCode: item.student?.studentCode || '--',
            studentRecordId: item.student?.studentId || '--',
            className: item.student?.className || '--',
            nurse: mapNurseBrief(item.nurse),
            diseaseType: mapDiseaseType(item.diseaseType),
            diseaseTypeName: item.diseaseType?.name || '--',
            symptoms: item.symptoms || '--',
            diagnosis: item.diagnosis || '--',
            hasPrescription: Boolean(item.hasPrescription),
        })),
        page: meta.page,
        pageSize: meta.pageSize,
        totalItems: meta.totalItems,
        totalPages: meta.totalPages,
    };
};

export const adaptExaminationDetailResponse = (payload) => {
    const envelope = normalizeApiEnvelope(payload);
    const item = envelope?.data;

    if (!item) {
        return null;
    }

    return {
        id: item.id || '--',
        visitDate: item.visitDate || null,
        visitDateLabel: formatDateOnly(item.visitDate),
        visitDateTimeLabel: formatDateTime(item.visitDate),
        student: mapStudentBrief(item.student),
        nurse: mapNurseBrief(item.nurse),
        diseaseType: mapDiseaseType(item.diseaseType),
        symptoms: item.symptoms || '--',
        diagnosis: item.diagnosis || '--',
        treatment: item.treatment || '--',
        note: item.note || '',
        prescriptions: Array.isArray(item.prescriptions)
            ? item.prescriptions.map(mapPrescription)
            : [],
        hasPrescription: Array.isArray(item.prescriptions) && item.prescriptions.length > 0,
        createdAt: item.createdAt || null,
        createdAtLabel: formatDateTime(item.createdAt),
    };
};

export const adaptCreateExaminationResponse = (payload) => {
    const envelope = normalizeApiEnvelope(payload);
    return envelope?.data || null;
};

export const adaptDiseaseOptionsResponse = (payload) => {
    const envelope = normalizeApiEnvelope(payload);
    const rows = extractRows(envelope);

    return rows.map((item) => ({
        id: item?.id ?? null,
        name: item?.name || '--',
        description: item?.description || '',
    }));
};
