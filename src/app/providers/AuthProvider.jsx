import React, { createContext, useCallback, useMemo, useState } from "react";
import {
  clearAuthStorage,
  getAccessToken,
  getActiveStorageScope,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from "../../shared/services/tokenClient";

const AuthContext = createContext(null);

const initAuthState = () => {
  const token = getAccessToken();
  const storedUser = getStoredUser();
  const isValid = Boolean(token && storedUser);
  return {
    user: isValid ? storedUser : null,
    isAuthenticated: isValid,
  };
};

export const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, setAuthState] = useState(initAuthState);

  const login = (payload) => {
    const normalizedUser = payload?.user ?? payload ?? null;
    const token = payload?.accessToken ?? payload?.token;
    const remember = Boolean(payload?.remember);

    if (!normalizedUser || !token) return;

    setStoredUser(normalizedUser, remember);
    setAccessToken(token, remember);

    setAuthState({ user: normalizedUser, isAuthenticated: true });
  };

  const logout = () => {
    clearAuthStorage();
    setAuthState({ user: null, isAuthenticated: false });
  };

  /**
   * Merge partial updates vào user hiện tại và persist đúng scope.
   * Dùng getActiveStorageScope() thay vì đoán mò từ getStoredUser().
   */
  const updateUser = useCallback((partialUser) => {
    if (!partialUser || typeof partialUser !== 'object') return;

    setAuthState((prev) => {
      if (!prev.user) return prev;

      const merged = { ...prev.user, ...partialUser };
      const activeScope = getActiveStorageScope();
      const remember = activeScope === 'local';
      setStoredUser(merged, remember);

      return { ...prev, user: merged };
    });
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, updateUser, isAuthenticated }),
    [user, isAuthenticated, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
