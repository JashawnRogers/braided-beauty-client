const BOOKING_HOLD_STORAGE_KEY = "bookingHold";

export type BookingHoldState = Readonly<{
  appointmentId: string;
  serviceId: string;
  categoryId?: string | number | null;
}>;

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function getStoredBookingHold(): BookingHoldState | null {
  if (!canUseSessionStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(BOOKING_HOLD_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<BookingHoldState>;
    if (!parsed.appointmentId || !parsed.serviceId) return null;

    return {
      appointmentId: parsed.appointmentId,
      serviceId: parsed.serviceId,
      categoryId: parsed.categoryId ?? null,
    };
  } catch {
    return null;
  }
}

export function storeBookingHold(state: BookingHoldState) {
  if (!canUseSessionStorage()) return;

  window.sessionStorage.setItem(BOOKING_HOLD_STORAGE_KEY, JSON.stringify(state));
}

export function clearStoredBookingHold() {
  if (!canUseSessionStorage()) return;

  window.sessionStorage.removeItem(BOOKING_HOLD_STORAGE_KEY);
}
