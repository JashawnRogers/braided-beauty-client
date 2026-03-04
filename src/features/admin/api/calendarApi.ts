import { httpClient } from "@/lib/httpClient";

export type AdminScheduleCalendar = {
  id: string;
  name: string;
  color: string;
  active: boolean;
  maxBookingsPerDay: number | null;
  bookingOpenAt: string | null;
  bookingCloseAt: string | null;
};

export type AdminCalendarEventDto = {
  appointmentId: string | number;
  serviceName: string;
  appointmentTime: string;
  durationMinutes: number;
  calendarId: string | number;
  calendarName: string;
  calendarColor: string;
  appointmentStatus: string;
};

export type WeeklyHoursRow = {
  dayOfWeek: string;
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;
};

export type CalendarOverrideRow = {
  date: string;
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;
};

export type AdminServiceLite = {
  id: string;
  name: string;
  scheduleCalendarId: string | null;
};

export type CreateCalendarInput = {
  name: string;
  color: string;
  active: boolean;
  maxBookingsPerDay: number | null;
  bookingOpenAt: string | null;
  bookingCloseAt: string | null;
};

const resolveAdminApiBase = () => {
  const base = String(import.meta.env.VITE_SERVER_API_URL ?? "").replace(
    /\/+$/,
    ""
  );

  if (base.endsWith("/api/v1")) {
    return `${base}/admin`;
  }

  return `${base}/api/v1/admin`;
};

const extractArray = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object"
    );
  }

  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const keys = ["data", "items", "content", "calendars", "events", "overrides"];
    for (const key of keys) {
      const candidate = source[key];
      if (Array.isArray(candidate)) {
        return candidate.filter(
          (item): item is Record<string, unknown> =>
            item !== null && typeof item === "object"
        );
      }
    }
  }

  return [];
};

const adminFetch = async <T>(url: string): Promise<T> => {
  const response = await httpClient(url, { method: "GET" });
  return (response?.json ?? []) as T;
};

