import React from 'react';
import { ACCOUNT_ROLE_BADGE_CLASS_MAP } from '../constants/accountUiTokens';
import AccountPill from './AccountPill';

const RoleBadge = ({ role, label }) => (
  <AccountPill className={ACCOUNT_ROLE_BADGE_CLASS_MAP[role] || 'border-outline-variant bg-surface-container-high text-on-surface-variant'}>
    {label}
  </AccountPill>
);

export default RoleBadge;
