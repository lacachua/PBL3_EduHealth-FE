import React from 'react';
import { getNotificationTypeMeta } from '../constants/notificationTypes';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'unread', label: 'Chưa đọc' },
  { value: 'read', label: 'Đã đọc' },
];

const NotificationToolbar = ({
  role,
  statusFilter,
  typeFilter,
  keyword,
  availableTypes = [],
  onStatusFilterChange,
  onTypeFilterChange,
  onKeywordChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-low p-1">
          {STATUS_OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onStatusFilterChange(item.value)}
              className={`app-focus-ring rounded-full px-3 py-1 text-xs font-semibold transition ${
                statusFilter === item.value
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value)}
          className="app-focus-ring app-input h-9 rounded-full px-3 text-xs"
        >
          <option value="">Tất cả loại</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {getNotificationTypeMeta(type, role).label}
            </option>
          ))}
        </select>
      </div>

      <label className="relative min-w-[240px] flex-1 sm:max-w-[380px]">
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
          search
        </span>
        <input
          type="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="Tìm theo tiêu đề, nội dung, người gửi"
          className="app-focus-ring app-input h-9 w-full rounded-full pl-10 text-xs"
        />
      </label>
    </div>
  );
};

export default NotificationToolbar;
