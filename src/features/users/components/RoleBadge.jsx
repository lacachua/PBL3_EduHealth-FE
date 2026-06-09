import React from 'react';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import { ROLE_LABEL_MAP, ROLE_TONE_MAP } from '../constants/userManagementConstants';

const RoleBadge = ({ role, label }) => (
  <StatusBadge tone={ROLE_TONE_MAP[role] || 'neutral'}>
    {label || ROLE_LABEL_MAP[role] || role || '--'}
  </StatusBadge>
);

export default RoleBadge;
