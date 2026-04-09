import { authRepository } from '../repositories/authRepository';

export const login = async (payload) => {
  return authRepository.login(payload);
};

export const getMe = async () => {
  return authRepository.getMe();
};

export const requestPasswordOtp = async (payload) => {
  return authRepository.requestPasswordOtp(payload);
};

export const verifyPasswordOtp = async (payload) => {
  return authRepository.verifyPasswordOtp(payload);
};

export const resetPassword = async (payload) => {
  return authRepository.resetPassword(payload);
};

export const resendPasswordOtp = async (payload) => {
  return authRepository.resendPasswordOtp(payload);
};