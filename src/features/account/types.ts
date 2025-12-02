export type UserType = "ADMIN" | "MEMBER" | "GUEST" | string;

export type AppointmentStatus =
  | "BOOKED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

export type LoyaltyTier = "GOLD" | "SILVER" | "BRONZE";

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  memberStatus: UserType;
  loyaltyPoints: number;
  redeemedPoints: number;
  tier: LoyaltyTier;
};

export interface LoyaltyRecord {
  id: string;
  points: number;
  redeemedPoints: number;
  // tierName: string;
}

export interface AppointmentSummaryDTO {
  id: string;
  serviceName: string | null | undefined;
  appointmentTime: string | null | undefined; // ISO LocalDateTime from backend
  appointmentStatus: string | null | undefined;
}

export interface UserDashboardDTO {
  id: string;
  name: string;
  loyaltyRecord: LoyaltyRecord | null;
  appointmentCount: number | null;
  nextApt: AppointmentSummaryDTO | null;
  loyaltyTier: LoyaltyTier;
}

export interface AddOnResponseDTO {
  id: string;
  name: string;
  price: number;
  description: string | null;
}

export interface ServiceResponseDTO {
  id: number;
  categoryName: string;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  addOnIds: number[] | null;
  addOnNames: string[] | null;
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

export interface UpdateUserProfilePayload {
  name: string;
  phoneNumber: string | null;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UserJwtDTO {
  token: string;
}
