import React from 'react';
import ConfirmDialog from '../../../shared/components/admin/ConfirmDialog';

const ConfirmActionDialog = ({
  open,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}) => {
  return (
    <ConfirmDialog
      open={open}
      title={title}
      message={message}
      confirmLabel={confirmLabel}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
};

export default ConfirmActionDialog;
