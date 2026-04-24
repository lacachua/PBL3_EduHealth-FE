import React, { useEffect, useState } from 'react';
import SearchInput from '../../../shared/components/core/SearchInput';
import {
  USER_FILTER_DEFAULTS,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from '../schemas/userManagementSchema';
import { ACCOUNT_BASE_CLASS } from '../constants/accountUiTokens';

const controlClass = `app-input app-focus-ring w-full text-[13px] ${ACCOUNT_BASE_CLASS.bodyText}`;

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
    <form onSubmit={handleSubmit} className="app-filter-toolbar flex flex-col gap-2.5 lg:flex-row lg:flex-wrap lg:items-end">
      <SearchInput
        value={draft.keyword}
        onChange={(keyword) => setDraft((prev) => ({ ...prev, keyword }))}
        placeholder="Tìm theo tên đăng nhập, họ tên, email hoặc số điện thoại"
        className="w-full lg:min-w-[300px] lg:flex-[1.2]"
        inputClassName={controlClass}
        iconClassName={ACCOUNT_BASE_CLASS.mutedText}
      />

      <select
        value={draft.role}
        onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))}
        className={`w-full lg:w-[168px] ${controlClass}`}
      >
        {USER_ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        value={draft.status}
        onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}
        className={`w-full lg:w-[168px] ${controlClass}`}
      >
        {USER_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-2 lg:ml-auto">
        <button
          type="submit"
          className={`inline-flex px-3.5 ${ACCOUNT_BASE_CLASS.primaryButton}`}
        >
          Lọc
        </button>

        <button
          type="button"
          onClick={handleReset}
          className={`inline-flex px-3.5 ${ACCOUNT_BASE_CLASS.secondaryButton}`}
        >
          Đặt lại
        </button>
      </div>
    </form>
  );
};

export default UserFilters;
