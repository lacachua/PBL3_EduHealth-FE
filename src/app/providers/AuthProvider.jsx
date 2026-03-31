import React, { createContext, useMemo, useState } from "react";
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

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
    }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };