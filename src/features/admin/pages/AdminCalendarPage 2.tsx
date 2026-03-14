import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  type View,
  Views,
} from "react-big-calendar";
import {
  addMinutes,
  endOfDay,
  endOfWeek,
  format,
  getDay,
  parse,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchAdminCalendarEvents,
  fetchAdminCalendars,
  type AdminScheduleCalendar,
} from "@/features/admin/api/calendarApi";
import "react-big-calendar/lib/css/react-big-calendar.css";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    calendarId: string;
    calendarName: string;
    calendarColor: string;
    appointmentStatus: string;
  };
};

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const toIsoLocalDateTime = (value: Date) =>
  format(value, "yyyy-MM-dd'T'HH:mm:ss");

const getRangeForView = (date: Date, view: View) => {
  if (view === Views.DAY) {
    return {
      start: startOfDay(date),
      end: endOfDay(date),
    };
  }

  return {
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  };
};

const isValidDate = (value: Date) => !Number.isNaN(value.getTime());

export default function AdminCalendarPage() {
  const navigate = useNavigate();
  const [calendars, setCalendars] = useState<AdminScheduleCalendar[]>([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<Set<string>>(
    new Set()
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingCalendars, setLoadingCalendars] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const initializedSelection = useRef(false);

  useEffect(() => {
    const loadCalendars = async () => {
      setLoadingCalendars(true);
      setError(null);

      try {
        const rows = await fetchAdminCalendars();
        setCalendars(rows);
        setSelectedCalendarIds((previous) => {
          if (!initializedSelection.current) {
            initializedSelection.current = true;
            const activeIds = rows.filter((item) => item.active).map((item) => item.id);
            const defaultIds = activeIds.length > 0 ? activeIds : rows.map((item) => item.id);
            return new Set(defaultIds);
          }

          const validIds = new Set(rows.map((item) => item.id));
          return new Set([...previous].filter((id) => validIds.has(id)));
        });
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Failed to load calendars";
        setError(message);
      } finally {
        setLoadingCalendars(false);
      }
    };

    void loadCalendars();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      const range = getRangeForView(date, view);
      const start = toIsoLocalDateTime(range.start);
      const end = toIsoLocalDateTime(range.end);

      setLoadingEvents(true);
      setError(null);

      try {
        const rows = await fetchAdminCalendarEvents(start, end);
        const mapped: CalendarEvent[] = rows
          .map((event) => {
            const startDate = new Date(event.appointmentTime);
            if (!isValidDate(startDate)) {
              return null;
            }

            const endDate = addMinutes(startDate, event.durationMinutes);
            return {
              id: String(event.appointmentId),
              title: event.serviceName,
              start: startDate,
              end: endDate,
              resource: {
                calendarId: String(event.calendarId),
                calendarName: event.calendarName,
                calendarColor: event.calendarColor,
                appointmentStatus: event.appointmentStatus,
              },
            };
          })
          .filter((event): event is CalendarEvent => event !== null);

        setEvents(mapped);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Failed to load events";
        setError(message);
      } finally {
        setLoadingEvents(false);
      }
    };

    void loadEvents();
  }, [date, view]);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => selectedCalendarIds.has(event.resource.calendarId)),
    [events, selectedCalendarIds]
  );

  const toggleCalendar = (calendarId: string, checked: boolean) => {
    setSelectedCalendarIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(calendarId);
      } else {
        next.delete(calendarId);
      }
      return next;
    });
  };

  return (
    <div className="w-full py-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Week and day scheduling view across all schedule calendars.
          </p>
        </div>
        {(loadingCalendars || loadingEvents) && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Calendars
          </h2>
          <div className="space-y-3">
            {calendars.map((calendar) => (
              <label
                key={calendar.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border p-2"
              >
                <Checkbox
                  checked={selectedCalendarIds.has(calendar.id)}
                  onCheckedChange={(checked) =>
                    toggleCalendar(calendar.id, checked === true)
                  }
                />
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: calendar.color }}
                />
                <span className="text-sm">{calendar.name}</span>
              </label>
            ))}

            {!loadingCalendars && calendars.length === 0 && (
              <p className="text-sm text-muted-foreground">No calendars found.</p>
            )}
          </div>
        </Card>

        <Card className="min-h-[720px] p-4">
          <BigCalendar<CalendarEvent>
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            views={[Views.WEEK, Views.DAY]}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={(event) => setSelectedEvent(event)}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.resource.calendarColor || "#0ea5e9",
                borderColor: event.resource.calendarColor || "#0ea5e9",
                color: "#ffffff",
              },
            })}
            style={{ height: 680 }}
          />
        </Card>
      </div>

      <Dialog
        open={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title ?? "Appointment"}</DialogTitle>
            <DialogDescription>
              Review details and open the appointment record.
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Date & Time</p>
                <p>
                  {format(selectedEvent.start, "PPpp")} -{" "}
                  {format(selectedEvent.end, "p")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline">
                  {selectedEvent.resource.appointmentStatus.replaceAll("_", " ")}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Calendar</p>
                <p className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: selectedEvent.resource.calendarColor }}
                  />
                  {selectedEvent.resource.calendarName}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                if (!selectedEvent) return;
                navigate(`/dashboard/admin/appointments/${selectedEvent.id}`);
                setSelectedEvent(null);
              }}
            >
              Open Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
