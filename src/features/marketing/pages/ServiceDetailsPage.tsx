import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { SERVICES } from "@/features/marketing/data/services";
import { Button } from "@/components/ui/button";
import BookingCalendar, {
  type TimeSlot,
} from "@/features/account/components/BookingCalendar";
import { toISO } from "@/lib/toIso";
import BookingPolicy from "@/features/account/components/BookingPolicy";
export default function ServiceDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = useMemo(() => SERVICES.find((s) => s.slug === slug), [slug]);

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    // TODO: replace with real API call:
    // GET /api/availability?service={slug}&date=YYYY-MM-DD
    const mock: TimeSlot[] = [
      { time: "09:00", available: false },
      { time: "09:30", available: false },
      { time: "10:00", available: true },
      { time: "10:30", available: true },
      { time: "11:00", available: true },
      { time: "11:30", available: true },
      { time: "12:00", available: false },
      { time: "12:30", available: true },
      { time: "13:00", available: true },
      { time: "13:30", available: true },
      { time: "14:00", available: true },
      { time: "14:30", available: false },
      { time: "15:00", available: false },
      { time: "15:30", available: true },
      { time: "16:00", available: true },
      { time: "16:30", available: true },
      { time: "17:00", available: true },
      { time: "17:30", available: true },
    ];
    setTimeSlots(mock);
    setTime(null); // reset time when date changes or availability reloads
  }, [slug, date]);

  const canBook = Boolean(date && time);

  const handleBook = () => {
    if (!canBook || !service) return;
    const q = new URLSearchParams({
      service: service.slug,
      date: toISO(date),
      time: time!, // non-null because canBook
    }).toString();

    navigate(`/book?${q}`);
  };

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Service not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The service you’re looking for doesn’t exist or was moved.
        </p>
        <Button asChild className="mt-6">
          <Link to="/services">Back to services</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <BookingPolicy />
        <div className="pt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-semibold">{service.title}</h1>
            <p className="mt-3 text-muted-foreground">
              {service.shortDescription}
            </p>

            {service.heroImage && (
              <img
                src={service.heroImage}
                alt={service.title}
                className="mt-6 w-full rounded-xl border"
              />
            )}

            <article className="prose prose-zinc dark:prose-invert mt-6">
              <p>{service.longDescription}</p>
              {service.priceFrom !== undefined && (
                <p>
                  <strong>Starting at:</strong> ${service.priceFrom}
                </p>
              )}
              {service.durationMinutes && (
                <p>
                  <strong>Duration:</strong> {service.durationMinutes} minutes
                </p>
              )}
            </article>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={handleBook} disabled={!canBook}>
                {canBook
                  ? `Book ${toISO(date)} at ${time}`
                  : "Select a date & time to book"}
              </Button>
              <Button asChild variant="secondary">
                <Link to="/services">Back</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: booking calendar (controlled) */}
          <div className="md:pl-2">
            <BookingCalendar
              date={date}
              onDateChange={setDate}
              time={time}
              onTimeChange={setTime}
              timeSlots={timeSlots}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
