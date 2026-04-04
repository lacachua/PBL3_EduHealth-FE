export const AUTH_API_ENDPOINTS = {
  login: "/api/v1/auth/login",
  me: "/api/v1/auth/me",
  forgotPassword: "/api/v1/auth/forgot-password/request-otp",
  verifyOtp: "/api/v1/auth/forgot-password/verify-otp",
  resendOtp: "/api/v1/auth/forgot-password/request-otp",
  resetPassword: "/api/v1/auth/forgot-password/reset",
};

export const buildLoginRequest = ({ identifier, password }) => ({
  identifier,
  password,
});

export const buildForgotPasswordRequest = ({ identifier }) => ({
  email: identifier,
});

export const buildVerifyOtpRequest = ({ identifier, otp }) => ({
  email: identifier,
  otp,
});

export const buildResendOtpRequest = ({ identifier }) => ({
  email: identifier,
});

export const buildResetPasswordRequest = ({ identifier, resetToken, newPassword, confirmPassword }) => {
  const payload = {
    email: identifier,
    resetToken,
    newPassword,
    confirmPassword: confirmPassword || newPassword,
  };

  return payload;
};

export const normalizeLoginResponse = (payload) => {
  if (!payload || typeof payload !== "object") {
    return { user: null, accessToken: null };
  }

  const extractFlatUser = (value) => {
    if (!value || typeof value !== "object") {
      return null;
    }

    const rest = Object.fromEntries(
      Object.entries(value).filter(
        ([key]) => !["accessToken", "token", "jwt", "expiresAt"].includes(key)
      )
    );
    return Object.keys(rest).length ? rest : null;
  };

  const normalizedUser = payload.user || payload.account || extractFlatUser(payload) || null;
  const normalizedToken = payload.accessToken || payload.token || payload.jwt || null;

  return {
    user: normalizedUser,
    accessToken: normalizedToken,
  };
};

export const normalizeVerifyOtpResponse = (payload) => {
  if (!payload || typeof payload !== "object") {
    return { resetToken: null };
  }

  return {
    ...payload,
    resetToken: payload.resetToken || payload.token || payload.reset_token || null,
  };
};