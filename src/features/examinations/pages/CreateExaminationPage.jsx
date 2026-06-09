import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DATA_MODULES } from '../../../app/config/dataMode';
import AdminAsyncState from '../../../shared/components/core/AsyncState';
import AdminFeedbackToast from '../../../shared/components/core/FeedbackToast';
import { mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import EditableField from '../../../shared/components/form/EditableField';
import { getMedicines } from '../../medicines/services/getMedicines';
import { notifyMedicineInventoryChanged } from '../../medicines/services/medicineInventoryEvents';
import { adaptDiseaseOptionsResponse } from '../adapters/examinationAdapter';
import {
  getNurseStudentDetailApi,
  getNurseStudentHealthHistoryApi,
  getNurseStudentHealthProfileApi,
} from '../../health-profiles/services/healthProfilesApi';
import { MEDICINE_PICKER_PAGE_SIZE } from '../constants/examinationConstants';
import { createExamination } from '../services/createExamination';
import { getDiseaseOptions } from '../services/getDiseaseOptions';

const toDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const dateLabel = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('vi-VN');
};

const formatMedicineUnitLabel = (unit) => {
  if (!unit) return '';
  const normalized = String(unit).toUpperCase();
  const map = {
    VIEN: 'viên',
    GOI: 'gói',
    CHAI: 'chai',
    HOP: 'hộp',
    VI: 'vỉ',
  };

  const resolved = map[normalized] || unit;
  if (!resolved) return '';
  return resolved.charAt(0).toUpperCase() + resolved.slice(1);
};

const defaultFormValues = {
  visitDate: toDateInputValue(),
  diseaseId: '',
  symptoms: '',
  diagnosis: '',
  treatment: '',
  note: '',
};

const defaultContext = {
  detail: null,
  profile: null,
  history: [],
};

const NURSE_MEDICINES_OPTIONS = { moduleKey: DATA_MODULES.NURSE_MEDICINES };

const parseMedicinesEnvelope = (envelope) => {
  const rows = Array.isArray(envelope?.data)
    ? envelope.data
    : Array.isArray(envelope?.data?.items)
      ? envelope.data.items
      : [];

  return rows
    .map((item) => ({
      id: item.id,
      name: item.name || '',
      unit: item.unit || item.unitName || '',
      currentStock: Number(item.currentStock || 0),
      status: item.status || '',
      isLowStock: Boolean(item.isLowStock),
    }))
    .filter((item) => item.status === 'ACTIVE');
};

const normalizePrescriptionItem = (item) => ({
  medicineId: item.medicineId || '',
  quantity: Number(item.quantity || 0),
  dosage: item.dosage?.trim() || null,
  usageInstruction: item.usageInstruction?.trim() || null,
});

const resolveDispensingErrorMessage = (error) => {
  const payload = error?.response?.data;
  const codes = [
    payload?.code,
    ...(Array.isArray(payload?.errors) ? payload.errors.map((item) => item?.code) : []),
  ].filter(Boolean);

  if (codes.includes('INSUFFICIENT_STOCK')) {
    return 'Số lượng thuốc khả dụng không đủ';
  }
  if (codes.includes('MEDICINE_INACTIVE')) {
    return 'Thuốc đã ngừng sử dụng';
  }
  return null;
};

