import React from 'react';
import RightDrawer from '../core/RightDrawer';

const NurseDrawerShell = ({
  open,
  onClose,
  title,
  subtitle,
  widthClass = 'max-w-[720px]',
  children,
  footer,
  headerActions,
}) => {
  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      widthClass={widthClass}
      headerClassName="border-b border-success/30 bg-success-soft"
      titleClassName="text-success"
      subtitleClassName="text-on-surface-variant"
      closeButtonClassName="border-success/30 bg-white text-on-surface-variant hover:bg-surface-container-low"
      bodyClassName="bg-white"
      footerClassName="bg-white"
      footer={footer}
      headerActions={headerActions}
    >
      {children}
    </RightDrawer>
  );
};

export default NurseDrawerShell;
