import { Card } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Ban, Brush, Phone } from "lucide-react";
import { useBusinessSettingsContext } from "@/context/useBusinessSettingsContext";
import { phone } from "@/lib/formatPhone";

type BookingPolicyProps = {
  readonly className?: string;
  readonly accent?: "gold" | "zinc";
};

export default function BookingPolicy({
  className = "",
  accent = "gold",
}: BookingPolicyProps) {
  const accentRing =
    accent === "gold"
      ? "ring-[#c7a451] ring-1"
      : "ring-zinc-300 ring-1 dark:ring-zinc-700";
  const settings = useBusinessSettingsContext();

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
            I create for women who are selective about their space and stylist—
            a calm, curated environment where beauty meets intention.
          </p>
        </div>
        <div
          className={`rounded-2xl ${accentRing} bg-white/60 p-4 dark:bg-zinc-900/50`}
        >
          <p className="text-center text-sm font-medium leading-relaxed">
            Each style is rooted in care for your natural hair. I’m committed to
            helping it grow strong and healthy while saving you time.
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
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Sat–Tues: 6:00 AM
                <br />
                Friday: 10:00 AM
              </p>
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
                  href={settings?.companyPhoneNumber}
                >
                  {phone.formatFromE164(settings?.companyPhoneNumber)}
                </a>
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="space-x-2">
                  <a
                    href="https://instagram.com/braidedbeautyphx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @braidedbeautyphx
                  </a>
                  <span>•</span>
                  <a
                    href="https://instagram.com/braidedb3auty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @braidedb3auty
                  </a>
                </div>
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
                <strong>$25</strong> fee applies after.
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
                Cancel within <strong>48 hours</strong> of booking. Deposits can
                be rescheduled once.
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
                Please arrive with hair washed, blow-dried, and free of product
                for best results.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
