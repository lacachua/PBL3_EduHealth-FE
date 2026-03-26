import axiosClient from "../../../shared/api/axiosClient";
import { normalizeApiData, normalizeApiEnvelope } from "../../../shared/api/normalizeResponse";
import {
  AUTH_API_ENDPOINTS,
  buildForgotPasswordRequest,
  buildLoginRequest,
  buildResendOtpRequest,
  buildResetPasswordRequest,
  buildVerifyOtpRequest,
  normalizeLoginResponse,
  normalizeVerifyOtpResponse,
} from "../constants/authApiContract";
import { mockAuthAccounts } from "../constants/mockAuthAccounts";

const isMockAuthEnabled = import.meta.env.VITE_ENABLE_MOCK_AUTH !== "false";

const normalizeIdentifier = (value) => value?.trim().toLowerCase();

const createMockToken = (role) => `mock-${role}-token`;

const wait = (duration = 500) => new Promise((resolve) => {
  setTimeout(resolve, duration);
});

const createMockSuccessResponse = async (payload) => {
  await wait();
  return { success: true, ...payload };
};

const postAuth = async (endpoint, payload) => {
  const response = await axiosClient.post(endpoint, payload);
  const envelope = normalizeApiEnvelope(response);

  if (envelope.success === false) {
    const error = new Error(envelope.message || "Request failed");
    error.response = { data: response?.data };
    throw error;
  }

  return normalizeApiData(response);
};

const mockLogin = async (payload) => {
  const identifier = normalizeIdentifier(payload?.identifier);
  const password = payload?.password;

  const matchedAccount = mockAuthAccounts.find(
    (account) =>
      normalizeIdentifier(account.identifier) === identifier &&
      account.password === password
  );

  if (!matchedAccount) {
    const error = new Error("Thông tin đăng nhập không hợp lệ");
    error.response = { data: { message: "Thông tin đăng nhập không hợp lệ" } };
    throw error;
  }

  return {
    user: {
      email: matchedAccount.identifier,
      fullName: matchedAccount.fullName,
      role: matchedAccount.role,
    },
    accessToken: createMockToken(matchedAccount.role),
  };
};

export const login = async (payload) => {
  if (isMockAuthEnabled) {
    return mockLogin(payload);
  }

  const requestPayload = buildLoginRequest(payload);
  const normalizedData = await postAuth(AUTH_API_ENDPOINTS.login, requestPayload);
  return normalizeLoginResponse(normalizedData);
};

export const getMe = async () => {
  const response = await axiosClient.get(AUTH_API_ENDPOINTS.me);
  const envelope = normalizeApiEnvelope(response);

  if (envelope.success === false) {
    const error = new Error(envelope.message || "Request failed");
    error.response = { data: response?.data };
    throw error;
  }

  const normalizedData = envelope.data;

  if (normalizedData && typeof normalizedData === "object" && "user" in normalizedData) {
    return normalizedData.user;
  }

  return normalizedData;
};

export const requestPasswordOtp = async (payload) => {
  const requestPayload = buildForgotPasswordRequest(payload);

  if (isMockAuthEnabled) {
    return createMockSuccessResponse(requestPayload);
  }

  return postAuth(AUTH_API_ENDPOINTS.forgotPassword, requestPayload);
};

export const verifyPasswordOtp = async (payload) => {
  const requestPayload = buildVerifyOtpRequest(payload);

  if (isMockAuthEnabled) {
    const mockResponse = await createMockSuccessResponse(requestPayload);
    return normalizeVerifyOtpResponse({
      ...mockResponse,
      resetToken: "mock-reset-token",
    });
  }

  const responseData = await postAuth(AUTH_API_ENDPOINTS.verifyOtp, requestPayload);
  return normalizeVerifyOtpResponse(responseData);
};

export const resetPassword = async (payload) => {
  const requestPayload = buildResetPasswordRequest(payload);

  if (isMockAuthEnabled) {
    return createMockSuccessResponse(requestPayload);
  }

  return postAuth(AUTH_API_ENDPOINTS.resetPassword, requestPayload);
};

export const resendPasswordOtp = async (payload) => {
  const requestPayload = buildResendOtpRequest(payload);

  if (isMockAuthEnabled) {
    return createMockSuccessResponse(requestPayload);
  }

  return postAuth(AUTH_API_ENDPOINTS.resendOtp, requestPayload);
};