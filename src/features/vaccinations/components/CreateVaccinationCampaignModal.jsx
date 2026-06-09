import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CREATE_CAMPAIGN_INITIAL_VALUES,
  validateCreateCampaignValues,
} from '../schemas/vaccinationSchema';
import { VACCINATION_TARGET_TYPE_OPTIONS } from '../constants/vaccinationConstants';
import { getNurseStudentsLookupApi } from '../../health-profiles/services/healthProfilesApi';
import { getStudentClassesApi } from '../../students/services/classesApi';
import NurseModalShell from '../../../shared/components/nurse/NurseModalShell';

const toClassCode = (item = {}) => {
  const rawCode = String(item.classCode || item.code || item.Code || '').trim();

  if (/^CLS\d+$/i.test(rawCode)) {
    return rawCode.toUpperCase();
  }

  const rawClassId = String(item.classId || item.ClassId || '').trim();
  if (rawClassId) {
    return rawClassId;
  }

  const classNameMatch = String(item.className || item.ClassName || item.label || '')
    .trim()
    .match(/(\d{1,2})\s*[/A-Za-z]\s*(\d{1,2})/);

  if (classNameMatch) {
    return `CLS${classNameMatch[1]}${classNameMatch[2].padStart(2, '0')}`;
  }

  return '';
};

const toClassAliases = (item = {}, classCode) => {
  const aliases = new Set([classCode]);
  const rawClassId = String(item.classId || item.ClassId || '').trim();
  const numericClassId = Number(rawClassId);

  if (rawClassId) {
    aliases.add(rawClassId);
  }

  if (Number.isInteger(numericClassId) && numericClassId > 0) {
    aliases.add(`CLS${String(numericClassId).padStart(3, '0')}`);
  }

  return Array.from(aliases).filter(Boolean);
};

const toGradeLabel = (className) => {
  const match = String(className || '').trim().match(/^(\d{1,2})/);
  return match?.[1] ? `Khối ${match[1]}` : 'Khối khác';
};

const toClassOption = (item = {}) => {
  const value = toClassCode(item);
  const label = String(item.className || item.ClassName || '').trim();
  if (!value || !label) {
    return null;
  }

  return {
    value,
    label,
    gradeLabel: toGradeLabel(label),
    aliases: toClassAliases(item, value),
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
    studentCode: item.studentCode || '',
  };
};

