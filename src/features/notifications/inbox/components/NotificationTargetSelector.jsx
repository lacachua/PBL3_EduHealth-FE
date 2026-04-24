import React, { useMemo, useState } from 'react';
import { filterOptions } from '../adapters/notificationAdapters';
import { TARGET_MODES } from '../constants/notificationTypes';
import NotificationRecipientPicker from './NotificationRecipientPicker';

const NotificationTargetSelector = ({
  config,
  role,
  draft,
  errors = {},
  classOptions = [],
  recipientOptions = [],
  onFieldChange,
  onToggleRecipient,
}) => {
  const [classKeyword, setClassKeyword] = useState('');
  const isStudent = role === 'STUDENT';
  const filteredClasses = useMemo(() => filterOptions(classOptions, classKeyword), [classKeyword, classOptions]);
  const filteredRecipients = useMemo(() => {
    if (isStudent) {
      return recipientOptions.filter((recipient) => recipient.role === 'ADMIN' || recipient.role === 'NURSE');
    }

    if (draft.targetMode === TARGET_MODES.STAFF) {
      return recipientOptions.filter((recipient) => recipient.role === 'ADMIN' || recipient.role === 'NURSE');
    }

    return recipientOptions;
  }, [draft.targetMode, isStudent, recipientOptions]);

  return (
    <section className="space-y-3 rounded-2xl border border-outline-variant bg-surface-container-low px-3 py-3">
      <div>
        <h3 className="text-sm font-semibold text-on-surface">Người nhận</h3>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          {isStudent ? 'Học sinh chỉ gửi yêu cầu tới quản trị hoặc điều dưỡng.' : 'Chọn lớp hoặc người nhận cụ thể, không nhập mã thô.'}
        </p>
      </div>

      {!isStudent ? (
        <div className="flex flex-wrap gap-1 rounded-xl border border-outline-variant bg-surface p-1">
          {config.allowedTargetModes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onFieldChange('targetMode', mode)}
              className={`app-focus-ring rounded-lg px-3 py-2 text-xs font-semibold transition ${
                draft.targetMode === mode
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {config.targetModeLabels[mode] || mode}
            </button>
          ))}
        </div>
      ) : null}

      {draft.targetMode === TARGET_MODES.CLASS ? (
        <div className="space-y-2">
          <span className="app-overline">Lớp nhận thông báo</span>
          <input
            type="search"
            value={classKeyword}
            onChange={(event) => setClassKeyword(event.target.value)}
            placeholder="Tìm lớp"
            className="app-focus-ring app-input h-10 w-full rounded-xl text-sm"
          />
          <select
            value={draft.classId}
            onChange={(event) => onFieldChange('classId', event.target.value)}
            className="app-focus-ring app-input h-10 w-full rounded-xl text-sm"
          >
            <option value="">Chọn lớp</option>
            {filteredClasses.map((option) => (
              <option key={option.classId} value={option.classId}>
                {option.className || option.label}{option.description ? ` · ${option.description}` : ''}
              </option>
            ))}
          </select>
          {errors.classId ? <p className="text-xs font-semibold text-danger">{errors.classId}</p> : null}
        </div>
      ) : (
        <div className="space-y-3">
          {draft.targetMode === TARGET_MODES.STAFF ? (
            <div className="flex flex-wrap gap-2">
              {['ADMIN', 'NURSE'].map((targetRole) => {
                const roleIds = filteredRecipients
                  .filter((recipient) => recipient.role === targetRole)
                  .map((recipient) => recipient.userId);

                return (
                  <button
                    key={targetRole}
                    type="button"
                    onClick={() => onFieldChange('recipientUserIds', roleIds)}
                    className="app-focus-ring app-btn-secondary min-h-9 px-3 text-xs"
                  >
                    {targetRole === 'ADMIN' ? 'Chọn quản trị' : 'Chọn điều dưỡng'}
                  </button>
                );
              })}
            </div>
          ) : null}
          <NotificationRecipientPicker
            label={config.recipientLabel}
            options={filteredRecipients}
            selectedIds={draft.recipientUserIds}
            onToggle={onToggleRecipient}
            error={errors.recipientUserIds}
          />
        </div>
      )}

      {errors.targetMode ? <p className="text-xs font-semibold text-danger">{errors.targetMode}</p> : null}
    </section>
  );
};

export default NotificationTargetSelector;
