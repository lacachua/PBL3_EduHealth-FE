import React, { useEffect, useState } from 'react';
import {
  USER_FILTER_DEFAULTS,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from '../schemas/userManagementSchema';
import { ACCOUNT_BASE_CLASS } from '../constants/accountUiTokens';

const controlClass = `h-11 rounded-xl border bg-surface px-3 text-sm outline-none transition ${ACCOUNT_BASE_CLASS.border} ${ACCOUNT_BASE_CLASS.bodyText} ${ACCOUNT_BASE_CLASS.focusRing}`;

const UserFilters = ({ initialValue, onApply, onReset }) => {
  const [draft, setDraft] = useState(initialValue);

  useEffect(() => {
    setDraft(initialValue);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    const resetValue = USER_FILTER_DEFAULTS;
    setDraft(resetValue);
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      <label className="relative w-full md:max-w-[320px]">
        <span className={`material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] ${ACCOUNT_BASE_CLASS.mutedText}`}>search</span>
        <input
          type="search"
          value={draft.keyword}
          onChange={(event) => setDraft((prev) => ({ ...prev, keyword: event.target.value }))}
          placeholder="Tìm theo tên đăng nhập, họ tên, email hoặc số điện thoại"
          className={`w-full pl-9 pr-3 ${controlClass}`}
        />
      </label>

      <select
        value={draft.role}
        onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))}
        className={`w-full md:w-[170px] ${controlClass}`}
      >
        {USER_ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={draft.status}
        onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}
        className={`w-full md:w-[170px] ${controlClass}`}
      >
        {USER_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <button
        type="submit"
        className={`inline-flex h-11 items-center justify-center rounded-xl px-3.5 text-sm font-semibold transition ${ACCOUNT_BASE_CLASS.primaryButton}`}
      >
        Lọc
      </button>

      <button
        type="button"
        onClick={handleReset}
        className={`inline-flex h-11 items-center justify-center rounded-xl px-3.5 text-sm font-semibold transition ${ACCOUNT_BASE_CLASS.secondaryButton}`}
      >
        Đặt lại
      </button>
    </form>
  );
};

export default UserFilters;