const CLASS_LOOKUP_ERROR_MESSAGE = 'Không tải được danh sách lớp. Vui lòng thử lại sau.';
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

  const [classLookupStatus, setClassLookupStatus] = useState(INITIAL_CLASS_LOOKUP_STATUS);
  const [classLookupError, setClassLookupError] = useState('');
  const [classOptions, setClassOptions] = useState([]);
  const [gradeFilter, setGradeFilter] = useState('all');

  const [studentKeyword, setStudentKeyword] = useState('');
  const [lookupStatus, setLookupStatus] = useState('idle');
  const [lookupError, setLookupError] = useState('');
  const [lookupRows, setLookupRows] = useState([]);
  const [selectedStudentMap, setSelectedStudentMap] = useState({});

  const todayStr = useMemo(() => {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
  }, []);

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

  const classCodeAliasMap = useMemo(() => {
    const map = new Map();
    classOptions.forEach((option) => {
      (option.aliases || [option.value]).forEach((alias) => {
        map.set(String(alias).trim().toUpperCase(), option.value);
      });
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
        studentCode: '',
        className: '--',
      };
    });
  }, [selectedStudentMap, values.targetStudentIds]);

  const fetchClassOptions = useCallback(async () => {
    const response = await getStudentClassesApi();
    const rows = Array.isArray(response?.data) ? response.data : [];

    const uniqueMap = new Map();
    rows.forEach((item) => {
      const option = toClassOption(item);
      if (option && !uniqueMap.has(option.value)) {
        uniqueMap.set(option.value, option);
      }
    });

    return Array.from(uniqueMap.values())
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

  const resolveSelectedClassCodes = () => {
    return values.targetClassIds
      .map((classId) => {
        const normalized = String(classId || '').trim().toUpperCase();
        return classCodeAliasMap.get(normalized) || normalized;
      })
      .filter(Boolean);
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
      setLookupError('Không tải được danh sách học sinh. Vui lòng thử lại sau.');
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
    
    if (values.targetType === 'CLASS' && values.targetClassIds.length === 0) {
      nextErrors.targetClassIds = 'Vui lòng chọn ít nhất 1 lớp.';
    }
    
    if (values.targetType === 'STUDENT' && values.targetStudentIds.length === 0) {
      nextErrors.targetStudentIds = 'Vui lòng chọn ít nhất 1 học sinh.';
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    const payload = {
      ...values,
      targetClassIds: values.targetType === 'CLASS' ? resolveSelectedClassCodes() : [],
      targetStudentIds: values.targetType === 'STUDENT' ? values.targetStudentIds : [],
    };

    await onSubmit(payload);
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
      <div className="space-y-4 pb-24">
        <section className="space-y-3 rounded-xl border border-outline-variant bg-white p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="select-none text-sm font-bold text-on-surface">1. Thông tin đợt tiêm</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="select-none text-sm font-semibold text-on-surface-variant">Tên đợt tiêm</span>
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
              <span className="select-none text-sm font-semibold text-on-surface-variant">Tên vaccine</span>
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
              <span className="select-none text-sm font-semibold text-on-surface-variant">Mũi số</span>
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
              <span className="select-none text-sm font-semibold text-on-surface-variant">Ngày thực hiện dự kiến</span>
              <input
                type="date"
                min={todayStr}
                value={values.scheduledDate}
                onChange={(event) => updateField('scheduledDate', event.target.value)}
                className="app-input rounded-xl px-3 py-2.5 text-sm"
              />
              {fieldErrors.scheduledDate ? <span className="text-xs text-danger">{fieldErrors.scheduledDate}</span> : null}
            </label>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-outline-variant bg-surface-container-low p-3 md:p-4">
          <h3 className="select-none text-sm font-bold text-on-surface">2. Chọn đối tượng áp dụng</h3>

          <div className="inline-flex items-center gap-1 rounded-xl bg-surface-container-low p-1">
            {VACCINATION_TARGET_TYPE_OPTIONS.map((option) => {
              const selected = values.targetType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField('targetType', option.value)}
                  className={`app-focus-ring select-none rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    selected
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {fieldErrors.targetType ? <p className="text-xs text-danger">{fieldErrors.targetType}</p> : null}

          {values.targetType === 'CLASS' ? (
            <div className="space-y-3 rounded-xl border border-outline-variant bg-white p-3">
              <div className="grid gap-2 md:grid-cols-[220px_1fr] md:items-center">
                <label className="space-y-1">
                  <span className="select-none text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Lọc theo khối</span>
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
                <p className="select-none text-xs text-on-surface-variant">Chọn một hoặc nhiều lớp áp dụng.</p>
              </div>

              {classLookupStatus === 'loading' ? <p className="text-xs text-on-surface-variant">Đang tải danh sách lớp...</p> : null}
              {classLookupError ? <p className="text-xs text-danger">{classLookupError}</p> : null}

              {filteredClassOptions.length ? (
                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-48 p-1">
                  {filteredClassOptions.map((option) => {
                    const selected = values.targetClassIds.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleClassCode(option.value)}
                        className={`app-focus-ring inline-flex select-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                          selected
                            ? 'border-primary bg-primary-soft text-primary'
                            : 'border-outline-variant bg-surface hover:bg-surface-container-low text-on-surface-variant'
                        }`}
                        title={option.value}
                        aria-pressed={selected}
                      >
                        {selected && <span className="material-symbols-outlined text-[16px]">check</span>}
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 items-start">
              <div className="space-y-3 rounded-xl border border-outline-variant bg-white p-3">
                <p className="select-none text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">1. Tìm học sinh</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studentKeyword}
                    onChange={(event) => setStudentKeyword(event.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        searchStudents();
                      }
                    }}
                    className="app-input flex-1 rounded-xl px-3 py-2 text-sm"
                    placeholder="Nhập tên hoặc mã..."
                  />
                  <button
                    type="button"
                    onClick={searchStudents}
                    className="app-btn-secondary app-focus-ring rounded-xl px-3 py-2 text-sm font-semibold"
                  >
                    Tìm
                  </button>
                </div>

                {lookupStatus === 'loading' ? <p className="select-none text-xs text-on-surface-variant">Đang tìm học sinh...</p> : null}
                {lookupError ? <p className="select-none text-xs text-danger">{lookupError}</p> : null}

                {lookupRows.length ? (
                  <div className="mt-3 max-h-52 space-y-1 overflow-y-auto pr-1">
                    {lookupRows.map((student) => {
                      const selected = values.targetStudentIds.includes(student.id);

                      return (
                        <button
                          key={student.id}
                          type="button"
                          disabled={selected}
                          onClick={() => addStudentCandidate(student.id, student)}
                          className="app-focus-ring flex w-full items-center justify-between rounded-lg border border-outline-variant px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:bg-surface-container-low"
                        >
                          <div className="select-none">
                            <p className={`font-semibold ${selected ? 'text-on-surface-variant' : 'text-on-surface'}`}>{student.fullName}</p>
                            <p className="text-[11px] text-on-surface-variant">
                              {student.studentCode ? `${student.studentCode} • Lớp ${student.className}` : `Lớp ${student.className}`}
                            </p>
                          </div>
                          {selected ? (
                            <span className="select-none text-[11px] font-bold text-primary">Đã chọn</span>
                          ) : (
                            <span className="select-none text-[11px] font-bold text-success">Chọn</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="space-y-3 rounded-xl border border-outline-variant bg-white p-3">
                <div className="flex items-center justify-between">
                  <p className="select-none text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">2. Đã chọn</p>
                  <span className="select-none rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">{values.targetStudentIds.length} học sinh</span>
                </div>
                
                {selectedStudents.length ? (
                  <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
                    {selectedStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2 text-sm">
                        <div className="select-none">
                          <p className="font-semibold text-on-surface">{student.fullName}</p>
                          <p className="text-[11px] text-on-surface-variant">
                            {student.studentCode ? `${student.studentCode} • Lớp ${student.className}` : `Lớp ${student.className}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStudentId(student.id)}
                          className="app-focus-ring flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-danger"
                          aria-label={`Xóa học sinh ${student.id}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="select-none text-xs italic text-on-surface-variant">Chưa chọn học sinh nào.</p>
                )}
                
              </div>
            </div>
          )}
        </section>

        <section className="space-y-2 rounded-xl border border-outline-variant bg-white p-3 md:p-4">
          <div className="flex items-center justify-between">
            <h3 className="select-none text-sm font-bold text-on-surface">3. Xác nhận danh sách đã chọn</h3>
            <span className="select-none inline-flex rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
              {selectedCountLabel}
            </span>
          </div>

          {values.targetType === 'CLASS' ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {values.targetClassIds.length ? (
                <>
                  {values.targetClassIds.slice(0, 15).map((classCode) => {
                    const classLabel = classLabelMap.get(classCode) || classCode;
                    return (
                      <span key={classCode} className="select-none inline-flex items-center gap-1 rounded-full bg-surface-container-low border border-outline-variant px-2.5 py-1 text-xs font-semibold text-on-surface" title={classCode}>
                        {classLabel}
                        <button
                          type="button"
                          onClick={() => removeClassCode(classCode)}
                          className="app-focus-ring flex h-4 w-4 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-danger"
                          aria-label={`Xóa lớp ${classLabel}`}
                        >
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      </span>
                    );
                  })}
                  {values.targetClassIds.length > 15 && (
                    <span className="select-none inline-flex items-center px-1 text-xs text-on-surface-variant">
                      và {values.targetClassIds.length - 15} lớp khác...
                    </span>
                  )}
                </>
              ) : <p className="select-none text-xs italic text-on-surface-variant">Chưa chọn lớp nào.</p>}
            </div>
          ) : (
            <div className="pt-1">
              {values.targetStudentIds.length ? (
                <p className="select-none text-xs text-on-surface-variant">Danh sách học sinh đã được chọn ở bước 2.</p>
              ) : (
                <p className="select-none text-xs italic text-on-surface-variant">Chưa chọn học sinh nào.</p>
              )}
            </div>
          )}

          {fieldErrors.targetClassIds ? <p className="text-xs text-danger">{fieldErrors.targetClassIds}</p> : null}
          {fieldErrors.targetStudentIds ? <p className="text-xs text-danger">{fieldErrors.targetStudentIds}</p> : null}
        </section>

        <label className="flex flex-col gap-1">
          <span className="select-none text-sm font-semibold text-on-surface-variant">Ghi chú</span>
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
