import React, { createContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const parseStoredUser = (value) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStoredToken = () =>
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const localUser = parseStoredUser(localStorage.getItem("user"));
    const sessionUser = parseStoredUser(sessionStorage.getItem("user"));
    return localUser || sessionUser;
  });

  const login = (payload) => {
    const normalizedUser = payload?.user ?? payload ?? null;
    const token = payload?.accessToken ?? payload?.token;
    const remember = Boolean(payload?.remember);

    if (!normalizedUser || !token) {
      return;
    }

    if (remember) {
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("accessToken", token);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
    } else {
      sessionStorage.setItem("user", JSON.stringify(normalizedUser));
      sessionStorage.setItem("accessToken", token);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }

    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(getStoredToken()),
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