import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookingCalendar, {
  TimeSlot,
} from "@/features/account/components/BookingCalendar";
import { toISO } from "@/lib/toIso";
import BookingPolicy from "@/features/account/components/BookingPolicy";
import { apiGet } from "@/lib/apiClient";
import {
  AvailableTimeSlotsDTO,
  ServiceResponseDTO,
} from "@/features/account/types";
import { toTimeSlots } from "@/components/utils/timeSlotsMapper";
import { formatJavaDate } from "@/lib/date";
export default function ServiceDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<ServiceResponseDTO | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isLoadingService, setIsLoadingService] = useState<boolean>(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );
  const [serviceError, setServiceError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId || !date) return;

    const getAvailability = async () => {
      try {
        setIsLoadingSlots(true);
        setAvailabilityError(null);

        const dateStr = toISO(date);
        const data = await apiGet<AvailableTimeSlotsDTO[]>(
          `/availability?serviceId=${serviceId}&date=${dateStr}`
        );

        setTimeSlots(toTimeSlots(data));
      } catch (err) {
        console.error(err);
        setAvailabilityError("Failed to load time slots");
        setTimeSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    getAvailability();
  }, [serviceId, date]);

  useEffect(() => {
    if (!serviceId) return;

    const getService = async () => {
      try {
        setIsLoadingService(true);
        setServiceError(null);

        const data = await apiGet<ServiceResponseDTO>(`/service/${serviceId}`);

        setService(data);
      } catch (err) {
        console.error(err);
        setServiceError("Failed to load service");
        setService(null);
      } finally {
        setIsLoadingService(false);
      }
    };

    getService();
  }, [serviceId]);

  const canBook = Boolean(time) && !isLoadingSlots && !availabilityError;

  const handleBook = () => {
    if (!canBook || !service) return;
    console.log("Booked!");
  };

  if (isLoadingService) {
    return <div className="mx-auto max-w-3xl px-6 py-24">Loading service…</div>;
  }

  if (serviceError) {
    return <div className="mx-auto max-w-3xl px-6 py-24">{serviceError}</div>;
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Service not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The service you’re looking for doesn’t exist or was moved.
        </p>
        <Button asChild className="mt-6">
          <Link to="/categories">Back to categories</Link>
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
            <h1 className="text-3xl font-semibold">{service.name}</h1>

            {/* {service.heroImage && (
              <img
                src={service.heroImage}
                alt={service.name}
                className="mt-6 w-full rounded-xl border"
              />
            )} */}

            <article className="prose prose-zinc dark:prose-invert mt-6">
              <p>{service.description}</p>
              {service.price !== undefined && (
                <p>
                  <strong>Starting at:</strong> ${service.price}
                </p>
              )}
              {service.durationMinutes != null && (
                <p>
                  <strong>Duration:</strong> {service.durationMinutes} minutes
                </p>
              )}
            </article>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={handleBook} disabled={!canBook}>
                {canBook && time
                  ? `Book ${formatJavaDate(`${toISO(date)}T${time}:00`)}`
                  : "Select a date & time to book"}
              </Button>
              <Button asChild variant="secondary">
                <Link to="/services">Back</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: booking calendar (controlled) */}
          {availabilityError && (
            <p className="mb-2 text-sm text-destructive">{availabilityError}</p>
          )}
          <div className="md:pl-2">
            {isLoadingSlots ? (
              <p>Loading time slots...</p>
            ) : (
              <BookingCalendar
                date={date}
                onDateChange={setDate}
                time={time}
                onTimeChange={setTime}
                timeSlots={timeSlots}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
