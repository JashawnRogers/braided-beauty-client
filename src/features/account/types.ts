// ----------------- ENUMS -------------------------
export type UserType = "ADMIN" | "MEMBER" | "GUEST" | string;

export type PaymentStatus =
  | "PENDING_PAYMENT"
  | "PAID_DEPOSIT"
  | "PAID_IN_FULL"
  | "PAYMENT_FAILED"
  | "REFUNDED"
  | "NO_DEPOSIT_REQUIRED";

export type LoyaltyTier = "GOLD" | "SILVER" | "BRONZE";

export type AppointmentStatus =
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW"
  | "PENDING_CONFIRMATION";

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type AvailableTimeSlotsDTO = {
  time: string;
  available: boolean;
  startTime: string;
  endTime: string;
};

// ---------------- USER ---------------
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  memberStatus: UserType;
  loyaltyPoints: number;
  redeemedPoints: number;
  loyaltyTier: LoyaltyTier;
  oAuthProvider: string;
  oAuthSubject: string;
  isOAuthAccount: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface UserDashboardDTO {
  id: string;
  name: string;
  loyaltyRecord: LoyaltyRecord | null;
  appointmentCount: number | null;
  nextApt: AppointmentSummaryDTO | null;
  loyaltyTier: LoyaltyTier;
}

export interface UpdateUserProfilePayload {
  name: string;
  phoneNumber: string | null;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface UserJwtDTO {
  token: string;
}

export interface LoyaltyRecord {
  id: string;
  points: number;
  redeemedPoints: number;
  // tierName: string;
}

// ------------- APPOINTMENTS ---------------------
export interface AppointmentSummaryDTO {
  id: string;
  serviceName: string | null | undefined;
  appointmentTime: string | null | undefined; // ISO LocalDateTime from backend
  appointmentStatus: string | null | undefined;
}

export interface CreateAppointmentDTO {
  appointmentTime: string;
  serviceId: string;
  receiptEmail: string | null;
  note: string | null;
  addOnIds: string[] | null;
}

export interface AppointmentResponseDTO {
  id: string;
  appointmentTime: string;
  appointmentStatus: AppointmentStatus;
  service: ServiceResponseDTO;
  depositAmount: number;
  paymentStatus: PaymentStatus;
  pointsEarned: number | null;
  note: string | null;
}

export interface AdminAppointmentRequestDTO {
  appointmentId: string;
  note: string | null;
  cancelReason: string | null;
  appointmentStatus: AppointmentStatus;
  appointmentTime: string;
  serviceId: string;
  addOnIds: string[] | null;
  tipAmount: number | null;
  discountAmount?: number | null;
  discountPercent?: number | null;
}

export interface AdminAppointmentSummaryDTO {
  id: string;
  appointmentTime: string;
  appointmentStatus: AppointmentStatus;
  serviceId: string;
  serviceName: string;
  addOnIds: string[] | null;
  paymentStatus: PaymentStatus;
  remainingBalance: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  tipAmount: number;
  discountAmount?: number | null;
  discountPercent?: number | null;
}

// -------------- SERVICE ----------------
export interface AddOnResponseDTO {
  id: string;
  name: string;
  price: number;
  description: string | null;
  durationMinutes: number;
}

export interface ServiceResponseDTO {
  id: number;
  categoryName: string;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  addOns: AddOnResponseDTO[];
  durationMinutes: number;
  coverImageUrl: string;
  photoUrls: string[];
}

export interface ServiceCategoryResponseDTO {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
}

export interface UserMemberProfile {
  id: string;
  name: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  phoneNumber?: string;
  userType?: UserType | null;
  appointments: AppointmentSummaryDTO[];
  loyaltyRecord?: LoyaltyRecord | null;
  loyaltyTier: LoyaltyTier;
}

// -------------- PAYMENT ----------------
export interface CheckoutSessionResponse {
  checkoutUrl: string | null;
  appointmentId: string;
  paymentRequired: boolean;
  confirmationToken: string | null;
}
