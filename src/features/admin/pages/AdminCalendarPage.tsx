import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  type ToolbarProps,
  type View,
  Views,
} from "react-big-calendar";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAdminCalendar,
  deleteAdminCalendar,
  fetchAdminCalendars,
  fetchAdminServices,
  fetchCalendarHours,
  fetchCalendarOverrides,
  patchServiceScheduleCalendar,
  saveCalendarHours,
  updateAdminCalendar,
  type AdminScheduleCalendar,
  type AdminServiceLite,
  type CalendarOverrideRow,
  type WeeklyHoursRow,
} from "@/features/admin/api/calendarApi";
import "react-big-calendar/lib/css/react-big-calendar.css";

type WeeklyHourInput = WeeklyHoursRow & { dayLabel: string };
type ModalMode = "create" | "edit";

type CalendarForm = {
  name: string;
  color: string;
  active: boolean;
  maxBookingsPerDay: string;
  bookingOpenAt: string;
  bookingCloseAt: string;
};

type AvailabilityEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: {
    calendarId: string;
    calendarName: string;
    calendarColor: string;
  };
};

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DAY_ENUM_BY_INDEX = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

const DAYS: Array<{ key: (typeof DAY_ENUM_BY_INDEX)[number]; label: string }> =
  [
    { key: "MONDAY", label: "Mon" },
    { key: "TUESDAY", label: "Tue" },
    { key: "WEDNESDAY", label: "Wed" },
    { key: "THURSDAY", label: "Thu" },
    { key: "FRIDAY", label: "Fri" },
    { key: "SATURDAY", label: "Sat" },
    { key: "SUNDAY", label: "Sun" },
  ];

const TIME_OPTIONS = (() => {
  const values: string[] = [];
  for (let m = 6 * 60; m <= 22 * 60; m += 30) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    values.push(`${hh}:${mm}:00`);
  }
  return values;
})();

const formatTimeLabel = (hms: string) => {
  const [hourStr = "0", minuteStr = "00"] = hms.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return hms;

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = ((hour + 11) % 12) + 1;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
};

const defaultForm: CalendarForm = {
  name: "",
  color: "#0ea5e9",
  active: true,
  maxBookingsPerDay: "",
  bookingOpenAt: "",
  bookingCloseAt: "",
};

const defaultWeeklyHours: WeeklyHourInput[] = DAYS.map((d) => ({
  dayOfWeek: d.key,
  dayLabel: d.label,
  isClosed: false,
  openTime: "09:00:00",
  closeTime: "17:00:00",
}));

const toIsoLocalDate = (value: Date) => format(value, "yyyy-MM-dd");
const GRID_MIN_TIME = new Date(1970, 0, 1, 6, 0, 0, 0);
const GRID_MAX_TIME = new Date(1970, 0, 1, 22, 0, 0, 0);

const parseHmsToDate = (day: Date, hms: string): Date => {
  const [h = "0", m = "0", s = "0"] = hms.split(":");
  const hours = Number(h);
  const minutes = Number(m);
  const seconds = Number(s);
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    Number.isFinite(seconds) ? seconds : 0,
    0
  );
};

const toDatetimeLocalInput = (value: string | null) => {
  if (!value) return "";
  // Strip timezone/offset if present
  const noZone = value.replace(/Z$/, "").replace(/([+-]\d{2}:\d{2})$/, "");
  // Drop seconds if present; datetime-local expects yyyy-MM-ddTHH:mm
  return noZone.length >= 16 ? noZone.slice(0, 16) : "";
};

const normalizeDateTimeInput = (value: string) => {
  if (!value) return null;
  return value.length === 16 ? `${value}:00` : value.slice(0, 19);
};

const shortLabel = (name: string) =>
  name.length > 14 ? `${name.slice(0, 12)}...` : name;

const getRangeForView = (date: Date, view: View) => {
  if (view === Views.MONTH) {
    return {
      start: startOfWeek(startOfMonth(date), { weekStartsOn: 0 }),
      end: endOfWeek(endOfMonth(date), { weekStartsOn: 0 }),
    };
  }
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  };
};

