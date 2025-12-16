import { AvailableTimeSlotsDTO } from "@/features/account/types";
import { TimeSlot } from "@/features/account/components/BookingCalendar";

export function toTimeSlots(dto: AvailableTimeSlotsDTO[]): TimeSlot[] {
  return dto.map((s) => ({
    time: s.time,
    available: s.available,
  }));
}
