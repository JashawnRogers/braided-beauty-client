import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toTimeSlots } from "@/components/utils/timeSlotsMapper";
import BookingCalendar, {
  TimeSlot,
} from "@/features/account/components/BookingCalendar";
import BookingPolicy from "@/features/account/components/BookingPolicy";

import { toISO } from "@/lib/toIso";
import { apiGet, apiPost } from "@/lib/apiClient";
import { formatJavaDate } from "@/lib/date";
import { formatDurationMinutes } from "@/lib/formatDuration";
import { logger } from "@/lib/logger";
import { clearStoredBookingHold, storeBookingHold } from "@/lib/bookingHold";
import {
  CreateAppointmentDTO,
  AvailableTimeSlotsDTO,
  ServiceResponseDTO,
  CheckoutSessionResponse,
  BookingPricingPreview,
} from "@/features/account/types";

import { useUser } from "@/context/UserContext";
import { useBusinessSettingsContext } from "@/context/useBusinessSettingsContext";
import ServiceGallery from "./components/ServiceGallery";
import BookingDetailsDialog from "./components/BookingDetailsDialog";
import ReviewsCard from "./components/ReviewsCard";
import { Sparkles } from "lucide-react";

export default function ServiceDetailsPage() {
  const DESCRIPTION_PREVIEW_LENGTH = 250;
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
  const [isSameDayWarningOpen, setIsSameDayWarningOpen] =
    useState<boolean>(false);
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);
  const [isAddOnsExpanded, setIsAddOnsExpanded] = useState<boolean>(false);

  const [pricingPreview, setPricingPreview] =
    useState<BookingPricingPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const { user } = useUser();
  const businessSettings = useBusinessSettingsContext();

  const navigate = useNavigate();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const buildAppointmentTime = (date: Date, time: string) => {
    return `${toISO(date)}T${time}:00`;
  };

  const isSameLocalCalendarDay = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const openBookingDetailsModal = () => {
    setAppointmentError(null);
    setIsBookingModalOpen(true);
  };

  const openModal = () => {
    if (isSameLocalCalendarDay(date, new Date())) {
      setIsSameDayWarningOpen(true);
      return;
    }

    openBookingDetailsModal();
  };

  function useDebouncedValue<T>(value: T, delayMs: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const id = window.setTimeout(() => setDebounced(value), delayMs);
      return () => window.clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
  }

  const loadAvailability = async () => {
    if (!serviceId || !date) return;

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
      logger.error("booking.availability.load_failed", err, {
        serviceId,
        selectedAddOnCount: selectedAddOnIds.size,
      });
      setAvailabilityError("Failed to load time slots");
      setTimeSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [serviceId, date, selectedAddOnIds]);

  useEffect(() => {
    if (!serviceId) return;

    const getService = async () => {
      try {
        setIsLoadingService(true);
        setServiceError(null);
        setPricingPreview(null);

        const data = await apiGet<ServiceResponseDTO>(`/service/${serviceId}`);

        setService(data);
      } catch (err) {
        logger.error("booking.service.load_failed", err, { serviceId });
        setServiceError("Failed to load service");
        setService(null);
      } finally {
        setIsLoadingService(false);
      }
    };

    getService();
  }, [serviceId]);

  useEffect(() => {
    setPricingPreview(null);
  }, [serviceId]);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [serviceId]);

  useEffect(() => {
    setIsAddOnsExpanded(false);
  }, [serviceId]);

  const canBook = Boolean(time) && !isLoadingSlots && !availabilityError;

  const handleBook = async () => {
    if (!canBook || !service || !serviceId || !time) return;

    if (isLoadingPreview) return;

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
      const res = await apiPost<CheckoutSessionResponse>(
        `/appointments/book`,
        payload
      );

      setIsBookingModalOpen(false);

      if (!res.paymentRequired) {
        clearStoredBookingHold();

        if (!res.confirmationToken) {
          throw new Error("Missing confirmation token from server");
        }

        navigate(
          `/book/success?id=${res.appointmentId}&token=${res.confirmationToken}`
        );
        return;
      }

      storeBookingHold({
        appointmentId: res.appointmentId,
        serviceId,
        categoryId: service.categoryId,
      });

      window.location.href = res.checkoutUrl!;
    } catch (err) {
      logger.error("booking.submit.failed", err, {
        serviceId,
        hasUser: Boolean(user),
        selectedAddOnCount: selectedAddOnIds.size,
        hasPromoCode: Boolean(promoCode.trim()),
      });

      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : "Failed to start checkout. Please review your details and try again.";

      setAppointmentError(errorMessage);

      if (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        (err as { status?: number }).status === 409
      ) {
        setTime(null);
        void loadAvailability();
      }
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
    setPromoCode("");
    setPricingPreview(null);
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

        const res = await apiPost<BookingPricingPreview>(
          `/pricing/preview`,
          previewPayload
        );

        if (!cancelled) setPricingPreview(res);
      } catch (e) {
        logger.error("booking.pricing_preview.failed", e, {
          serviceId,
          selectedAddOnCount: selectedAddOnIds.size,
          hasPromoCode: Boolean(debouncedPromoText),
        });
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

  const descriptionText = service?.description ?? "";
  const hasLongDescription =
    descriptionText.length > DESCRIPTION_PREVIEW_LENGTH;
  const descriptionPreview = hasLongDescription
    ? `${descriptionText.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`
    : descriptionText;
  const visibleDescription = isDescriptionExpanded
    ? descriptionText
    : descriptionPreview;
  const addOns = service?.addOns ?? [];
  const hasExtraAddOns = addOns.length > 2;
  const visibleAddOns =
    hasExtraAddOns && !isAddOnsExpanded ? addOns.slice(0, 2) : addOns;
  const galleryImages = service?.photoUrls?.length
    ? service.photoUrls
    : service?.coverImageUrl
    ? [service.coverImageUrl]
    : [];

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
      </div>
    );
  }
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(193,150,73,0.22),transparent_46%),linear-gradient(180deg,#f7f1ea_0%,#f6efe6_42%,#f9f6f3_100%)]" />
      <div className="absolute left-[-7rem] top-36 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-4rem] top-20 -z-10 h-64 w-64 rounded-full bg-amber-100 blur-3xl" />

      <section className="px-6 pb-14 pt-32 sm:pt-12 lg:px-8 lg:pb-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Service details and booking
            </div>
            <h1 className="mt-8 font-serif text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
              {service.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/72 sm:text-xl">
              Review the service details, select any add-ons, and move into the
              booking calendar with a cleaner, more guided flow.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2.4rem] border border-primary/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(247,239,229,0.92))] p-4 shadow-[0_24px_60px_-40px_rgba(52,34,12,0.42)] sm:p-6 lg:p-8">
            <div className="rounded-[2rem] bg-white/70 p-4 sm:p-5">
              <BookingPolicy className="m-0 rounded-[1.5rem] bg-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="order-1 self-start lg:order-1 lg:pr-2">
              <div className="rounded-[2.2rem] border border-primary/12 bg-white/88 p-6 shadow-[0_24px_60px_-40px_rgba(52,34,12,0.42)] backdrop-blur">
                <h2 className="font-serif text-3xl text-stone-950">
                  Reserve your appointment
                </h2>
                <p className="mt-3 text-sm leading-7 text-foreground/68">
                  Select a date and time to continue with booking.
                </p>
                {typeof businessSettings?.appointmentBufferTime === "number" &&
                  businessSettings.appointmentBufferTime > 0 && (
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      Appointment times include a {businessSettings.appointmentBufferTime}
                      -minute buffer between bookings.
                    </p>
                  )}

                <div className="mt-6">
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
              </div>

              <article className="mt-6 rounded-[2.2rem] border border-primary/12 bg-white/88 p-7 shadow-[0_24px_60px_-40px_rgba(52,34,12,0.42)] backdrop-blur">
                <div className="flex flex-wrap gap-3">
                  {service.price !== undefined && (
                    <div className="rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm text-foreground/80">
                      Price: {formatCurrency(totalPrice)}
                    </div>
                  )}
                  {service.durationMinutes != null && (
                    <div className="rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm text-foreground/80">
                      Duration: {formatDurationMinutes(totalMinutes)}
                    </div>
                  )}
                </div>

                <p className="mt-6 whitespace-pre-line text-base leading-8 text-foreground/74">
                  {visibleDescription}
                </p>
                {hasLongDescription && (
                  <Button
                    type="button"
                    variant="link"
                    className="mt-2 h-auto px-0 text-primary"
                    onClick={() =>
                      setIsDescriptionExpanded((expanded) => !expanded)
                    }
                  >
                    {isDescriptionExpanded ? "Show less" : "Show more"}
                  </Button>
                )}

                {addOns.length > 0 && (
                  <>
                    <h4 className="mt-8 font-serif text-3xl text-stone-950">
                      Add-ons
                    </h4>
                    <div className="mt-4 space-y-3">
                      {visibleAddOns.map((addOn) => {
                        const checked = selectedAddOnIds.has(addOn.id);
                        return (
                          <div
                            key={addOn.id}
                            className="flex items-start gap-3 rounded-[1.4rem] border border-primary/10 bg-background/70 p-4"
                          >
                            <Checkbox
                              id={`addon-${addOn.id}`}
                              checked={checked}
                              onCheckedChange={() => toggleAddOn(addOn.id)}
                              className="mt-1"
                            />

                            <div className="grid gap-1 leading-none">
                              <Label
                                htmlFor={`addon-${addOn.id}`}
                                className="cursor-pointer font-medium text-stone-950"
                              >
                                {addOn.name}
                                {addOn.price > 0 && (
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    +{formatCurrency(addOn.price)}
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
                    {hasExtraAddOns && (
                      <Button
                        type="button"
                        variant="link"
                        className="mt-3 h-auto px-0 text-primary"
                        onClick={() =>
                          setIsAddOnsExpanded((expanded) => !expanded)
                        }
                      >
                        {isAddOnsExpanded
                          ? "View fewer add-ons"
                          : `View ${addOns.length - 2} more add-ons`}
                      </Button>
                    )}
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
                  <Link
                    to={
                      service.categoryId
                        ? `/services/${service.categoryId}`
                        : "/categories"
                    }
                  >
                    Back
                  </Link>
                </Button>
              </div>
            </div>

            <div className="order-2 self-start lg:order-2 lg:pl-2">
              {galleryImages.length > 0 ? (
                <div className="overflow-hidden rounded-[2.2rem] mx-auto max-w-sm border border-primary/12 bg-white/88 p-4 shadow-[0_24px_60px_-40px_rgba(52,34,12,0.42)] backdrop-blur sm:p-5">
                  <div className="mx-auto w-full max-w-xs">
                    <ServiceGallery images={galleryImages} />
                  </div>
                </div>
              ) : null}
              <ReviewsCard />
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
              isSubmitting={isLoadingAppointment || isLoadingPreview}
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

            <Dialog
              open={isSameDayWarningOpen}
              onOpenChange={setIsSameDayWarningOpen}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Same-Day Appointment Request</DialogTitle>
                  <DialogDescription>
                    Same-day appointments are not guaranteed. Please call or
                    contact Braided Beauty to confirm availability before
                    proceeding with your squeeze-in request.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsSameDayWarningOpen(false)}
                  >
                    Go Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsSameDayWarningOpen(false);
                      openBookingDetailsModal();
                    }}
                  >
                    I Understand
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </main>
  );
}
