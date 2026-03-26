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

  const login = (payload) => {
    const normalizedUser = payload?.user ?? payload ?? null;
    const token = payload?.accessToken ?? payload?.token;
    const remember = Boolean(payload?.remember);

    if (!normalizedUser || !token) {
      return;
    }

    setStoredUser(normalizedUser, remember);
    setAccessToken(token, remember);

    setUser(normalizedUser);
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(getAccessToken()),
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };