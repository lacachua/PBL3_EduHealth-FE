export const AUTH_API_ENDPOINTS = {
  login: "/auth/login",
  me: "/auth/me",
  forgotPassword: "/auth/forgot-password/request-otp",
  verifyOtp: "/auth/forgot-password/verify-otp",
  resendOtp: "/auth/forgot-password/request-otp",
  resetPassword: "/auth/forgot-password/reset",
};

export const buildLoginRequest = ({ identifier, password }) => ({
  username: identifier,
  identifier,
  password,
});

export const buildForgotPasswordRequest = ({ identifier }) => ({
  username: identifier,
  email: identifier,
  identifier,
});

export const buildVerifyOtpRequest = ({ identifier, otp }) => ({
  username: identifier,
  email: identifier,
  identifier,
  otp,
});

export const buildResendOtpRequest = ({ identifier }) => ({
  username: identifier,
  email: identifier,
  identifier,
});

export const buildResetPasswordRequest = ({ identifier, otp, resetToken, newPassword }) => {
  const payload = {
    identifier,
    newPassword,
  };

  if (otp) payload.otp = otp;
  if (resetToken) payload.resetToken = resetToken;

  return payload;
};

export const normalizeLoginResponse = (payload) => {
  if (!payload || typeof payload !== "object") {
    return { user: null, accessToken: null };
  }

  const normalizedUser = payload.user || payload.account || null;
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