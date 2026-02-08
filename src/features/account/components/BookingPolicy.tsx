import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Ban, Brush, Phone } from "lucide-react";
import { useBusinessSettingsContext } from "@/context/useBusinessSettingsContext";
import { phone } from "@/lib/formatPhone";
import {
  useBusinessHours,
  BusinessHoursResponseDTO,
} from "@/hooks/useBusinessHours";

type BookingPolicyProps = {
  readonly className?: string;
  readonly accent?: "gold" | "zinc";
};

export default function BookingPolicy({
  className = "",
  accent = "gold",
}: BookingPolicyProps) {
  const [showAllHours, setShowAllHours] = useState<boolean>(false);

  const accentRing =
    accent === "gold"
      ? "ring-[#c7a451] ring-1"
      : "ring-zinc-300 ring-1 dark:ring-zinc-700";
  const settings = useBusinessSettingsContext();
  const {
    data: hours,
    isLoading: hoursLoading,
    isError: hoursError,
  } = useBusinessHours();

  const formatTime = (t: string) => {
    // t comes from LocalTime -> JSON like "06:00:00" or "06:00"
    const [hh, mm] = t.split(":");
    const h = Number(hh);
    const m = Number(mm);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const DAY_ORDER = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ] as const;

  const hoursByDay = (hours ?? []).reduce<
    Record<string, BusinessHoursResponseDTO>
  >((acc, h) => {
    acc[h.dayOfWeek] = h;
    return acc;
  }, {});

  return (
    <section className={`mx-auto w-full ${className}`}>
      {/* Mission callouts */}
      <div className="py-8">
        <h2 className="text-2xl text-center font-semibold md:text-3xl">
          Booking Policy
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          className={`rounded-2xl ${accentRing} bg-white/60 p-4 dark:bg-zinc-900/50`}
        >
          <p className="text-center text-sm font-medium leading-relaxed">
            We create for women who are selective about their space and stylist—
            a calm, curated environment where beauty meets intention.
          </p>
        </div>
        <div
          className={`rounded-2xl ${accentRing} bg-white/60 p-4 dark:bg-zinc-900/50`}
        >
          <p className="text-center text-sm font-medium leading-relaxed">
            Each style is rooted in care for your natural hair. We are committed
            to helping it grow strong and healthy while saving you time.
          </p>
        </div>
        <div
          className={`rounded-2xl ${accentRing} bg-white/60 p-4 dark:bg-zinc-900/50`}
        >
          <p className="text-center text-sm font-medium leading-relaxed">
            This is a space to truly relax. Be pampered. Be present. Most
            importantly—take care of you.
          </p>
        </div>
      </div>

      {/* Policy grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Location */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <MapPin className="h-5 w-5 opacity-70" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Location</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {settings?.companyAddress}
              </p>
            </div>
          </div>
        </Card>

        {/* Hours */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <Clock className="h-5 w-5 opacity-70" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Hours</h3>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {hoursLoading && <p>Loading hours…</p>}

                {hoursError && !hoursLoading && (
                  <p className="text-xs text-muted-foreground">
                    Hours unavailable
                  </p>
                )}

                {!hoursLoading && !hoursError && (
                  <>
                    {/* Compact (today only) */}
                    {!showAllHours &&
                      (() => {
                        const today = new Date().getDay(); // 0=Sun ... 6=Sat
                        const todayKey = DAY_ORDER[today];
                        const row = hoursByDay[todayKey];
                        const label =
                          todayKey[0] + todayKey.slice(1).toLowerCase();

                        if (!row || row.isClosed) {
                          return (
                            <p>
                              <span className="font-medium">{label}:</span>{" "}
                              <span className="text-zinc-500">Closed</span>
                            </p>
                          );
                        }

                        return (
                          <p>
                            <span className="font-medium">{label}:</span>{" "}
                            {formatTime(row.openTime)} –{" "}
                            {formatTime(row.closeTime)}
                          </p>
                        );
                      })()}

                    {/* Expanded (all days) */}
                    {showAllHours && (
                      <div className="mt-2 space-y-1">
                        {DAY_ORDER.map((day) => {
                          const row = hoursByDay[day];
                          const label = day[0] + day.slice(1).toLowerCase();

                          if (!row || row.isClosed) {
                            return (
                              <p key={day}>
                                <span className="font-medium">{label}:</span>{" "}
                                <span className="text-zinc-500">Closed</span>
                              </p>
                            );
                          }

                          return (
                            <p key={day}>
                              <span className="font-medium">{label}:</span>{" "}
                              {formatTime(row.openTime)} –{" "}
                              {formatTime(row.closeTime)}
                            </p>
                          );
                        })}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowAllHours((v) => !v)}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      {showAllHours ? "Hide hours" : "View all hours"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <Phone className="h-5 w-5 opacity-70" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Contact</h3>
              <p className="mt-1 text-sm">
                <a
                  className="hover:underline"
                  href={`tel:${settings?.companyPhoneNumber}`}
                >
                  {phone.formatFromE164(settings?.companyPhoneNumber)}
                </a>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                {/* Instagram */}
                <a
                  href="https://instagram.com/braidedbeautyphx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current opacity-70"
                  >
                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 9A3.5 3.5 0 1 1 15.5 13 3.5 3.5 0 0 1 12 16.5zm4.75-9.75a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0-1.25-1.25z" />
                  </svg>
                  <span>@braidedbeautyphx</span>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@braidedbeautyphx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current opacity-70"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.29 0 .57.04.83.1V9.4a6.31 6.31 0 0 0-.83-.05A6.33 6.33 0 1 0 15.82 15V8.39a8.26 8.26 0 0 0 3.77.93z" />
                  </svg>
                  <span>@braidedb3auty</span>
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Lateness */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <Clock className="h-5 w-5 opacity-70" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Lateness</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                10-minute grace period. Please notify beforehand. A{" "}
                <strong>$25</strong> fee applies after 15 minutes. 20 mintues or
                more may result in appointment cancellation.
              </p>
            </div>
          </div>
        </Card>

        {/* Payment */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <DollarSign className="h-5 w-5 opacity-70" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Payment</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                We now accept debit and credit as a valid form of payment.
                Payment is due after appointment is completed.
              </p>
            </div>
          </div>
        </Card>

        {/* Cancellation */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <Ban className="h-5 w-5 opacity-70" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Cancellation</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Reschedule at least <strong>48 hours prior</strong> to
                appointment for a <strong>one time</strong> deposit transfer to
                new appointment.
              </p>
            </div>
          </div>
        </Card>

        {/* Prep */}
        <Card className="p-5 sm:col-span-2 lg:col-span-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <Brush className="h-5 w-5 opacity-70" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Prep</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                · Please arrive with hair washed, blow-dried, detaingled and
                free of product for best results.
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                · A prep fee of <strong>$25</strong> is incurred for hair
                prepped inproperly.
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                · Hair must be at least <strong>4 inches</strong> all around.
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                · Hair loss or damaged edges? A phone consultation is{" "}
                <strong>required</strong> before booking appointment.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
