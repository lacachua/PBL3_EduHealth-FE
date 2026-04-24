import React, { useEffect, useState } from 'react';
import SearchInput from '../../../shared/components/core/SearchInput';
import { STUDENT_FILTER_DEFAULTS, STUDENT_CLASS_FILTER_OPTIONS, STUDENT_STATUS_OPTIONS } from '../schemas/studentManagementSchema';
import {
  STUDENT_BASE_CLASS,
} from '../constants/studentUiTokens';

const StudentFilters = ({ initialValue, onApply }) => {
  const [draft, setDraft] = useState(initialValue);

  const controlClass = `h-11 rounded-xl border bg-surface px-3 text-sm outline-none transition ${STUDENT_BASE_CLASS.border} ${STUDENT_BASE_CLASS.bodyText} ${STUDENT_BASE_CLASS.focusRing}`;

  useEffect(() => {
    setDraft(initialValue);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    const resetValue = STUDENT_FILTER_DEFAULTS;
    setDraft(resetValue);
    onApply(resetValue);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      <SearchInput
        value={draft.keyword}
        onChange={(keyword) => setDraft((prev) => ({ ...prev, keyword }))}
        placeholder="Tìm theo mã, họ tên hoặc username"
        className="w-full md:max-w-[320px]"
        inputClassName={controlClass}
        iconClassName={STUDENT_BASE_CLASS.mutedText}
      />

      <select
        value={draft.classId}
        onChange={(event) => setDraft((prev) => ({ ...prev, classId: event.target.value }))}
        className={`w-full md:w-[170px] ${controlClass}`}
      >
        {STUDENT_CLASS_FILTER_OPTIONS.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>

      <select
        value={draft.status}
        onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
        className={`w-full md:w-[170px] ${controlClass}`}
      >
        {STUDENT_STATUS_OPTIONS.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>

      <button
        type="submit"
        className={`inline-flex h-11 items-center justify-center rounded-xl px-3.5 text-sm font-semibold transition ${STUDENT_BASE_CLASS.primaryButton}`}
      >
        Lọc
      </button>

      <button
        type="button"
        onClick={handleReset}
        className={`inline-flex h-11 items-center justify-center rounded-xl px-3.5 text-sm font-semibold transition ${STUDENT_BASE_CLASS.secondaryButton}`}
      >
        Đặt lại
      </button>
    </form>
  );
};

export default StudentFilters;
