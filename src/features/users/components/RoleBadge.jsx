import React from 'react';
import { ACCOUNT_ROLE_BADGE_CLASS_MAP } from '../constants/accountUiTokens';
import AccountPill from './AccountPill';

const RoleBadge = ({ role, label }) => (
  <AccountPill className={ACCOUNT_ROLE_BADGE_CLASS_MAP[role] || 'border-[#D8E3DE] bg-[#F7FAF8] text-[#42534D]'}>
    {label}
  </AccountPill>
);

export default RoleBadge;
