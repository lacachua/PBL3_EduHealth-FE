import httpClient from "../../../shared/services/httpClient";
import { mockAuthAccounts } from "../constants/mockAuthAccounts";

const isMockAuthEnabled = import.meta.env.VITE_ENABLE_MOCK_AUTH !== "false";

const normalizeIdentifier = (value) => value?.trim().toLowerCase();

const createMockToken = (role) => `mock-${role}-token`;

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

  const response = await httpClient.post("/auth/login", payload);
  return response.data;
};