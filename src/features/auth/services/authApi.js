import { apiGetData, apiPostData } from "../../../shared/api/apiClient";
import { runtimeConfig, waitForMock } from "../../../shared/config/runtimeConfig";
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

const isMockAuthEnabled = runtimeConfig.enableMockAuth;

const normalizeIdentifier = (value) => value?.trim().toLowerCase();

const createMockToken = (role) => `mock-${role}-token`;

const createMockSuccessResponse = async (payload) => {
  await waitForMock("auth");
  return { success: true, ...payload };
};

const postAuth = (endpoint, payload) => apiPostData(endpoint, payload);

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
  const normalizedData = await apiGetData(AUTH_API_ENDPOINTS.me);

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