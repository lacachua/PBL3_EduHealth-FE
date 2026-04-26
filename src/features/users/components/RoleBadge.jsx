import React from 'react';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import { ROLE_TONE_MAP } from '../schemas/userManagementSchema';

const RoleBadge = ({ role, label }) => (
  <StatusBadge tone={ROLE_TONE_MAP[role] || 'neutral'}>
    {label}
  </StatusBadge>
);

export default RoleBadge;