const MedicinePicker = ({
  value,
  options,
  onChange,
  disabledIds = [],
  error,
}) => {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current || containerRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) return options;

    return options.filter((option) => option.name.toLowerCase().includes(term));
  }, [keyword, options]);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Tìm và chọn thuốc"
        className="app-focus-ring app-input h-10 w-full rounded-lg px-3 text-sm"
      />
      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-outline-variant bg-surface shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
          {filteredOptions.length ? (
            <ul className="py-1">
              {filteredOptions.map((option) => {
                const unitLabel = formatMedicineUnitLabel(option.unit);
                const isDisabled = disabledIds.includes(option.id) || option.currentStock <= 0;
                const isSelected = option.id === value;

                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isDisabled) return;
                        onChange(option.id);
                        setKeyword(option.name);
                        setOpen(false);
                      }}
                      className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm transition ${
                        isDisabled
                          ? 'cursor-not-allowed text-on-surface-variant'
                          : 'text-on-surface hover:bg-surface-container-low'
                      } ${isSelected ? 'bg-surface-container-low' : ''}`}
                    >
                      <span className="font-semibold">{option.name || 'Chưa có tên thuốc'}</span>
                      <span className="text-xs text-on-surface-variant">
                        {unitLabel ? `${unitLabel} • ` : ''}Tồn kho: {option.currentStock}
                        {option.currentStock <= 0 ? ' • Hết tồn kho' : ''}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-3 py-3 text-sm text-on-surface-variant">Không tìm thấy thuốc phù hợp.</div>
          )}
        </div>
      ) : null}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </div>
  );
};

const CreateExaminationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentUserId: studentUserIdParam } = useParams();

  const parsedStudentUserId = Number(studentUserIdParam);
  const studentUserId = Number.isFinite(parsedStudentUserId) && parsedStudentUserId > 0
    ? parsedStudentUserId
    : null;

  const [status, setStatus] = useState('loading');
  const [contextError, setContextError] = useState('');
  const [contextData, setContextData] = useState(defaultContext);
  const [reloadToken, setReloadToken] = useState(0);

  const [medicines, setMedicines] = useState([]);
  const [medicineLoadError, setMedicineLoadError] = useState('');

  const [diseaseOptions, setDiseaseOptions] = useState([]);
  const [diseaseLoadError, setDiseaseLoadError] = useState('');
  const [diseaseLoading, setDiseaseLoading] = useState(false);

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [prescriptions, setPrescriptions] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!studentUserId) {
      setStatus('error');
      setContextError('Liên kết tạo phiếu khám không hợp lệ.');
      return;
    }

    let isMounted = true;

    const fetchContext = async () => {
      setStatus('loading');
      setContextError('');
      setMedicineLoadError('');
      setDiseaseLoadError('');
      setDiseaseLoading(true);

      const [detailResult, profileResult, historyResult, medicinesResult, diseasesResult] = await Promise.allSettled([
        getNurseStudentDetailApi(studentUserId),
        getNurseStudentHealthProfileApi(studentUserId),
        getNurseStudentHealthHistoryApi(studentUserId, { page: 1, pageSize: 5 }),
        getMedicines({ page: 1, pageSize: MEDICINE_PICKER_PAGE_SIZE, status: 'ACTIVE' }, NURSE_MEDICINES_OPTIONS),
        getDiseaseOptions(),
      ]);

      if (!isMounted) {
        return;
      }

      const detail = detailResult.status === 'fulfilled' ? detailResult.value?.data : null;
      const profile = profileResult.status === 'fulfilled' ? profileResult.value?.data : null;
      const historyEnvelope = historyResult.status === 'fulfilled' ? historyResult.value : null;
      const historyRows = Array.isArray(historyEnvelope?.data)
        ? historyEnvelope.data
        : Array.isArray(historyEnvelope?.data?.items)
          ? historyEnvelope.data.items
          : [];

      if (!detail || !profile) {
        const messageFromDetail = detailResult.status === 'rejected' ? normalizeApiMessage(detailResult.reason) : '';
        const messageFromProfile = profileResult.status === 'rejected' ? normalizeApiMessage(profileResult.reason) : '';
        setStatus('error');
        setContextError(messageFromDetail || messageFromProfile || 'Không thể tải dữ liệu học sinh để lập phiếu khám.');
        setDiseaseLoading(false);
        return;
      }

      setContextData({
        detail,
        profile,
        history: historyRows,
      });

      if (medicinesResult.status === 'fulfilled') {
        setMedicines(parseMedicinesEnvelope(medicinesResult.value));
      } else {
        setMedicines([]);
        setMedicineLoadError(normalizeApiMessage(medicinesResult.reason));
      }

      if (diseasesResult.status === 'fulfilled') {
        const mapped = adaptDiseaseOptionsResponse(diseasesResult.value);
        const options = Array.isArray(mapped)
          ? mapped
            .map((item) => ({
              id: String(item.id ?? ''),
              name: item.name || '--',
            }))
            .filter((item) => item.id)
          : [];

        setDiseaseOptions(options);
      } else {
        const statusCode = diseasesResult.reason?.response?.status;
        const message = statusCode === 403
          ? 'Tài khoản y tá chưa được cấp quyền xem danh mục loại bệnh.'
          : normalizeApiMessage(diseasesResult.reason);
        setDiseaseOptions([]);
        setDiseaseLoadError(message);
      }

      setDiseaseLoading(false);

      setStatus('success');
    };

    fetchContext();

    return () => {
      isMounted = false;
    };
  }, [reloadToken, studentUserId]);

  const studentRecordIdForSubmit = contextData.profile?.studentId || '';
  const studentCodeForDisplay = contextData.profile?.studentCode || '';

  const healthProfile = contextData.profile?.healthProfile;
  const allergies = Array.isArray(healthProfile?.allergies)
    ? healthProfile.allergies
    : [];
  const hasMedicalWarning =
    allergies.length > 0
    || Boolean(healthProfile?.chronicNote)
    || Boolean(healthProfile?.generalHealthNote);
  const hasAnyProfileData = Boolean(
    healthProfile
    && (
      healthProfile.heightCm != null
      || healthProfile.weightKg != null
      || healthProfile.bloodType
      || allergies.length
      || healthProfile.chronicNote
      || healthProfile.generalHealthNote
    )
  );
  const isProfileIncomplete = !healthProfile || !hasAnyProfileData;

  const medicinesById = useMemo(() => {
    const map = new Map();
    medicines.forEach((item) => map.set(item.id, item));
    return map;
  }, [medicines]);

  const diseaseOptionsById = useMemo(() => {
    const map = new Map();
    diseaseOptions.forEach((item) => map.set(item.id, item));
    return map;
  }, [diseaseOptions]);

  const diseaseSelectOptions = useMemo(() => {
    const base = diseaseOptions.map((item) => ({ value: item.id, label: item.name }));
    return [{ value: '', label: 'Không phân loại' }, ...base];
  }, [diseaseOptions]);

  const selectedMedicineCountMap = useMemo(() => {
    const map = new Map();
    prescriptions.forEach((item) => {
      if (!item?.medicineId) {
        return;
      }

      map.set(item.medicineId, (map.get(item.medicineId) || 0) + 1);
    });
    return map;
  }, [prescriptions]);

  const selectedStudentName = useMemo(() => {
    return contextData.profile?.fullName
      || contextData.detail?.fullName
      || location.state?.selectedStudentName
      || '--';
  }, [contextData.detail?.fullName, contextData.profile?.fullName, location.state?.selectedStudentName]);

  const diseaseTypeFieldError = fieldErrors.diseaseId
    || (diseaseLoadError ? diseaseLoadError : '');

  const validateForm = () => {
    const errors = {};

    if (!studentRecordIdForSubmit) {
      errors.studentId = 'Không xác định được mã hồ sơ học sinh (STDxxx).';
    }

    if (!formValues.visitDate) {
      errors.visitDate = 'Vui lòng chọn ngày khám.';
    }

    if (!formValues.symptoms.trim()) {
      errors.symptoms = 'Triệu chứng là bắt buộc.';
    }

    if (!formValues.diagnosis.trim()) {
      errors.diagnosis = 'Chẩn đoán là bắt buộc.';
    }

    if (!formValues.treatment.trim()) {
      errors.treatment = 'Hướng xử lý là bắt buộc.';
    }

    if (formValues.diseaseId && !diseaseOptionsById.has(formValues.diseaseId)) {
      errors.diseaseId = 'Loại bệnh đã chọn không tồn tại hoặc danh mục chưa được tải lại.';
    }

    prescriptions.forEach((item, index) => {
      if (!item.medicineId) {
        errors[`prescriptions[${index}].medicineId`] = 'Vui lòng chọn thuốc.';
      }

      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        errors[`prescriptions[${index}].quantity`] = 'Số lượng phải lớn hơn 0.';
      }

      const selectedMedicine = medicinesById.get(item.medicineId);
      if (item.medicineId && !selectedMedicine) {
        errors[`prescriptions[${index}].medicineId`] = 'Thuốc không hợp lệ hoặc không còn khả dụng.';
      }

      if (selectedMedicine && selectedMedicine.status !== 'ACTIVE') {
        errors[`prescriptions[${index}].medicineId`] = 'Thuốc đang INACTIVE, không thể cấp phát.';
      }

      if (selectedMedicine && selectedMedicine.currentStock <= 0) {
        errors[`prescriptions[${index}].medicineId`] = 'Thuốc đã hết tồn kho.';
      }

      if (selectedMedicine && Number.isFinite(quantity) && quantity > selectedMedicine.currentStock) {
        errors[`prescriptions[${index}].quantity`] = `Tồn kho không đủ (${selectedMedicine.currentStock}).`;
      }

      if (item.medicineId && (selectedMedicineCountMap.get(item.medicineId) || 0) > 1) {
        errors[`prescriptions[${index}].medicineId`] = 'Thuốc này đã có trong đơn. Vui lòng chỉnh dòng hiện có.';
      }
    });

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    const parsedDiseaseId = Number(formValues.diseaseId);
    const diseaseId = Number.isFinite(parsedDiseaseId) ? parsedDiseaseId : null;

    const payload = {
      studentId: studentRecordIdForSubmit,
      visitDate: `${formValues.visitDate}T00:00:00`,
      diseaseId,
      symptoms: formValues.symptoms.trim(),
      diagnosis: formValues.diagnosis.trim(),
      treatment: formValues.treatment.trim(),
      note: formValues.note.trim() || null,
      prescriptions: prescriptions.length ? prescriptions.map(normalizePrescriptionItem) : [],
    };

    setSubmitting(true);

    try {
      const response = await createExamination(payload);
      const createdId = response?.data?.id;
      if (prescriptions.length) {
        notifyMedicineInventoryChanged({
          medicineIds: prescriptions.map((item) => item.medicineId).filter(Boolean),
        });
      }
      const successMessage = response?.message || 'Tạo phiếu khám thành công.';

      if (createdId) {
        navigate(`/nurse/examinations/${createdId}`, {
          replace: true,
          state: {
            feedback: {
              type: 'success',
              message: successMessage,
            },
          },
        });
      } else {
        navigate('/nurse/examinations', {
          replace: true,
          state: {
            feedback: {
              type: 'success',
              message: successMessage,
            },
          },
        });
      }
    } catch (apiError) {
      const mapped = mapApiFieldErrors(apiError);
      if (mapped.diseaseId || mapped.DiseaseId || mapped.diseaseTypeId || mapped.DiseaseTypeId) {
        mapped.diseaseId = 'Loại bệnh đã chọn không tồn tại hoặc danh mục chưa được tải lại.';
      }
      if (Object.keys(mapped).length) {
        setFieldErrors((prev) => ({ ...prev, ...mapped }));
      }

      const message = resolveDispensingErrorMessage(apiError) || normalizeApiMessage(apiError);
      if (!Object.keys(mapped).length) {
        setSubmitError(message);
      }
      setFeedback({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  const addPrescriptionRow = () => {
    setPrescriptions((prev) => ([
      ...prev,
      {
        medicineId: '',
        quantity: 1,
        dosage: '',
        usageInstruction: '',
      },
    ]));
  };

  const updatePrescriptionRow = (index, patch) => {
    setPrescriptions((prev) => prev.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      return { ...item, ...patch };
    }));
  };

  const removePrescriptionRow = (index) => {
    setPrescriptions((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setFieldErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith('prescriptions[')) {
          delete next[key];
        }
      });
      return next;
    });
  };

  return (
    <div className="space-y-3.5 text-on-surface">
      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        closeAriaLabel="Đóng thông báo"
        closeLabel="Đóng"
        fallbackClassName="border-success/25 bg-success-soft text-success"
        classMap={{
          error: 'border-danger/25 bg-danger-soft text-danger',
          success: 'border-success/25 bg-success-soft text-success',
        }}
      />

      <section className="app-banner-soft rounded-2xl px-4 py-3.5 shadow-[0_1px_4px_rgba(15,23,42,0.03)] sm:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline text-[1.46rem] font-bold leading-tight tracking-[-0.015em] text-on-surface sm:text-[1.62rem]">Tạo phiếu khám</h1>
            <p className="mt-1 text-sm text-on-surface-variant">Ghi nhận tình trạng sức khỏe, chẩn đoán và phương án chăm sóc cho học sinh.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/nurse/examinations')}
            className="app-btn-secondary app-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            Quay lại danh sách
          </button>
        </div>
      </section>

      <AdminAsyncState
        status={status}
        error={contextError}
        onRetry={() => {
          if (!studentUserId) {
            return;
          }
          setReloadToken((current) => current + 1);
        }}
        loadingLabel="Đang tải dữ liệu học sinh..."
        emptyTitle="Không có dữ liệu"
        emptyDescription="Không tìm thấy dữ liệu học sinh để tạo phiếu khám."
        containerClassName="px-0 py-0"
      >
        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-12">
          <aside className="space-y-3.5 xl:col-span-4">
            <section className="app-card-shell rounded-xl p-4">
              <h2 className="text-sm font-bold text-on-surface">Thông tin học sinh</h2>
              <dl className="mt-2 grid grid-cols-1 gap-2 text-sm text-on-surface">
                <div>
                  <dt className="text-xs text-on-surface-variant">Họ tên</dt>
                  <dd className="font-medium text-on-surface">{selectedStudentName || 'Chưa xác định'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">Mã học sinh</dt>
                  <dd className="font-medium text-on-surface">{studentCodeForDisplay || 'Chưa có'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">Mã hồ sơ</dt>
                  <dd className="font-medium text-on-surface">{studentRecordIdForSubmit || 'Chưa có'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">Lớp</dt>
                  <dd className="font-medium text-on-surface">{contextData.profile?.className || contextData.detail?.className || 'Chưa xác định'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">Ngày sinh</dt>
                  <dd className="font-medium text-on-surface">{dateLabel(contextData.detail?.dateOfBirth) || 'Chưa cập nhật'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">Phụ huynh</dt>
                  <dd className="font-medium text-on-surface">{contextData.detail?.guardian || 'Chưa cập nhật'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">Số điện thoại</dt>
                  <dd className="font-medium text-on-surface">{contextData.detail?.phone || 'Chưa cập nhật'}</dd>
                </div>
              </dl>
            </section>

            {hasMedicalWarning ? (
              <section className="rounded-xl border border-danger/30 bg-danger-soft p-4 text-danger">
                <h2 className="text-sm font-bold">Cảnh báo sức khỏe</h2>
                <div className="mt-2 space-y-2 text-sm">
                  {allergies.length ? (
                    <div>
                      <p className="text-xs opacity-85">Dị ứng</p>
                      <p className="font-medium">{allergies.map((item) => item.allergyTypeName).join(', ')}</p>
                    </div>
                  ) : null}
                  {healthProfile?.chronicNote ? (
                    <div>
                      <p className="text-xs opacity-85">Ghi chú bệnh nền</p>
                      <p className="font-medium">{healthProfile.chronicNote}</p>
                    </div>
                  ) : null}
                  {healthProfile?.generalHealthNote ? (
                    <div>
                      <p className="text-xs opacity-85">Lưu ý sức khỏe</p>
                      <p className="font-medium">{healthProfile.generalHealthNote}</p>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : isProfileIncomplete ? (
              <section className="rounded-xl border border-warning/50 bg-warning-soft p-4 text-warning">
                <h2 className="text-sm font-bold">Cảnh báo sức khỏe</h2>
                <p className="mt-1 text-sm">Hồ sơ sức khỏe chưa đầy đủ.</p>
              </section>
            ) : (
              <section className="rounded-xl border border-outline-variant bg-surface p-4 text-on-surface-variant">
                <h2 className="text-sm font-bold text-on-surface">Cảnh báo sức khỏe</h2>
                <p className="mt-1 text-sm">Chưa ghi nhận cảnh báo sức khỏe.</p>
              </section>
            )}

            <section className="app-card-shell rounded-xl p-4">
              <h2 className="text-sm font-bold text-on-surface">Lịch sử khám gần đây</h2>
              {contextData.history.length ? (
                <ul className="mt-2 space-y-2">
                  {contextData.history.slice(0, 4).map((item) => (
                    <li key={item.visitId} className="rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm">
                      <p className="text-xs text-on-surface-variant">{dateLabel(item.visitDate) || 'Chưa xác định'}</p>
                      <p className="font-semibold text-on-surface">{item.diagnosis || 'Chưa có chẩn đoán'}</p>
                      {item.symptoms && item.symptoms.trim() !== item.diagnosis?.trim() ? (
                        <p className="text-xs text-on-surface-variant">{item.symptoms}</p>
                      ) : null}
                      <p className="text-xs text-on-surface-variant">{item.diseaseType?.name || 'Chưa phân loại'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-on-surface-variant">Chưa có dữ liệu lịch sử khám.</p>
              )}
            </section>
          </aside>

          <section className="app-card-shell rounded-xl p-4 xl:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-4 pb-16">
              {fieldErrors.studentId ? (
                <p className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{fieldErrors.studentId}</p>
              ) : null}

              {submitError ? (
                <p className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">{submitError}</p>
              ) : null}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Ngày khám</span>
                  <input
                    type="date"
                    value={formValues.visitDate}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, visitDate: event.target.value }))}
                    className="app-focus-ring app-input h-10 rounded-lg px-3 text-sm"
                  />
                  {fieldErrors.visitDate ? <span className="text-xs text-danger">{fieldErrors.visitDate}</span> : null}
                </label>

                <EditableField
                  label="Loại bệnh (tùy chọn)"
                  type="select"
                  value={formValues.diseaseId}
                  onChange={(value) => setFormValues((prev) => ({ ...prev, diseaseId: value }))}
                  options={diseaseSelectOptions}
                  error={diseaseTypeFieldError}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Triệu chứng lâm sàng *</span>
                  <textarea
                    value={formValues.symptoms}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, symptoms: event.target.value }))}
                    rows={4}
                    className="app-focus-ring app-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Nhập triệu chứng"
                  />
                  {fieldErrors.symptoms ? <span className="text-xs text-danger">{fieldErrors.symptoms}</span> : null}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Chẩn đoán *</span>
                  <textarea
                    value={formValues.diagnosis}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, diagnosis: event.target.value }))}
                    rows={4}
                    className="app-focus-ring app-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Nhập chẩn đoán"
                  />
                  {fieldErrors.diagnosis ? <span className="text-xs text-danger">{fieldErrors.diagnosis}</span> : null}
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Hướng xử lý *</span>
                  <textarea
                    value={formValues.treatment}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, treatment: event.target.value }))}
                    rows={3}
                    className="app-focus-ring app-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Nhập hướng xử lý"
                  />
                  {fieldErrors.treatment ? <span className="text-xs text-danger">{fieldErrors.treatment}</span> : null}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-on-surface-variant">Ghi chú thêm</span>
                  <textarea
                    value={formValues.note}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, note: event.target.value }))}
                    rows={3}
                    className="app-focus-ring app-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </label>
              </div>

              <section className="space-y-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-on-surface">Thuốc cấp cho học sinh</h3>
                  <button
                    type="button"
                    onClick={addPrescriptionRow}
                    className="app-btn-secondary app-focus-ring inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                    Thêm thuốc
                  </button>
                </div>

                {medicineLoadError ? (
                  <p className="rounded-md border border-danger/30 bg-danger-soft px-2.5 py-1.5 text-xs text-danger">Không thể tải danh mục thuốc: {medicineLoadError}</p>
                ) : null}

                {!medicineLoadError && !medicines.length ? (
                  <p className="rounded-md border border-warning/50 bg-warning-soft px-2.5 py-2 text-xs text-warning">Hiện không có thuốc còn tồn kho để cấp phát cho lượt khám này.</p>
                ) : null}

                {prescriptions.length ? (
                  <div className="space-y-2">
                    {prescriptions.map((item, index) => {
                      const selectedMedicine = medicinesById.get(item.medicineId);
                      const unitLabel = formatMedicineUnitLabel(selectedMedicine?.unit);
                      const disabledIds = prescriptions
                        .filter((row, rowIndex) => rowIndex !== index && row.medicineId)
                        .map((row) => row.medicineId);

                      return (
                        <article key={`prescription-${index}`} className="rounded-md border border-outline-variant bg-white p-3">
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                              <div className="md:col-span-10 flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-on-surface-variant">Thuốc *</span>
                                <MedicinePicker
                                  value={item.medicineId}
                                  options={medicines}
                                  onChange={(medicineId) => updatePrescriptionRow(index, { medicineId })}
                                  disabledIds={disabledIds}
                                  error={fieldErrors[`prescriptions[${index}].medicineId`]}
                                />
                                {selectedMedicine ? (
                                  <span className={`text-[11px] ${selectedMedicine.isLowStock ? 'text-warning' : 'text-on-surface-variant'}`}>
                                    Tồn kho còn: {selectedMedicine.currentStock} {unitLabel || selectedMedicine.unit}
                                  </span>
                                ) : null}
                                {selectedMedicine?.isLowStock ? (
                                  <span className="inline-flex w-fit rounded-md border border-warning/50 bg-warning-soft px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                                    Sắp hết thuốc
                                  </span>
                                ) : null}
                              </div>

                              <div className="md:col-span-2 flex flex-col gap-1 md:items-end">
                                <span className="text-[11px] font-semibold text-transparent select-none">Xóa</span>
                                <button
                                  type="button"
                                  onClick={() => removePrescriptionRow(index)}
                                  className="app-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-white text-danger transition hover:bg-danger-soft"
                                  aria-label="Xóa thuốc"
                                >
                                  <span className="material-symbols-outlined text-[17px]">delete</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                              <label className="md:col-span-2 flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-on-surface-variant">Số lượng *</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(event) => updatePrescriptionRow(index, { quantity: event.target.value })}
                                  className="app-focus-ring app-input h-10 rounded-lg px-2.5 text-sm"
                                />
                                {fieldErrors[`prescriptions[${index}].quantity`] ? (
                                  <span className="text-xs text-danger">{fieldErrors[`prescriptions[${index}].quantity`]}</span>
                                ) : null}
                              </label>

                              <label className="md:col-span-4 flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-on-surface-variant">Liều dùng</span>
                                <input
                                  type="text"
                                  value={item.dosage}
                                  onChange={(event) => updatePrescriptionRow(index, { dosage: event.target.value })}
                                  className="app-focus-ring app-input h-10 rounded-lg px-2.5 text-sm"
                                  placeholder="Ví dụ: 1 viên/lần"
                                />
                              </label>

                              <label className="md:col-span-6 flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-on-surface-variant">Hướng dẫn sử dụng</span>
                                <input
                                  type="text"
                                  value={item.usageInstruction}
                                  onChange={(event) => updatePrescriptionRow(index, { usageInstruction: event.target.value })}
                                  className="app-focus-ring app-input h-10 rounded-lg px-2.5 text-sm"
                                  placeholder="Ví dụ: Uống sau ăn"
                                />
                              </label>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-outline-variant bg-white px-3 py-4 text-sm text-on-surface-variant">
                    Chưa có thuốc được thêm. Bạn có thể để trống phần này nếu lượt khám không cần cấp thuốc.
                  </div>
                )}
              </section>

              <div className="sticky bottom-0 -mx-4 border-t border-outline-variant bg-surface-container-lowest px-4 py-3">
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/nurse/examinations')}
                    className="app-btn-secondary app-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
                    disabled={submitting}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || diseaseLoading || status !== 'success' || !studentRecordIdForSubmit}
                    className="app-btn-primary app-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Đang lưu...' : 'Hoàn tất phiếu khám'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </AdminAsyncState>
    </div>
  );
};

export default CreateExaminationPage;
