import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/useAuth';
import { mainOffsetClasses } from '../constants/shellLayout';

export const useRoleShell = ({ accountPath }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigateAccount = () => {
    if (accountPath) {
      navigate(accountPath);
    }
  };

  const mainOffsetClass = isSidebarCollapsed ? mainOffsetClasses.collapsed : mainOffsetClasses.expanded;

  return {
    user,
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    closeSidebar,
    isNotificationsOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
    handleLogout,
    handleNavigateAccount,
    mainOffsetClass,
  };
};
