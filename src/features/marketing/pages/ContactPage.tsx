import { Button } from "@/components/ui/button";
import { useBusinessSettingsContext } from "@/context/useBusinessSettingsContext";
import { phone } from "@/lib/formatPhone";
import { Link } from "react-router-dom";

export default function ContactPage() {
  const settings = useBusinessSettingsContext();

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">Contact</h1>
          <p className="mt-3 text-muted-foreground">
            Reach out before booking your squeeze-in request and we will help
            you confirm availability.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-5">
            <h2 className="text-sm font-semibold">Phone</h2>
            <a
              href={`tel:${settings?.companyPhoneNumber ?? ""}`}
              className="mt-2 block text-sm text-muted-foreground hover:underline"
            >
              {phone.formatFromE164(settings?.companyPhoneNumber) ||
                "Unavailable"}
            </a>
          </div>

          <div className="rounded-2xl border p-5">
            <h2 className="text-sm font-semibold">Address</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {settings?.companyAddress || "Address unavailable"}
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <h2 className="text-sm font-semibold">Instagram</h2>
            <a
              href="https://instagram.com/braidedbeautyphx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-muted-foreground hover:underline"
            >
              @braidedbeautyphx
            </a>
          </div>

          <div className="rounded-2xl border p-5">
            <h2 className="text-sm font-semibold">TikTok</h2>
            <a
              href="https://www.tiktok.com/@braidedbeautyphx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-muted-foreground hover:underline"
            >
              @braidedb3auty
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link to="/categories">Book Appointment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
