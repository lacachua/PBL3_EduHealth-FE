import React, { createContext, useCallback, useMemo, useState } from "react";
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from "../../shared/services/tokenClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAccessToken()));

  const login = (payload) => {
    const normalizedUser = payload?.user ?? payload ?? null;
    const token = payload?.accessToken ?? payload?.token;
    const remember = Boolean(payload?.remember);

    if (!normalizedUser || !token) return;

    setStoredUser(normalizedUser, remember);
    setAccessToken(token, remember);

    setUser(normalizedUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Merge partial updates into the current user object and persist to storage.
   * Used after profile/avatar changes so the header and other consumers
   * see the latest data without requiring a full re-login.
   */
  const updateUser = useCallback((partialUser) => {
    if (!partialUser || typeof partialUser !== 'object') return;

    setUser((prev) => {
      if (!prev) return prev;

      const merged = { ...prev, ...partialUser };

      // Persist to whichever storage scope is currently active.
      const hasLocal = Boolean(getStoredUser());
      setStoredUser(merged, hasLocal);

      return merged;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateUser,
      isAuthenticated,
    }),
    [user, isAuthenticated, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };