import { apiPost, apiPublicPost } from "@/lib/apiClient";

export type ForgotPasswordPayload = {
  email: string;
};

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  apiPublicPost<void>("/auth/forgot-password", payload);

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export const resetPassword = (payload: ResetPasswordPayload) =>
  apiPublicPost<void>("/auth/reset-password", payload);

export type BootstrapAdminPayload = {
  secret: string;
};

export const bootstrapAdmin = (payload: BootstrapAdminPayload) =>
  apiPost<void>("/auth/bootstrap-admin", payload);
