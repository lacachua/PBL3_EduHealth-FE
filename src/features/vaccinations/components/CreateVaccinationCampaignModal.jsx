import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CREATE_CAMPAIGN_INITIAL_VALUES,
  validateCreateCampaignValues,
} from '../schemas/vaccinationSchema';
import { VACCINATION_TARGET_TYPE_OPTIONS } from '../constants/vaccinationConstants';
import { getNurseStudentsLookupApi } from '../../health-profiles/services/healthProfilesApi';
import NurseModalShell from '../../../shared/components/nurse/NurseModalShell';

const normalizeClassCode = (value) => String(value || '').trim().toUpperCase().replace(/\s+/g, '');

const parseClassCodeList = (rawValue) => {
  return String(rawValue || '')
    .split(/[\n,;]+/)
    .map((item) => normalizeClassCode(item))
    .filter(Boolean);
};

const parseStudentIdList = (rawValue) => {
  return String(rawValue || '')
    .split(/[\n,;\s]+/)
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);
};

const toClassCode = (item = {}) => {
  const rawCode = String(item.classCode || item.classId || '').trim();

  if (/^CLS\d+$/i.test(rawCode)) {
    return rawCode.toUpperCase();
  }

  const numericClassId = Number(item.classId);
  if (Number.isInteger(numericClassId) && numericClassId > 0) {
    return `CLS${String(numericClassId).padStart(3, '0')}`;
  }

  return '';
};

const toGradeLabel = (className) => {
  const match = String(className || '').trim().match(/^(\d{1,2})/);
  return match?.[1] ? `Khối ${match[1]}` : 'Khối khác';
};

const toClassOption = (item = {}) => {
  const value = toClassCode(item);
  const label = String(item.className || '').trim();
  if (!value || !label) {
    return null;
  }

  return {
    value,
    label,
    gradeLabel: toGradeLabel(label),
  };
};

const toPositiveInt = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const extractLookupRows = (envelope) => {
  if (Array.isArray(envelope?.data)) {
    return envelope.data;
  }

  if (Array.isArray(envelope?.data?.students)) {
    return envelope.data.students;
  }

  if (Array.isArray(envelope?.data?.items)) {
    return envelope.data.items;
  }

  return [];
};

const toLookupStudent = (item = {}) => {
  const rawId = item.userId ?? item.id ?? item.studentId;
  const numericId = toPositiveInt(rawId);

  if (!numericId) {
    return null;
  }

  return {
    id: numericId,
    fullName: item.fullName || item.studentName || `Học sinh #${numericId}`,
    className: item.className || item.classId || '--',
    studentCode: item.studentCode || '--',
  };
};

const CLASS_LOOKUP_ERROR_MESSAGE = 'Không tải được danh sách lớp. Bạn có thể nhập mã lớp thủ công ở phần mở rộng bên dưới.';
const INITIAL_CLASS_LOOKUP_STATUS = CREATE_CAMPAIGN_INITIAL_VALUES.targetType === 'CLASS' ? 'loading' : 'idle';

