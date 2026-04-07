import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminAsyncState from '../../../shared/components/admin/AdminAsyncState';
import AdminFeedbackToast from '../../../shared/components/admin/AdminFeedbackToast';
import { mapApiFieldErrors, normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { getMedicines } from '../../medicines/services/getMedicines';
import { getStudentDetail } from '../../students/services/getStudentDetail';
import { getStudentHealthHistory } from '../../students/services/getStudentHealthHistory';
import { getStudentHealthProfile } from '../../students/services/getStudentHealthProfile';
import { MEDICINE_PICKER_PAGE_SIZE } from '../schemas/examinationsSchema';
import { createExamination } from '../services/createExamination';
import '../styles/examinationUi.css';

const toDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const dateLabel = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('vi-VN');
};

const defaultFormValues = {
  visitDate: toDateInputValue(),
  diseaseTypeId: '',
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

const parseMedicinesEnvelope = (envelope) => {
  const rows = Array.isArray(envelope?.data)
    ? envelope.data
    : Array.isArray(envelope?.data?.items)
      ? envelope.data.items
      : [];

  return rows
    .map((item) => ({
      id: item.id,
      name: item.name || '--',
      currentStock: Number(item.currentStock || 0),
      status: item.status || '',
      isLowStock: Boolean(item.isLowStock),
    }))
    .filter((item) => item.status === 'ACTIVE' && item.currentStock > 0);
};

const normalizePrescriptionItem = (item) => ({
  medicineId: item.medicineId || '',
  quantity: Number(item.quantity || 0),
  dosage: item.dosage?.trim() || null,
  usageInstruction: item.usageInstruction?.trim() || null,
});

const CreateExaminationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentId: studentUserIdParam } = useParams();

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

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [prescriptions, setPrescriptions] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!studentUserId) {
      setStatus('error');
      setContextError('Mã học sinh trên URL không hợp lệ.');
      return;
    }

    let isMounted = true;

    const fetchContext = async () => {
      setStatus('loading');
      setContextError('');
      setMedicineLoadError('');

      const [detailResult, profileResult, historyResult, medicinesResult] = await Promise.allSettled([
        getStudentDetail(studentUserId),
        getStudentHealthProfile(studentUserId),
        getStudentHealthHistory(studentUserId, { page: 1, pageSize: 5 }),
        getMedicines({ page: 1, pageSize: MEDICINE_PICKER_PAGE_SIZE, status: 'ACTIVE' }),
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

      setStatus('success');
    };

    fetchContext();

    return () => {
      isMounted = false;
    };
  }, [reloadToken, studentUserId]);

  const studentIdForSubmit = contextData.profile?.studentId || '';

  const medicinesById = useMemo(() => {
    const map = new Map();
    medicines.forEach((item) => map.set(item.id, item));
    return map;
  }, [medicines]);

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

  const validateForm = () => {
    const errors = {};

    if (!studentIdForSubmit) {
      errors.studentId = 'Không xác định được studentId chuẩn của BE (STDxxx).';
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

    const payload = {
      studentId: studentIdForSubmit,
      visitDate: `${formValues.visitDate}T00:00:00`,
      diseaseTypeId: formValues.diseaseTypeId.trim() || null,
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
      if (Object.keys(mapped).length) {
        setFieldErrors((prev) => ({ ...prev, ...mapped }));
      }

      const message = normalizeApiMessage(apiError);
      setSubmitError(message);
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
    <div className="exam-module exam-page-bg space-y-3.5 rounded-2xl p-1.5 md:p-2">
      <AdminFeedbackToast
        feedback={feedback}
        onClose={() => setFeedback(null)}
        closeAriaLabel="Đóng thông báo"
        closeLabel="Đóng"
        fallbackClassName="border-[#15803D]/25 bg-[#DCFCE7] text-[#166534]"
        classMap={{
          error: 'border-[#DC2626]/25 bg-[#FEE2E2] text-[#B91C1C]',
          success: 'border-[#15803D]/25 bg-[#DCFCE7] text-[#166534]',
        }}
      />

      <section className="exam-banner rounded-2xl px-4 py-3.5 sm:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline text-[1.46rem] font-bold leading-tight tracking-[-0.015em] text-[#163126] sm:text-[1.62rem]">Tạo phiếu khám</h1>
            <p className="mt-1 text-sm text-[#5F746B]">Ghi nhận tình trạng sức khỏe, chẩn đoán và phương án chăm sóc cho học sinh.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/nurse/examinations')}
            className="exam-btn-secondary nurse-focus-ring inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
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
            <section className="exam-card rounded-xl p-4">
              <h2 className="text-sm font-bold text-[#163126]">Thông tin học sinh</h2>
              <dl className="mt-2 grid grid-cols-1 gap-2 text-sm text-[#334155]">
                <div>
                  <dt className="text-xs text-[#5F746B]">Họ tên</dt>
                  <dd className="font-medium text-[#163126]">{selectedStudentName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5F746B]">Mã học sinh</dt>
                  <dd className="font-medium text-[#163126]">{studentIdForSubmit || '--'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5F746B]">Mã hồ sơ</dt>
                  <dd className="font-medium text-[#163126]">{contextData.profile?.studentCode || '--'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5F746B]">Lớp</dt>
                  <dd className="font-medium text-[#163126]">{contextData.profile?.className || contextData.detail?.className || '--'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5F746B]">Ngày sinh</dt>
                  <dd className="font-medium text-[#163126]">{dateLabel(contextData.detail?.dateOfBirth)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5F746B]">Phụ huynh</dt>
                  <dd className="font-medium text-[#163126]">{contextData.detail?.guardian || '--'}</dd>
                </div>
              </dl>
            </section>

            <section className="exam-error rounded-xl p-4">
              <h2 className="text-sm font-bold">Cảnh báo dị ứng và lưu ý sức khỏe</h2>
              <div className="mt-2 space-y-2 text-sm">
                <div>
                  <p className="text-xs opacity-85">Nhóm máu</p>
                  <p className="font-medium">{contextData.profile?.healthProfile?.bloodType || '--'}</p>
                </div>
                <div>
                  <p className="text-xs opacity-85">Dị ứng</p>
                  <p className="font-medium">
                    {Array.isArray(contextData.profile?.healthProfile?.allergies) && contextData.profile.healthProfile.allergies.length
                      ? contextData.profile.healthProfile.allergies.map((item) => item.allergyTypeName).join(', ')
                      : '--'}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-85">Ghi chú bệnh nền</p>
                  <p className="font-medium">{contextData.profile?.healthProfile?.chronicNote || '--'}</p>
                </div>
              </div>
            </section>

            <section className="exam-card rounded-xl p-4">
              <h2 className="text-sm font-bold text-[#163126]">Lịch sử khám gần đây</h2>
              {contextData.history.length ? (
                <ul className="mt-2 space-y-2">
                  {contextData.history.slice(0, 4).map((item) => (
                    <li key={item.visitId} className="exam-section-subtle rounded-md px-3 py-2 text-sm">
                      <p className="text-xs text-[#5F746B]">{dateLabel(item.visitDate)}</p>
                      <p className="font-semibold text-[#163126]">{item.diagnosis || 'Chưa có chẩn đoán'}</p>
                      <p className="text-xs text-[#5F746B]">{item.diseaseType?.name || 'Không có loại bệnh'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-[#5F746B]">Chưa có dữ liệu lịch sử khám.</p>
              )}
            </section>
          </aside>

          <section className="exam-card rounded-xl p-4 xl:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {fieldErrors.studentId ? (
                <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">{fieldErrors.studentId}</p>
              ) : null}

              {submitError ? (
                <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">{submitError}</p>
              ) : null}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#5F746B]">Ngày khám</span>
                  <input
                    type="date"
                    value={formValues.visitDate}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, visitDate: event.target.value }))}
                    className="exam-input nurse-focus-ring h-10 rounded-lg px-3 text-sm"
                  />
                  {fieldErrors.visitDate ? <span className="text-xs text-[#B91C1C]">{fieldErrors.visitDate}</span> : null}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#5F746B]">Mã nhóm bệnh (tùy chọn)</span>
                  <input
                    type="text"
                    value={formValues.diseaseTypeId}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, diseaseTypeId: event.target.value }))}
                    placeholder="Ví dụ: DIS001"
                    className="exam-input nurse-focus-ring h-10 rounded-lg px-3 text-sm"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#5F746B]">Triệu chứng lâm sàng *</span>
                  <textarea
                    value={formValues.symptoms}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, symptoms: event.target.value }))}
                    rows={4}
                    className="exam-input nurse-focus-ring rounded-lg px-3 py-2 text-sm"
                    placeholder="Nhập triệu chứng"
                  />
                  {fieldErrors.symptoms ? <span className="text-xs text-[#B91C1C]">{fieldErrors.symptoms}</span> : null}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#5F746B]">Chẩn đoán *</span>
                  <textarea
                    value={formValues.diagnosis}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, diagnosis: event.target.value }))}
                    rows={4}
                    className="exam-input nurse-focus-ring rounded-lg px-3 py-2 text-sm"
                    placeholder="Nhập chẩn đoán"
                  />
                  {fieldErrors.diagnosis ? <span className="text-xs text-[#B91C1C]">{fieldErrors.diagnosis}</span> : null}
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#5F746B]">Hướng xử lý *</span>
                  <textarea
                    value={formValues.treatment}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, treatment: event.target.value }))}
                    rows={3}
                    className="exam-input nurse-focus-ring rounded-lg px-3 py-2 text-sm"
                    placeholder="Nhập hướng xử lý"
                  />
                  {fieldErrors.treatment ? <span className="text-xs text-[#B91C1C]">{fieldErrors.treatment}</span> : null}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#5F746B]">Ghi chú thêm</span>
                  <textarea
                    value={formValues.note}
                    onChange={(event) => setFormValues((prev) => ({ ...prev, note: event.target.value }))}
                    rows={3}
                    className="exam-input nurse-focus-ring rounded-lg px-3 py-2 text-sm"
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </label>
              </div>

              <section className="exam-section-subtle space-y-3 rounded-lg p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#163126]">Thuốc cấp cho học sinh</h3>
                  <button
                    type="button"
                    onClick={addPrescriptionRow}
                    className="exam-btn-secondary nurse-focus-ring inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                    Thêm thuốc
                  </button>
                </div>

                {medicineLoadError ? (
                  <p className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1.5 text-xs text-[#B91C1C]">Không thể tải danh mục thuốc: {medicineLoadError}</p>
                ) : null}

                {!medicineLoadError && !medicines.length ? (
                  <p className="exam-warning rounded-md px-2.5 py-2 text-xs">Hiện không có thuốc còn tồn kho để cấp phát cho lượt khám này.</p>
                ) : null}

                {prescriptions.length ? (
                  <div className="space-y-2">
                    {prescriptions.map((item, index) => {
                      const selectedMedicine = medicinesById.get(item.medicineId);

                      return (
                        <article key={`prescription-${index}`} className="exam-card rounded-md p-3">
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                            <label className="md:col-span-4 flex flex-col gap-1">
                              <span className="text-[11px] font-semibold text-[#5F746B]">Thuốc *</span>
                              <select
                                value={item.medicineId}
                                onChange={(event) => updatePrescriptionRow(index, { medicineId: event.target.value })}
                                className="exam-input nurse-focus-ring h-10 rounded-lg px-2.5 text-sm"
                              >
                                <option value="">Chọn thuốc</option>
                                {medicines.map((medicine) => (
                                  <option
                                    key={medicine.id}
                                    value={medicine.id}
                                    disabled={prescriptions.some((row, rowIndex) => rowIndex !== index && row.medicineId === medicine.id)}
                                  >
                                    {medicine.name}
                                  </option>
                                ))}
                              </select>
                              {selectedMedicine ? (
                                <span className={`text-[11px] ${selectedMedicine.isLowStock ? 'text-[#9A6700]' : 'text-[#5F746B]'}`}>
                                  Tồn kho còn: {selectedMedicine.currentStock}
                                </span>
                              ) : null}
                              {selectedMedicine?.isLowStock ? <span className="exam-warning inline-flex w-fit rounded-md px-1.5 py-0.5 text-[10px] font-semibold">Sắp hết thuốc</span> : null}
                              {fieldErrors[`prescriptions[${index}].medicineId`] ? (
                                <span className="text-xs text-[#B91C1C]">{fieldErrors[`prescriptions[${index}].medicineId`]}</span>
                              ) : null}
                            </label>

                            <label className="md:col-span-2 flex flex-col gap-1">
                              <span className="text-[11px] font-semibold text-[#5F746B]">Số lượng *</span>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(event) => updatePrescriptionRow(index, { quantity: event.target.value })}
                                className="exam-input nurse-focus-ring h-10 rounded-lg px-2.5 text-sm"
                              />
                              {fieldErrors[`prescriptions[${index}].quantity`] ? (
                                <span className="text-xs text-[#B91C1C]">{fieldErrors[`prescriptions[${index}].quantity`]}</span>
                              ) : null}
                            </label>

                            <label className="md:col-span-2 flex flex-col gap-1">
                              <span className="text-[11px] font-semibold text-[#5F746B]">Liều dùng</span>
                              <input
                                type="text"
                                value={item.dosage}
                                onChange={(event) => updatePrescriptionRow(index, { dosage: event.target.value })}
                                className="exam-input nurse-focus-ring h-10 rounded-lg px-2.5 text-sm"
                                placeholder="Ví dụ: 1 viên/lần"
                              />
                            </label>

                            <label className="md:col-span-3 flex flex-col gap-1">
                              <span className="text-[11px] font-semibold text-[#5F746B]">Hướng dẫn sử dụng</span>
                              <input
                                type="text"
                                value={item.usageInstruction}
                                onChange={(event) => updatePrescriptionRow(index, { usageInstruction: event.target.value })}
                                className="exam-input nurse-focus-ring h-10 rounded-lg px-2.5 text-sm"
                                placeholder="Ví dụ: Uống sau ăn"
                              />
                            </label>

                            <div className="md:col-span-1 flex flex-col gap-1">
                              <span className="text-[11px] font-semibold text-transparent select-none">Xóa</span>
                              <button
                                type="button"
                                onClick={() => removePrescriptionRow(index)}
                                className="nurse-focus-ring inline-flex h-10 w-10 items-center justify-center self-end rounded-lg border border-[#D9E2DE] bg-white text-[#B42318] transition hover:bg-[#FDECEC]"
                                aria-label="Xóa thuốc"
                              >
                                <span className="material-symbols-outlined text-[17px]">delete</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-[#D9E2DE] bg-white px-3 py-4 text-sm text-[#5F746B]">
                    Chưa có thuốc được thêm. Bạn có thể để trống phần này nếu lượt khám không cần cấp thuốc.
                  </div>
                )}
              </section>

              <div className="sticky bottom-0 -mx-4 border-t border-[#D9E2DE] bg-[#F8FAF9] px-4 py-3">
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/nurse/examinations')}
                    className="exam-btn-secondary nurse-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold"
                    disabled={submitting}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !studentIdForSubmit}
                    className="exam-btn-primary nurse-focus-ring rounded-xl px-3.5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
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
