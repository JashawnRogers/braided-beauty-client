export type AdminScheduleCalendar = {
  id: string;
  name: string;
  color: string;
  active: boolean;
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
    const keys = ["data", "items", "content", "calendars", "events"];
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
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return [] as T;
  }

  return (await response.json()) as T;
};

export const fetchAdminCalendars = async (): Promise<AdminScheduleCalendar[]> => {
  const payload = await adminFetch<unknown>(`${resolveAdminApiBase()}/calendars`);
  const rows = extractArray(payload);

  return rows
    .map((row) => {
      const id = String(row.calendarId ?? row.id ?? "").trim();
      if (!id) return null;

      const name = String(row.calendarName ?? row.name ?? "Unnamed calendar");
      const color = String(row.calendarColor ?? row.color ?? "#0ea5e9");
      const active = Boolean(row.active ?? row.isActive ?? true);

      return { id, name, color, active };
    })
    .filter((row): row is AdminScheduleCalendar => row !== null);
};

export const fetchAdminCalendarEvents = async (
  start: string,
  end: string
): Promise<AdminCalendarEventDto[]> => {
  const query = new URLSearchParams({ start, end });
  const payload = await adminFetch<unknown>(
    `${resolveAdminApiBase()}/calendar-events?${query.toString()}`
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