const CreateVaccinationCampaignModal = ({
  open,
  onClose,
  onSubmit,
  submitting,
  submitError,
}) => {
  const [values, setValues] = useState(() => CREATE_CAMPAIGN_INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});

  const [classBatchInput, setClassBatchInput] = useState('');
  const [classLookupStatus, setClassLookupStatus] = useState(INITIAL_CLASS_LOOKUP_STATUS);
  const [classLookupError, setClassLookupError] = useState('');
  const [classOptions, setClassOptions] = useState([]);
  const [gradeFilter, setGradeFilter] = useState('all');

  const [studentKeyword, setStudentKeyword] = useState('');
  const [lookupStatus, setLookupStatus] = useState('idle');
  const [lookupError, setLookupError] = useState('');
  const [lookupRows, setLookupRows] = useState([]);
  const [manualStudentInput, setManualStudentInput] = useState('');
  const [selectedStudentMap, setSelectedStudentMap] = useState({});

  const selectedCountLabel = useMemo(() => {
    if (values.targetType === 'CLASS') {
      return `${values.targetClassIds.length} lớp đã chọn`;
    }

    return `${values.targetStudentIds.length} học sinh đã chọn`;
  }, [values.targetClassIds.length, values.targetStudentIds.length, values.targetType]);

  const classLabelMap = useMemo(() => {
    const map = new Map();
    classOptions.forEach((option) => {
      map.set(option.value, option.label);
    });
    return map;
  }, [classOptions]);

  const gradeOptions = useMemo(() => {
    const valuesSet = new Set();
    classOptions.forEach((option) => {
      valuesSet.add(option.gradeLabel);
    });

    return ['all', ...Array.from(valuesSet).sort((left, right) => left.localeCompare(right, 'vi'))];
  }, [classOptions]);

  const filteredClassOptions = useMemo(() => {
    if (gradeFilter === 'all') {
      return classOptions;
    }

    return classOptions.filter((option) => option.gradeLabel === gradeFilter);
  }, [classOptions, gradeFilter]);

  const selectedStudents = useMemo(() => {
    return values.targetStudentIds.map((studentId) => {
      return selectedStudentMap[studentId] || {
        id: studentId,
        fullName: `Mã học sinh ${studentId}`,
        studentCode: '--',
        className: '--',
      };
    });
  }, [selectedStudentMap, values.targetStudentIds]);

  const fetchClassOptions = useCallback(async () => {
    const rows = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await getNurseStudentsLookupApi({
        page,
        pageSize: 100,
        isActive: true,
      });

      rows.push(...extractLookupRows(response));

      const nextTotalPages = Number(response?.meta?.totalPages || response?.meta?.total_pages || 1);
      totalPages = Number.isFinite(nextTotalPages) && nextTotalPages > 0
        ? Math.min(nextTotalPages, 12)
        : 1;

      page += 1;
    } while (page <= totalPages);

    const optionMap = new Map();
    rows.forEach((item) => {
      const option = toClassOption(item);
      if (!option) {
        return;
      }
      if (!optionMap.has(option.value)) {
        optionMap.set(option.value, option);
      }
    });

    return Array.from(optionMap.values())
      .sort((left, right) => {
        const byGrade = left.gradeLabel.localeCompare(right.gradeLabel, 'vi');
        if (byGrade !== 0) {
          return byGrade;
        }
        return left.label.localeCompare(right.label, 'vi');
      });
  }, []);

  useEffect(() => {
    if (!open || values.targetType !== 'CLASS' || classLookupStatus !== 'loading') {
      return;
    }

    let active = true;

    const runLookup = async () => {
      try {
        const resolved = await fetchClassOptions();
        if (!active) {
          return;
        }
        setClassOptions(resolved);
        setClassLookupStatus('success');
        setClassLookupError('');
      } catch {
        if (!active) {
          return;
        }
        setClassOptions([]);
        setClassLookupStatus('error');
        setClassLookupError(CLASS_LOOKUP_ERROR_MESSAGE);
      }
    };

    void runLookup();

    return () => {
      active = false;
    };
  }, [classLookupStatus, fetchClassOptions, open, values.targetType]);

  const updateField = (field, fieldValue) => {
    setValues((prev) => ({
      ...prev,
      [field]: fieldValue,
    }));

    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });

    if (field === 'targetType') {
      const nextTargetType = String(fieldValue || '').toUpperCase();
      setLookupError('');
      setLookupRows([]);
      setGradeFilter('all');

      if (nextTargetType === 'CLASS') {
        setClassLookupError('');
        setClassLookupStatus(classOptions.length ? 'success' : 'loading');
      } else {
        setClassLookupError('');
        setClassLookupStatus('idle');
      }
    }
  };

  const removeClassCode = (classCode) => {
    updateField('targetClassIds', values.targetClassIds.filter((item) => item !== classCode));
  };

  const toggleClassCode = (classCode) => {
    if (values.targetClassIds.includes(classCode)) {
      removeClassCode(classCode);
      return;
    }

    updateField('targetClassIds', [...values.targetClassIds, classCode]);
  };

  const addClassCodes = () => {
    const parsed = parseClassCodeList(classBatchInput);
    if (!parsed.length) {
      return;
    }

    const nextSet = new Set(values.targetClassIds);
    parsed.forEach((item) => nextSet.add(item));

    updateField('targetClassIds', Array.from(nextSet));
    setClassBatchInput('');
  };

  const addStudentCandidate = (candidate, meta = null) => {
    const parsed = toPositiveInt(candidate);
    if (!parsed) {
      setFieldErrors((prev) => ({
        ...prev,
        targetStudentIds: 'Mã học sinh phải là số nguyên dương.',
      }));
      return false;
    }

    if (values.targetStudentIds.includes(parsed)) {
      return false;
    }

    updateField('targetStudentIds', [...values.targetStudentIds, parsed]);

    if (meta) {
      setSelectedStudentMap((prev) => ({
        ...prev,
        [parsed]: meta,
      }));
    }

    return true;
  };

  const addManualStudentIds = () => {
    const parsedIds = parseStudentIdList(manualStudentInput);
    if (!parsedIds.length) {
      return;
    }

    const nextSet = new Set(values.targetStudentIds);
    parsedIds.forEach((item) => nextSet.add(item));
    updateField('targetStudentIds', Array.from(nextSet));
    setManualStudentInput('');
  };

  const searchStudents = async () => {
    const keyword = String(studentKeyword || '').trim();
    if (!keyword) {
      setLookupRows([]);
      setLookupStatus('idle');
      return;
    }

    setLookupStatus('loading');
    setLookupError('');

    try {
      const response = await getNurseStudentsLookupApi({
        page: 1,
        pageSize: 12,
        search: keyword,
        isActive: true,
      });

      const rows = extractLookupRows(response)
        .map(toLookupStudent)
        .filter(Boolean);

      setLookupRows(rows);
      setLookupStatus('success');
    } catch {
      setLookupRows([]);
      setLookupStatus('error');
      setLookupError('Không tải được danh sách học sinh. Bạn có thể dùng nhập mã thủ công trong phần nâng cao.');
    }
  };

  const removeStudentId = (studentId) => {
    updateField('targetStudentIds', values.targetStudentIds.filter((item) => item !== studentId));

    setSelectedStudentMap((prev) => {
      if (!prev[studentId]) {
        return prev;
      }

      const next = { ...prev };
      delete next[studentId];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateCreateCampaignValues(values);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    await onSubmit(values);
  };

  if (!open) {
    return null;
  }

  return (
    <NurseModalShell
      open={open}
      onClose={onClose}
      title="Tạo đợt tiêm"
      subtitle="Nhập thông tin cơ bản, chọn đối tượng áp dụng và xác nhận danh sách trước khi tạo."
      error={submitError}
      onSubmit={handleSubmit}
      submitting={submitting}
      submitLabel="Tạo đợt tiêm"
      maxWidthClass="max-w-[860px]"
      submitButtonClassName="app-btn-primary app-focus-ring rounded-xl px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="space-y-4">
        <section className="space-y-3 rounded-xl border border-outline-variant bg-white p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-on-surface">1. Thông tin đợt tiêm</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-on-surface-variant">Tên đợt tiêm</span>
              <input
                type="text"
                value={values.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="app-input rounded-xl px-3 py-2.5 text-sm"
                placeholder="Ví dụ: Cúm mùa học kỳ II"
              />
              {fieldErrors.name ? <span className="text-xs text-danger">{fieldErrors.name}</span> : null}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-on-surface-variant">Tên vaccine</span>
              <input
                type="text"
                value={values.vaccineName}
                onChange={(event) => updateField('vaccineName', event.target.value)}
                className="app-input rounded-xl px-3 py-2.5 text-sm"
                placeholder="Ví dụ: MMR II"
              />
              {fieldErrors.vaccineName ? <span className="text-xs text-danger">{fieldErrors.vaccineName}</span> : null}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-on-surface-variant">Mũi số</span>
              <input
                type="number"
                min="1"
                value={values.doseNumber}
                onChange={(event) => updateField('doseNumber', event.target.value)}
                className="app-input rounded-xl px-3 py-2.5 text-sm"
                placeholder="1"
              />
              {fieldErrors.doseNumber ? <span className="text-xs text-danger">{fieldErrors.doseNumber}</span> : null}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-on-surface-variant">Ngày thực hiện dự kiến</span>
              <input
                type="date"
                value={values.scheduledDate}
                onChange={(event) => updateField('scheduledDate', event.target.value)}
                className="app-input rounded-xl px-3 py-2.5 text-sm"
              />
              {fieldErrors.scheduledDate ? <span className="text-xs text-danger">{fieldErrors.scheduledDate}</span> : null}
            </label>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-outline-variant bg-surface-container-low p-3 md:p-4">
          <h3 className="text-sm font-bold text-on-surface">2. Chọn đối tượng áp dụng</h3>

          <div className="flex flex-wrap items-center gap-3">
            {VACCINATION_TARGET_TYPE_OPTIONS.map((option) => (
              <label key={option.value} className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-3 py-2 text-sm font-semibold text-on-surface-variant">
                <input
                  type="radio"
                  name="targetType"
                  checked={values.targetType === option.value}
                  onChange={() => updateField('targetType', option.value)}
                  className="h-4 w-4 accent-success"
                />
                {option.label}
              </label>
            ))}
          </div>
          {fieldErrors.targetType ? <p className="text-xs text-danger">{fieldErrors.targetType}</p> : null}

          {values.targetType === 'CLASS' ? (
            <div className="space-y-3 rounded-xl border border-outline-variant bg-white p-3">
              <div className="grid gap-2 md:grid-cols-[220px_1fr] md:items-center">
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Lọc theo khối</span>
                  <select
                    value={gradeFilter}
                    onChange={(event) => setGradeFilter(event.target.value)}
                    className="app-input w-full rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="all">Tất cả khối</option>
                    {gradeOptions.filter((item) => item !== 'all').map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <p className="text-xs text-on-surface-variant">Chọn lớp theo tên quen thuộc, ví dụ 4/2 hoặc 5/1.</p>
              </div>

              {classLookupStatus === 'loading' ? <p className="text-xs text-on-surface-variant">Đang tải danh sách lớp...</p> : null}
              {classLookupError ? <p className="text-xs text-danger">{classLookupError}</p> : null}

              {filteredClassOptions.length ? (
                <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-outline-variant bg-white p-2 sm:grid-cols-3">
                  {filteredClassOptions.map((option) => {
                    const selected = values.targetClassIds.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleClassCode(option.value)}
                        className={`app-focus-ring relative flex min-h-[44px] items-center justify-between rounded-lg border px-2.5 py-2 text-left text-sm font-semibold transition ${selected
                            ? 'border-success bg-success-soft text-success ring-1 ring-success/50'
                            : 'border-outline-variant bg-white text-on-surface-variant hover:border-success/50 hover:bg-surface-container-low'
                          }`}
                        title={option.value}
                        aria-pressed={selected}
                      >
                        <span>
                          <span>{option.label}</span>
                          <span className="ml-1 text-[11px] font-medium text-on-surface-variant">{option.gradeLabel}</span>
                        </span>
                        {selected ? <span className="material-symbols-outlined text-[16px] text-success">check_circle</span> : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <details className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-3 py-2 opacity-90">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                  Nâng cao: nhập mã lớp thủ công
                </summary>

                <div className="mt-2 space-y-2">
                  <textarea
                    value={classBatchInput}
                    onChange={(event) => setClassBatchInput(event.target.value)}
                    className="app-input w-full rounded-xl px-3 py-2 text-sm"
                    placeholder="CLS001, CLS002"
                    rows={2}
                  />

                  <button
                    type="button"
                    onClick={addClassCodes}
                    className="app-btn-secondary app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold"
                  >
                    Thêm mã lớp
                  </button>
                </div>
              </details>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-outline-variant bg-white p-3">
              <p className="text-xs text-on-surface-variant">Tìm học sinh theo tên hoặc mã, sau đó bấm Chọn để thêm vào danh sách.</p>

              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={studentKeyword}
                  onChange={(event) => setStudentKeyword(event.target.value)}
                  className="app-input min-w-[280px] flex-1 rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Nhập tên hoặc mã học sinh"
                />
                <button
                  type="button"
                  onClick={searchStudents}
                  className="app-btn-secondary app-focus-ring rounded-xl px-3 py-2.5 text-sm font-semibold"
                >
                  Tìm học sinh
                </button>
              </div>

              {lookupStatus === 'loading' ? <p className="text-xs text-on-surface-variant">Đang tìm học sinh...</p> : null}
              {lookupError ? <p className="text-xs text-danger">{lookupError}</p> : null}

              {lookupRows.length ? (
                <div className="max-h-44 space-y-1 overflow-y-auto rounded-xl border border-outline-variant bg-white p-2">
                  {lookupRows.map((student) => {
                    const selected = values.targetStudentIds.includes(student.id);

                    return (
                      <button
                        key={student.id}
                        type="button"
                        disabled={selected}
                        onClick={() => addStudentCandidate(student.id, student)}
                        className="app-focus-ring flex w-full items-center justify-between rounded-lg border border-outline-variant px-2.5 py-2 text-left text-sm text-on-surface-variant hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <span>
                          <span className="font-semibold text-on-surface">{student.fullName}</span>
                          <span className="ml-1 text-xs text-on-surface-variant">({student.studentCode} • {student.className})</span>
                        </span>
                        <span className="text-xs font-semibold text-success">{selected ? 'Đã chọn' : 'Chọn'}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <details className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-3 py-2">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                  Nâng cao: nhập mã học sinh thủ công
                </summary>

                <div className="mt-2 space-y-2">
                  <textarea
                    value={manualStudentInput}
                    onChange={(event) => setManualStudentInput(event.target.value)}
                    className="app-input w-full rounded-xl px-3 py-2 text-sm"
                    placeholder="Nhập nhiều mã, ví dụ: 1201, 1202"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={addManualStudentIds}
                    className="app-btn-secondary app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold"
                  >
                    Thêm mã học sinh
                  </button>
                </div>
              </details>
            </div>
          )}
        </section>

        <section className="space-y-2 rounded-xl border border-outline-variant bg-white p-3 md:p-4">
          <h3 className="text-sm font-bold text-on-surface">3. Xác nhận danh sách đã chọn</h3>
          <p className="text-xs text-on-surface-variant">{selectedCountLabel}</p>

          {values.targetType === 'CLASS' ? (
            <div className="flex flex-wrap gap-2">
              {values.targetClassIds.length ? values.targetClassIds.map((classCode) => {
                const classLabel = classLabelMap.get(classCode) || classCode;
                return (
                  <span key={classCode} className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success" title={classCode}>
                    {classLabel}
                    <button
                      type="button"
                      onClick={() => removeClassCode(classCode)}
                      className="app-focus-ring rounded"
                      aria-label={`Xóa lớp ${classLabel}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                );
              }) : <p className="text-sm text-on-surface-variant">Chưa chọn lớp nào.</p>}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedStudents.length ? selectedStudents.map((student) => {
                const label = `${student.fullName} (${student.studentCode} • ${student.className})`;
                return (
                  <span key={student.id} className="inline-flex items-center gap-1 rounded-full bg-info-soft px-2.5 py-1 text-xs font-semibold text-info" title={label}>
                    {label}
                    <button
                      type="button"
                      onClick={() => removeStudentId(student.id)}
                      className="app-focus-ring rounded"
                      aria-label={`Xóa học sinh ${student.id}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                );
              }) : <p className="text-sm text-on-surface-variant">Chưa chọn học sinh nào.</p>}
            </div>
          )}

          {fieldErrors.targetClassIds ? <p className="text-xs text-danger">{fieldErrors.targetClassIds}</p> : null}
          {fieldErrors.targetStudentIds ? <p className="text-xs text-danger">{fieldErrors.targetStudentIds}</p> : null}
        </section>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-on-surface-variant">Ghi chú</span>
          <textarea
            value={values.note}
            onChange={(event) => updateField('note', event.target.value)}
            className="app-input rounded-xl px-3 py-2.5 text-sm"
            placeholder="Nhập hướng dẫn bổ sung cho phụ huynh hoặc nhân viên y tế"
            rows={3}
          />
          {fieldErrors.note ? <span className="text-xs text-danger">{fieldErrors.note}</span> : null}
        </label>
      </div>
    </NurseModalShell>
  );
};

export default CreateVaccinationCampaignModal;