import axiosClient from "../../../shared/api/axiosClient";
import { normalizeApiData } from "../../../shared/api/normalizeResponse";
import { mockAuthAccounts } from "../constants/mockAuthAccounts";

const isMockAuthEnabled = import.meta.env.VITE_ENABLE_MOCK_AUTH !== "false";

const normalizeIdentifier = (value) => value?.trim().toLowerCase();

const createMockToken = (role) => `mock-${role}-token`;

const normalizeAuthPayload = (payload) => {
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

  const response = await axiosClient.post("/auth/login", payload);
  const normalizedData = normalizeApiData(response);
  return normalizeAuthPayload(normalizedData);
};

export const getMe = async () => {
  const response = await axiosClient.get("/auth/me");
  const normalizedData = normalizeApiData(response);

  if (normalizedData && typeof normalizedData === "object" && "user" in normalizedData) {
    return normalizedData.user;
  }

  return normalizedData;
};