const withAlpha = (hex: string, alphaHex: string) => {
  const normalized = hex.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(normalized)) return `${normalized}${alphaHex}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(normalized)) {
    const r = normalized[1];
    const g = normalized[2];
    const b = normalized[3];
    return `#${r}${r}${g}${g}${b}${b}${alphaHex}`;
  }
  return normalized;
};

function CalendarToolbar(props: ToolbarProps<AvailabilityEvent>) {
  const { onNavigate, onView, view, label } = props;
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => onNavigate("PREV")}>
          Prev
        </Button>
        <Button size="sm" variant="outline" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <Button size="sm" variant="outline" onClick={() => onNavigate("NEXT")}>
          Next
        </Button>
      </div>
      <div className="text-sm font-medium">{label}</div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={view === Views.MONTH ? "default" : "outline"}
          onClick={() => onView(Views.MONTH)}
        >
          Month
        </Button>
        <Button
          size="sm"
          variant={view === Views.WEEK ? "default" : "outline"}
          onClick={() => onView(Views.WEEK)}
        >
          Week
        </Button>
      </div>
    </div>
  );
}

export default function AdminCalendarPage() {
  const initializedSelection = useRef(false);

  const [calendars, setCalendars] = useState<AdminScheduleCalendar[]>([]);
  const [services, setServices] = useState<AdminServiceLite[]>([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<Set<string>>(
    new Set()
  );
  const [hoursByCalendar, setHoursByCalendar] = useState<
    Record<string, WeeklyHoursRow[]>
  >({});
  const [overridesByCalendar, setOverridesByCalendar] = useState<
    Record<string, Map<string, CalendarOverrideRow>>
  >({});

  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingCalendarId, setEditingCalendarId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [calendarForm, setCalendarForm] = useState<CalendarForm>(defaultForm);
  const [weeklyHours, setWeeklyHours] =
    useState<WeeklyHourInput[]>(defaultWeeklyHours);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    new Set()
  );
  const [serviceSearch, setServiceSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFormField = <K extends keyof CalendarForm>(
    key: K,
    value: CalendarForm[K]
  ) => {
    setCalendarForm((prev) => ({ ...prev, [key]: value }));
  };

  const setDayHours = (
    dayOfWeek: string,
    patch: Partial<Omit<WeeklyHourInput, "dayOfWeek" | "dayLabel">>
  ) => {
    setWeeklyHours((prev) =>
      prev.map((row) =>
        row.dayOfWeek === dayOfWeek ? { ...row, ...patch } : row
      )
    );
  };

  const loadCalendars = useCallback(async () => {
    const rows = await fetchAdminCalendars();
    setCalendars(rows);

    setSelectedCalendarIds((prev) => {
      if (!initializedSelection.current) {
        initializedSelection.current = true;
        const activeIds = rows
          .filter((item) => item.active)
          .map((item) => item.id);
        const defaults =
          activeIds.length > 0 ? activeIds : rows.map((item) => item.id);
        return new Set(defaults);
      }
      const validIds = new Set(rows.map((item) => item.id));
      const next = new Set([...prev].filter((id) => validIds.has(id)));
      if (next.size > 0) return next;
      const activeIds = rows
        .filter((item) => item.active)
        .map((item) => item.id);
      const defaults =
        activeIds.length > 0 ? activeIds : rows.map((item) => item.id);
      return new Set(defaults);
    });
  }, []);

  const loadServices = useCallback(async () => {
    const rows = await fetchAdminServices();
    setServices(rows);
  }, []);

  const loadAvailabilityForSelected = useCallback(async () => {
    if (selectedCalendarIds.size === 0) {
      setHoursByCalendar({});
      setOverridesByCalendar({});
      return;
    }

    const selectedIds = [...selectedCalendarIds];
    const range = getRangeForView(date, view);
    const start = toIsoLocalDate(range.start);
    const end = toIsoLocalDate(range.end);

    const hoursPairs = await Promise.all(
      selectedIds.map(async (calendarId) => {
        try {
          const rows = await fetchCalendarHours(calendarId);
          return [calendarId, rows] as const;
        } catch {
          return [calendarId, []] as const;
        }
      })
    );

    const overridesPairs = await Promise.all(
      selectedIds.map(async (calendarId) => {
        try {
          const rows = await fetchCalendarOverrides(calendarId, start, end);
          return [
            calendarId,
            new Map(rows.map((row) => [row.date, row])),
          ] as const;
        } catch {
          return [calendarId, new Map<string, CalendarOverrideRow>()] as const;
        }
      })
    );

    setHoursByCalendar((prev) => ({
      ...prev,
      ...Object.fromEntries(hoursPairs),
    }));
    setOverridesByCalendar((prev) => ({
      ...prev,
      ...Object.fromEntries(overridesPairs),
    }));
  }, [date, selectedCalendarIds, view]);

  useEffect(() => {
    const boot = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadCalendars(), loadServices()]);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load planner data"
        );
      } finally {
        setLoading(false);
      }
    };
    void boot();
  }, [loadCalendars, loadServices]);

  useEffect(() => {
    const run = async () => {
      setError(null);
      try {
        await loadAvailabilityForSelected();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load availability"
        );
      }
    };
    void run();
  }, [loadAvailabilityForSelected]);

  const filteredServices = useMemo(() => {
    const q = serviceSearch.trim().toLowerCase();
    if (!q) return services;
    return services.filter((service) => service.name.toLowerCase().includes(q));
  }, [serviceSearch, services]);

  const toggleCalendar = (calendarId: string, checked: boolean) => {
    setSelectedCalendarIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(calendarId);
      else next.delete(calendarId);
      return next;
    });
  };

  const isWithinBookingWindow = (
    calendar: AdminScheduleCalendar,
    day: Date
  ) => {
    const dayStart = startOfDay(day).getTime();
    const dayEnd = addDays(startOfDay(day), 1).getTime() - 1;
    const openAtMs = calendar.bookingOpenAt
      ? new Date(calendar.bookingOpenAt).getTime()
      : null;
    const closeAtMs = calendar.bookingCloseAt
      ? new Date(calendar.bookingCloseAt).getTime()
      : null;

    if (openAtMs !== null && dayEnd < openAtMs) return false;
    if (closeAtMs !== null && dayStart > closeAtMs) return false;
    return true;
  };

  const calendarIsOpenOnDate = (calendar: AdminScheduleCalendar, day: Date) => {
    if (!isWithinBookingWindow(calendar, day)) return false;

    const dateKey = toIsoLocalDate(day);
    const override = overridesByCalendar[calendar.id]?.get(dateKey);
    if (override) return !override.isClosed;

    const dayOfWeek = DAY_ENUM_BY_INDEX[day.getDay()];
    const weeklyRow = (hoursByCalendar[calendar.id] ?? []).find(
      (row) => row.dayOfWeek === dayOfWeek
    );
    return weeklyRow ? !weeklyRow.isClosed : false;
  };

  const clampToBookingWindow = (
    calendar: AdminScheduleCalendar,
    dayStartTime: Date,
    dayEndTime: Date
  ): { start: Date; end: Date } | null => {
    let start = dayStartTime;
    let end = dayEndTime;

    const openAt = calendar.bookingOpenAt
      ? new Date(calendar.bookingOpenAt)
      : null;
    const closeAt = calendar.bookingCloseAt
      ? new Date(calendar.bookingCloseAt)
      : null;

    if (openAt && end <= openAt) return null;
    if (closeAt && start >= closeAt) return null;

    if (openAt && start < openAt) start = openAt;
    if (closeAt && end > closeAt) end = closeAt;

    if (start >= end) return null;
    return { start, end };
  };

  const getOpenHoursForDay = (
    calendar: AdminScheduleCalendar,
    day: Date
  ): { openTime: string; closeTime: string } | null => {
    if (!isWithinBookingWindow(calendar, day)) return null;

    const dateKey = toIsoLocalDate(day);
    const override = overridesByCalendar[calendar.id]?.get(dateKey);
    if (override) {
      if (override.isClosed) return null;
      return {
        openTime: override.openTime ?? "09:00:00",
        closeTime: override.closeTime ?? "17:00:00",
      };
    }

    const dayOfWeek = DAY_ENUM_BY_INDEX[day.getDay()];
    const weeklyRow = (hoursByCalendar[calendar.id] ?? []).find(
      (row) => row.dayOfWeek === dayOfWeek
    );

    if (!weeklyRow || weeklyRow.isClosed) return null;
    return {
      openTime: weeklyRow.openTime ?? "09:00:00",
      closeTime: weeklyRow.closeTime ?? "17:00:00",
    };
  };

  const availabilityEvents = useMemo(() => {
    const selectedCalendars = calendars.filter((calendar) =>
      selectedCalendarIds.has(calendar.id)
    );
    if (selectedCalendars.length === 0) return [] as AvailabilityEvent[];

    const range = getRangeForView(date, view);
    const output: AvailabilityEvent[] = [];

    let cursor = startOfDay(range.start);
    const endDate = startOfDay(range.end);

    while (cursor <= endDate) {
      for (const calendar of selectedCalendars) {
        if (view === Views.MONTH) {
          if (!calendarIsOpenOnDate(calendar, cursor)) continue;
          output.push({
            id: `availability-month-${calendar.id}-${toIsoLocalDate(cursor)}`,
            title: shortLabel(calendar.name),
            start: cursor,
            end: addDays(cursor, 1),
            allDay: true,
            resource: {
              calendarId: calendar.id,
              calendarName: calendar.name,
              calendarColor: calendar.color,
            },
          });
          continue;
        }

        const hours = getOpenHoursForDay(calendar, cursor);
        if (!hours) continue;

        const start = parseHmsToDate(cursor, hours.openTime);
        const end = parseHmsToDate(cursor, hours.closeTime);
        if (start >= end) continue;

        const clamped = clampToBookingWindow(calendar, start, end);
        if (!clamped) continue;

        output.push({
          id: `availability-week-${calendar.id}-${toIsoLocalDate(cursor)}`,
          title: shortLabel(calendar.name),
          start: clamped.start,
          end: clamped.end,
          allDay: false,
          resource: {
            calendarId: calendar.id,
            calendarName: calendar.name,
            calendarColor: calendar.color,
          },
        });
      }
      cursor = addDays(cursor, 1);
    }

    return output;
  }, [
    calendars,
    selectedCalendarIds,
    date,
    view,
    hoursByCalendar,
    overridesByCalendar,
    getOpenHoursForDay,
    clampToBookingWindow,
  ]);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingCalendarId(null);
    setCalendarForm(defaultForm);
    setWeeklyHours(defaultWeeklyHours);
    setSelectedServiceIds(new Set());
    setServiceSearch("");
    setDeleteDialogOpen(false);
    setDeleteTargetId(null);
    setModalOpen(true);
  };

  const openEditModal = async (calendarId: string) => {
    const calendar = calendars.find((item) => item.id === calendarId);
    if (!calendar) return;

    setModalMode("edit");
    setEditingCalendarId(calendarId);
    setCalendarForm({
      name: calendar.name,
      color: calendar.color,
      active: calendar.active,
      maxBookingsPerDay:
        calendar.maxBookingsPerDay == null
          ? ""
          : String(calendar.maxBookingsPerDay),
      bookingOpenAt: toDatetimeLocalInput(calendar.bookingOpenAt),
      bookingCloseAt: toDatetimeLocalInput(calendar.bookingCloseAt),
    });
    setSelectedServiceIds(
      new Set(
        services
          .filter((service) => service.scheduleCalendarId === calendarId)
          .map((service) => service.id)
      )
    );

    try {
      const hours = await fetchCalendarHours(calendarId);
      setHoursByCalendar((prev) => ({ ...prev, [calendarId]: hours }));
      setWeeklyHours(
        DAYS.map((day) => {
          const row = hours.find((h) => h.dayOfWeek === day.key);
          return {
            dayOfWeek: day.key,
            dayLabel: day.label,
            isClosed: row?.isClosed ?? false,
            openTime: row?.openTime ?? "09:00:00",
            closeTime: row?.closeTime ?? "17:00:00",
          };
        })
      );
    } catch {
      setWeeklyHours(defaultWeeklyHours);
    }

    setModalOpen(true);
  };

  const syncCalendarServices = async (
    calendarId: string,
    selectedIds: Set<string>
  ) => {
    const updates: Promise<void>[] = [];

    services.forEach((service) => {
      const shouldBelong = selectedIds.has(service.id);
      const currentlyBelongs = service.scheduleCalendarId === calendarId;
      const currentlyOther =
        service.scheduleCalendarId !== null && !currentlyBelongs;

      if (shouldBelong && (currentlyOther || !currentlyBelongs)) {
        updates.push(patchServiceScheduleCalendar(service.id, calendarId));
      } else if (!shouldBelong && currentlyBelongs) {
        updates.push(patchServiceScheduleCalendar(service.id, null));
      }
    });

    await Promise.all(updates);
  };

  const saveCalendar = async () => {
    if (!calendarForm.name.trim()) {
      setError("Calendar name is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: calendarForm.name.trim(),
        color: calendarForm.color,
        active: calendarForm.active,
        maxBookingsPerDay:
          calendarForm.maxBookingsPerDay.trim() === ""
            ? null
            : Number(calendarForm.maxBookingsPerDay),
        bookingOpenAt: normalizeDateTimeInput(calendarForm.bookingOpenAt),
        bookingCloseAt: normalizeDateTimeInput(calendarForm.bookingCloseAt),
      };

      const saved =
        modalMode === "create"
          ? await createAdminCalendar(payload)
          : await updateAdminCalendar(editingCalendarId as string, payload);

      await saveCalendarHours(
        saved.id,
        weeklyHours.map((row) => ({
          dayOfWeek: row.dayOfWeek,
          isClosed: row.isClosed,
          openTime: row.isClosed ? null : row.openTime,
          closeTime: row.isClosed ? null : row.closeTime,
        }))
      );
      await syncCalendarServices(saved.id, selectedServiceIds);

      await Promise.all([loadCalendars(), loadServices()]);
      await loadAvailabilityForSelected();

      setSelectedCalendarIds((prev) => new Set(prev).add(saved.id));
      setModalOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save calendar");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCalendar = async () => {
    const targetId = deleteTargetId ?? editingCalendarId;
    if (modalMode !== "edit" || !targetId) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteAdminCalendar(targetId);

      setSelectedCalendarIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });

      await Promise.all([loadCalendars(), loadServices()]);
      await loadAvailabilityForSelected();

      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
      setModalOpen(false);
      setEditingCalendarId(null);
    } catch (e) {
      setDeleteDialogOpen(false);
      setError(e instanceof Error ? e.message : "Failed to delete calendar");
    } finally {
      setDeleting(false);
    }
  };

  const deleteTargetCalendarName = useMemo(() => {
    const id = deleteTargetId ?? editingCalendarId;
    if (!id) return "this calendar";
    return (
      calendars.find((calendar) => calendar.id === id)?.name ?? "this calendar"
    );
  }, [calendars, deleteTargetId, editingCalendarId]);

  return (
    <div className="w-full py-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Availability Planner</h1>
          <p className="text-sm text-muted-foreground">
            Month/week schedule calendar availability
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New calendar
        </Button>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Calendars
          </h2>
          <div className="space-y-2">
            {calendars.map((calendar) => (
              <div
                key={calendar.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border p-2"
                onClick={() => void openEditModal(calendar.id)}
              >
                <span
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <Checkbox
                    checked={selectedCalendarIds.has(calendar.id)}
                    onCheckedChange={(checked) =>
                      toggleCalendar(calendar.id, checked === true)
                    }
                  />
                </span>
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: calendar.color }}
                />
                <span className="truncate text-sm">{calendar.name}</span>
              </div>
            ))}
            {!loading && calendars.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No calendars found.
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="min-h-[760px] p-4">
          <BigCalendar<AvailabilityEvent>
            localizer={localizer}
            events={availabilityEvents}
            startAccessor="start"
            endAccessor="end"
            step={30}
            timeslots={1}
            min={GRID_MIN_TIME}
            max={GRID_MAX_TIME}
            views={[Views.MONTH, Views.WEEK]}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={(event) => {
              void openEditModal(event.resource.calendarId);
            }}
            components={{ toolbar: CalendarToolbar }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: withAlpha(event.resource.calendarColor, "44"),
                borderColor: event.resource.calendarColor,
                color: "#111827",
                fontWeight: 500,
              },
            })}
            style={{ height: 720 }}
          />
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create" ? "New Calendar" : "Edit Calendar"}
            </DialogTitle>
            <DialogDescription>
              Configure booking window, weekly hours, and service assignments.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="calendar-name">Name</Label>
              <Input
                id="calendar-name"
                value={calendarForm.name}
                onChange={(event) => setFormField("name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar-color">Color</Label>
              <Input
                id="calendar-color"
                type="color"
                value={calendarForm.color}
                onChange={(event) => setFormField("color", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar-max-bookings">Max bookings/day</Label>
              <Input
                id="calendar-max-bookings"
                type="number"
                min={0}
                value={calendarForm.maxBookingsPerDay}
                onChange={(event) =>
                  setFormField("maxBookingsPerDay", event.target.value)
                }
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={calendarForm.active}
                  onCheckedChange={(checked) =>
                    setFormField("active", checked === true)
                  }
                />
                Active
              </label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar-open-date">Booking open date</Label>
              <Input
                id="calendar-open-date"
                type="datetime-local"
                value={calendarForm.bookingOpenAt}
                onChange={(event) =>
                  setFormField("bookingOpenAt", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar-close-date">Booking close date</Label>
              <Input
                id="calendar-close-date"
                type="datetime-local"
                value={calendarForm.bookingCloseAt}
                onChange={(event) =>
                  setFormField("bookingCloseAt", event.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Weekly Hours</h3>
            <div className="space-y-2">
              {weeklyHours.map((row) => (
                <div
                  key={row.dayOfWeek}
                  className="grid grid-cols-[56px_84px_1fr_1fr] items-center gap-2 rounded-md border p-2"
                >
                  <span className="text-xs font-medium">{row.dayLabel}</span>
                  <label className="flex items-center gap-2 text-xs">
                    <Checkbox
                      checked={row.isClosed}
                      onCheckedChange={(checked) =>
                        setDayHours(row.dayOfWeek, {
                          isClosed: checked === true,
                        })
                      }
                    />
                    Closed
                  </label>
                  <select
                    title="Open time"
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                    value={row.openTime ?? "09:00:00"}
                    disabled={row.isClosed}
                    onChange={(event) =>
                      setDayHours(row.dayOfWeek, {
                        openTime: event.target.value,
                      })
                    }
                  >
                    {TIME_OPTIONS.map((option) => (
                      <option
                        key={`${row.dayOfWeek}-open-${option}`}
                        value={option}
                      >
                        {formatTimeLabel(option)}
                      </option>
                    ))}
                  </select>
                  <select
                    title="Close time"
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                    value={row.closeTime ?? "17:00:00"}
                    disabled={row.isClosed}
                    onChange={(event) =>
                      setDayHours(row.dayOfWeek, {
                        closeTime: event.target.value,
                      })
                    }
                  >
                    {TIME_OPTIONS.map((option) => (
                      <option
                        key={`${row.dayOfWeek}-close-${option}`}
                        value={option}
                      >
                        {formatTimeLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Assigned Services</h3>
            <Input
              placeholder="Search services"
              value={serviceSearch}
              onChange={(event) => setServiceSearch(event.target.value)}
            />
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
              {filteredServices.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={selectedServiceIds.has(service.id)}
                    onCheckedChange={(checked) =>
                      setSelectedServiceIds((prev) => {
                        const next = new Set(prev);
                        if (checked === true) next.add(service.id);
                        else next.delete(service.id);
                        return next;
                      })
                    }
                  />
                  {service.name}
                </label>
              ))}
              {filteredServices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No matching services.
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter className="flex w-full items-center justify-between">
            {modalMode === "edit" ? (
              <Button
                variant="destructive"
                onClick={() => {
                  if (!editingCalendarId) return;
                  setDeleteTargetId(editingCalendarId);
                  setDeleteDialogOpen(true);
                }}
                disabled={saving || deleting}
              >
                Delete Calendar
              </Button>
            ) : (
              <span />
            )}
            <Button
              onClick={() => void saveCalendar()}
              disabled={saving || deleting}
            >
              {saving
                ? "Saving..."
                : modalMode === "create"
                ? "Create Calendar"
                : "Save Calendar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (deleting) return;
          setDeleteDialogOpen(open);
          if (!open) setDeleteTargetId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete calendar?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteTargetCalendarName} and remove
              its availability blocks. This cannot be undone. Calendars with
              appointments or the Default calendar cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteCalendar();
              }}
            >
              {deleting ? "Deleting..." : "Delete Calendar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