const adminSend = async <T>(
  url: string,
  method: "POST" | "PUT" | "PATCH",
  body: unknown
): Promise<T> => {
  const response = await httpClient(url, {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return (response?.json ?? {}) as T;
};

const adminDelete = async (url: string): Promise<void> => {
  await httpClient(url, { method: "DELETE" });
};

export const fetchAdminCalendars = async (): Promise<AdminScheduleCalendar[]> => {
  const payload = await adminFetch<unknown>(`${resolveAdminApiBase()}/calendars`);
  const rows = extractArray(payload);

  return rows
    .map((row) => {
      const id = String(row.calendarId ?? row.id ?? "").trim();
      if (!id) return null;

      const maxBookingsRaw = row.maxBookingsPerDay;

      return {
        id,
        name: String(row.calendarName ?? row.name ?? "Unnamed calendar"),
        color: String(row.calendarColor ?? row.color ?? "#0ea5e9"),
        active: Boolean(row.active ?? row.isActive ?? true),
        maxBookingsPerDay:
          typeof maxBookingsRaw === "number" ? maxBookingsRaw : null,
        bookingOpenAt:
          typeof row.bookingOpenAt === "string" ? row.bookingOpenAt : null,
        bookingCloseAt:
          typeof row.bookingCloseAt === "string" ? row.bookingCloseAt : null,
      };
    })
    .filter((row): row is AdminScheduleCalendar => row !== null);
};

export const fetchAdminCalendarEvents = async (
  start: string,
  end: string
): Promise<AdminCalendarEventDto[]> => {
  const query = new URLSearchParams({ start, end });
  const payload = await adminFetch<unknown>(
    `${resolveAdminApiBase()}/calendars/events?${query.toString()}`
  );
  const rows = extractArray(payload);

  return rows
    .map((row) => {
      const appointmentId = row.appointmentId ?? row.id;
      const appointmentTime = row.appointmentTime ?? row.start ?? row.startTime;

      if (appointmentId == null || typeof appointmentTime !== "string") {
        return null;
      }

      const durationRaw =
        row.durationMinutes ?? row.serviceDurationMinutes ?? row.duration ?? 0;
      const durationMinutes = Number(durationRaw);

      return {
        appointmentId,
        serviceName: String(row.serviceName ?? row.title ?? "Service"),
        appointmentTime,
        durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 0,
        calendarId: row.calendarId ?? "",
        calendarName: String(row.calendarName ?? ""),
        calendarColor: String(row.calendarColor ?? "#0ea5e9"),
        appointmentStatus: String(row.appointmentStatus ?? "UNKNOWN"),
      };
    })
    .filter((row): row is AdminCalendarEventDto => row !== null);
};

export const createAdminCalendar = async (
  payload: CreateCalendarInput
): Promise<AdminScheduleCalendar> => {
  const response = await adminSend<Record<string, unknown>>(
    `${resolveAdminApiBase()}/calendars`,
    "POST",
    payload
  );

  const calendarId = String(response.calendarId ?? response.id ?? "");
  if (!calendarId) {
    throw new Error("Calendar created but id was not returned");
  }

  return {
    id: calendarId,
    name: String(response.calendarName ?? response.name ?? payload.name),
    color: String(response.calendarColor ?? response.color ?? payload.color),
    active: Boolean(response.active ?? response.isActive ?? payload.active),
    maxBookingsPerDay:
      typeof response.maxBookingsPerDay === "number"
        ? response.maxBookingsPerDay
        : payload.maxBookingsPerDay,
    bookingOpenAt:
      typeof response.bookingOpenAt === "string"
        ? response.bookingOpenAt
        : payload.bookingOpenAt,
    bookingCloseAt:
      typeof response.bookingCloseAt === "string"
        ? response.bookingCloseAt
        : payload.bookingCloseAt,
  };
};

export const saveCalendarHours = async (
  calendarId: string,
  weeklyHours: WeeklyHoursRow[]
) => {
  const url = `${resolveAdminApiBase()}/calendars/${calendarId}/hours`;

  // Support either array or wrapped object depending on backend contract.
  try {
    await adminSend(url, "PUT", weeklyHours);
  } catch {
    await adminSend(url, "PUT", { hours: weeklyHours });
  }
};

export const assignServicesToCalendar = async (
  calendarId: string,
  serviceIds: string[]
) => {
  await Promise.all(
    serviceIds.map((id) =>
      adminSend(
        `${resolveAdminApiBase()}/service/${id}`,
        "PATCH",
        { scheduleCalendarId: calendarId }
      )
    )
  );
};

export const fetchAdminServices = async (): Promise<AdminServiceLite[]> => {
  const query = new URLSearchParams({
    page: "0",
    size: "200",
    sort: "name,ASC",
  });
  const payload = await adminFetch<unknown>(
    `${resolveAdminApiBase()}/service?${query.toString()}`
  );
  const rows = extractArray(payload);

  return rows
    .map((row) => {
      const id = row.id;
      const name = row.name;
      if (id == null || typeof name !== "string") return null;
      const scheduleCalendarIdRaw =
        row.scheduleCalendarId ?? row.calendarId ?? null;
      return {
        id: String(id),
        name,
        scheduleCalendarId:
          scheduleCalendarIdRaw == null ? null : String(scheduleCalendarIdRaw),
      };
    })
    .filter((row): row is AdminServiceLite => row !== null);
};

export const fetchCalendarHours = async (
  calendarId: string
): Promise<WeeklyHoursRow[]> => {
  const payload = await adminFetch<unknown>(
    `${resolveAdminApiBase()}/calendars/${calendarId}/hours`
  );
  const rows = extractArray(payload);

  return rows
    .map((row) => {
      const dayOfWeek = row.dayOfWeek;
      if (typeof dayOfWeek !== "string") return null;

      return {
        dayOfWeek,
        isClosed: Boolean(row.isClosed ?? row.closed ?? false),
        openTime: typeof row.openTime === "string" ? row.openTime : null,
        closeTime: typeof row.closeTime === "string" ? row.closeTime : null,
      };
    })
    .filter((row): row is WeeklyHoursRow => row !== null);
};

export const fetchCalendarOverrides = async (
  calendarId: string,
  start: string,
  end: string
): Promise<CalendarOverrideRow[]> => {
  const query = new URLSearchParams({ start, end });
  const payload = await adminFetch<unknown>(
    `${resolveAdminApiBase()}/calendars/${calendarId}/overrides?${query.toString()}`
  );
  const rows = extractArray(payload);

  return rows
    .map((row) => {
      const date = row.date;
      if (typeof date !== "string") return null;

      return {
        date,
        isClosed: Boolean(row.isClosed ?? row.closed ?? false),
        openTime: typeof row.openTime === "string" ? row.openTime : null,
        closeTime: typeof row.closeTime === "string" ? row.closeTime : null,
      };
    })
    .filter((row): row is CalendarOverrideRow => row !== null);
};

export const upsertCalendarOverrides = async (
  calendarId: string,
  overrides: CalendarOverrideRow[]
) => {
  const base = `${resolveAdminApiBase()}/calendars/${calendarId}/overrides`;
  const payload = { overrides };
  await adminSend(base, "PUT", payload);
};

export const updateAdminCalendar = async (
  calendarId: string,
  payload: CreateCalendarInput
): Promise<AdminScheduleCalendar> => {
  const url = `${resolveAdminApiBase()}/calendars/${calendarId}`;
  let response: Record<string, unknown>;
  try {
    response = await adminSend<Record<string, unknown>>(url, "PATCH", payload);
  } catch {
    response = await adminSend<Record<string, unknown>>(url, "PUT", payload);
  }

  return {
    id: String(response.calendarId ?? response.id ?? calendarId),
    name: String(response.calendarName ?? response.name ?? payload.name),
    color: String(response.calendarColor ?? response.color ?? payload.color),
    active: Boolean(response.active ?? response.isActive ?? payload.active),
    maxBookingsPerDay:
      typeof response.maxBookingsPerDay === "number"
        ? response.maxBookingsPerDay
        : payload.maxBookingsPerDay,
    bookingOpenAt:
      typeof response.bookingOpenAt === "string"
        ? response.bookingOpenAt
        : payload.bookingOpenAt,
    bookingCloseAt:
      typeof response.bookingCloseAt === "string"
        ? response.bookingCloseAt
        : payload.bookingCloseAt,
  };
};

export const patchServiceScheduleCalendar = async (
  serviceId: string,
  scheduleCalendarId: string | null
) => {
  await adminSend(
    `${resolveAdminApiBase()}/service/${serviceId}`,
    "PATCH",
    { scheduleCalendarId }
  );
};

export const deleteAdminCalendar = async (
  calendarId: string
): Promise<void> => {
  await adminDelete(`${resolveAdminApiBase()}/calendars/${calendarId}`);
};
