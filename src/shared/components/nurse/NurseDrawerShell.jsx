import React from 'react';
import RightDrawer from '../admin/RightDrawer';

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
      headerClassName="border-b border-[#D7ECDD] bg-[#EDF7F1]"
      titleClassName="text-[#14532D]"
      subtitleClassName="text-[#4B5563]"
      closeButtonClassName="border-[#D7ECDD] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
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
