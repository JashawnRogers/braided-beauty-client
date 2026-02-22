import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toTimeSlots } from "@/components/utils/timeSlotsMapper";
import BookingCalendar, {
  TimeSlot,
} from "@/features/account/components/BookingCalendar";
import BookingPolicy from "@/features/account/components/BookingPolicy";

import { toISO } from "@/lib/toIso";
import { apiGet, apiPost } from "@/lib/apiClient";
import { formatJavaDate } from "@/lib/date";
import { formatDurationMinutes } from "@/lib/formatDuration";
import {
  CreateAppointmentDTO,
  AvailableTimeSlotsDTO,
  ServiceResponseDTO,
  CheckoutSessionResponse,
  BookingPricingPreview,
} from "@/features/account/types";

import { useUser } from "@/context/UserContext";
import ServiceGallery from "./components/ServiceGallery";
import BookingDetailsDialog from "./components/BookingDetailsDialog";

export default function ServiceDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<ServiceResponseDTO | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isLoadingService, setIsLoadingService] = useState<boolean>(false);
  const [isLoadingAppointment, setIsLoadingAppointment] =
    useState<boolean>(false);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(
    new Set()
  );
  const [note, setNote] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");

  const [pricingPreview, setPricingPreview] =
    useState<BookingPricingPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const { user } = useUser();

  const navigate = useNavigate();

  const buildAppointmentTime = (date: Date, time: string) => {
    return `${toISO(date)}T${time}:00`;
  };

  const openModal = () => {
    setAppointmentError(null);
    setIsBookingModalOpen(true);
  };

  function useDebouncedValue<T>(value: T, delayMs: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const id = window.setTimeout(() => setDebounced(value), delayMs);
      return () => window.clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
  }

  useEffect(() => {
    if (!serviceId || !date) return;

    const getAvailability = async () => {
      try {
        setIsLoadingSlots(true);
        setAvailabilityError(null);
        setNote(null);
        setPromoCode("");

        const dateStr = toISO(date);

        const addOnIdsArray = Array.from(selectedAddOnIds);
        const addOnsQuery = addOnIdsArray.length
          ? `&${addOnIdsArray
              .map((id) => `addOnIds=${encodeURIComponent(id)}`)
              .join("&")}`
          : "";

        const data = await apiGet<AvailableTimeSlotsDTO[]>(
          `/availability?serviceId=${serviceId}&date=${encodeURIComponent(
            dateStr
          )}${addOnsQuery}`
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
  }, [serviceId, date, selectedAddOnIds]);

  useEffect(() => {
    if (!serviceId) return;

    const getService = async () => {
      try {
        setIsLoadingService(true);
        setServiceError(null);

        const data = await apiGet<ServiceResponseDTO>(`/service/${serviceId}`);

        setService(data);
        console.log(data);
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

  const handleBook = async () => {
    if (!canBook || !service || !serviceId || !time) return;

    if (!user && !guestEmail) {
      setAppointmentError("Please enter an email for your receipt");
      return;
    }

    try {
      setIsLoadingAppointment(true);
      setAppointmentError(null);

      const appointmentTime = buildAppointmentTime(date, time);

      const payload: CreateAppointmentDTO = {
        appointmentTime,
        serviceId,
        receiptEmail: user ? null : guestEmail?.trim() || null,
        note: note?.trim() || null,
        addOnIds: Array.from(selectedAddOnIds),
        promoText: promoCode.trim() ? promoCode.trim().toUpperCase() : null,
      };

      console.log(payload);

      const res = await apiPost<CheckoutSessionResponse>(
        `/appointments/book`,
        payload
      );

      setIsBookingModalOpen(false);

      if (!res.paymentRequired) {
        if (!res.confirmationToken) {
          throw new Error("Missing confirmation token from server");
        }

        navigate(
          `/book/success?id=${res.appointmentId}&token=${res.confirmationToken}`
        );
        return;
      }

      window.location.href = res.checkoutUrl!;
    } catch (err) {
      console.error(err);
      setAppointmentError("Failed to book appointment");
      navigate("/book/cancel");
    } finally {
      setIsLoadingAppointment(false);
    }
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    setTime(null); // To prevent stale time selection
  };

  const normalizedPromoText = useMemo(() => {
    const trimmed = promoCode.trim();
    return trimmed ? trimmed.toUpperCase() : null;
  }, [promoCode]);

  const debouncedPromoText = useDebouncedValue(normalizedPromoText, 300);

  const previewPayload = useMemo(() => {
    if (!serviceId) return null;
    return {
      serviceId,
      addOnIds: Array.from(selectedAddOnIds),
      promoText: debouncedPromoText,
    };
  }, [serviceId, selectedAddOnIds, debouncedPromoText]);

  useEffect(() => {
    if (!isBookingModalOpen) return;
    if (!previewPayload) return;

    let cancelled = false;

    const run = async () => {
      try {
        setIsLoadingPreview(true);
        setPreviewError(null);

        // IMPORTANT: use the correct endpoint + method for your API
        // If your endpoint is GET with query params, switch accordingly.
        const res = await apiPost<BookingPricingPreview>(
          `/pricing/preview`,
          previewPayload
        );

        if (!cancelled) setPricingPreview(res);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setPricingPreview(null);
          setPreviewError("Failed to load pricing preview");
        }
      } finally {
        if (!cancelled) setIsLoadingPreview(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isBookingModalOpen, previewPayload]);

  useEffect(() => {
    if (!isBookingModalOpen) {
      setPricingPreview(null);
      setPreviewError(null);
      setIsLoadingPreview(false);
    }
  }, [isBookingModalOpen]);

  const totalMinutes = useMemo(() => {
    if (!service) return 0;
    const base = service.durationMinutes ?? 0;

    const addOnMinutes =
      service.addOns?.reduce((sum, addOn) => {
        if (selectedAddOnIds.has(addOn.id)) {
          return sum + (addOn.durationMinutes ?? 0);
        }
        return sum;
      }, 0) ?? 0;

    return base + addOnMinutes;
  }, [service, selectedAddOnIds]);

  const totalPrice = useMemo(() => {
    if (!service) return 0;
    const base = service.price ?? 0;

    const addOnPrice =
      service.addOns?.reduce((sum, addOn) => {
        if (selectedAddOnIds.has(addOn.id)) {
          return sum + (addOn.price ?? 0);
        }
        return sum;
      }, 0) ?? 0;

    return base + addOnPrice;
  }, [service, selectedAddOnIds]);

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

        <h1 className="text-4xl font-semibold mt-10">{service.name}</h1>

        <div className="pt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          {/* LEFT */}
          <div className="self-start">
            <ServiceGallery
              images={
                service.photoUrls?.length
                  ? service.photoUrls
                  : service.coverImageUrl
                  ? [service.coverImageUrl]
                  : []
              }
            />

            <article className="prose prose-zinc dark:prose-invert mt-6">
              <p>{service.description}</p>
              {service.price !== undefined && (
                <p>
                  <strong>Starting at:</strong> ${totalPrice}
                </p>
              )}
              {service.durationMinutes != null && (
                <p>
                  <strong>Duration:</strong>{" "}
                  {formatDurationMinutes(totalMinutes)}
                </p>
              )}

              {/* Add Ons */}
              {service.addOns.length > 0 && (
                <>
                  <h4 className="mt-6 font-bold">Add-ons</h4>
                  <div className="space-y-3 mt-2">
                    {service.addOns.map((addOn) => {
                      const checked = selectedAddOnIds.has(addOn.id);
                      return (
                        <div key={addOn.id} className="flex items-start gap-3">
                          <Checkbox
                            id={`addon-${addOn.id}`}
                            checked={checked}
                            onCheckedChange={() => toggleAddOn(addOn.id)}
                            className="mt-1"
                          />

                          <div className="grid gap-1 leading-none">
                            <Label
                              htmlFor={`addon-${addOn.id}`}
                              className="cursor-pointer font-medium"
                            >
                              {addOn.name}
                              {addOn.price > 0 && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                  +${addOn.price}
                                </span>
                              )}
                            </Label>

                            {addOn.description && (
                              <p className="text-sm text-muted-foreground">
                                {addOn.description}
                              </p>
                            )}

                            {addOn.durationMinutes > 0 && (
                              <p className="text-sm text-muted-foreground">
                                +{addOn.durationMinutes} minutes
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </article>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button type="button" onClick={openModal} disabled={!canBook}>
                {canBook && time
                  ? `Book ${formatJavaDate(`${toISO(date)}T${time}:00`)}`
                  : "Select a date & time to book"}
              </Button>
              <Button asChild variant="secondary">
                <Link to="/categories">Back</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: booking calendar (controlled) */}
          <div className="self-start md:pl-6 mt-6">
            {availabilityError && (
              <p className="mb-2 text-sm text-destructive">
                {availabilityError}
              </p>
            )}
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

          <BookingDetailsDialog
            open={isBookingModalOpen}
            onOpenChange={setIsBookingModalOpen}
            isGuest={!user}
            guestEmail={guestEmail}
            onGuestEmailChange={setGuestEmail}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            note={note ?? ""}
            onNoteChange={(v) => setNote(v)}
            appointmentError={appointmentError}
            isSubmitting={isLoadingAppointment}
            onSubmit={handleBook}
            summaryTitle={
              canBook && time
                ? formatJavaDate(`${toISO(date)}T${time}:00`)
                : undefined
            }
            serviceName={service.name}
            totalMinutes={totalMinutes}
            totalPrice={totalPrice}
            pricingPreview={pricingPreview}
            isLoadingPreview={isLoadingPreview}
            previewError={previewError}
          />
        </div>
      </div>
    </section>
  );
}
