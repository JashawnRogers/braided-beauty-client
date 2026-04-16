import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarDays, ChevronRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

const recoverySteps = [
  "Return to the service list and choose a new date or time.",
  "Double-check your card details if payment was interrupted.",
  "Use the contact page if you need help finishing your booking.",
];

export default function BookingCancelPage() {
  return (
    <section className="min-h-[75vh] py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-sm">
          <div className="border-b border-border/60 bg-muted/40 px-8 py-8">
            <div className="flex items-center gap-3 text-sm font-medium text-amber-700">
              <div className="flex size-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <AlertCircle className="size-5" />
              </div>
              Booking interrupted
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
              Your appointment was not completed
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              No payment was captured and your booking was not finalized. If
              you closed checkout early, your selected time may no longer be
              held. You can start again and choose another available slot in a
              few taps.
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <CalendarDays className="size-4" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    What happened
                  </h2>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  This page appears when checkout is canceled, payment fails,
                  or the process is left before completion.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Clock3 className="size-4" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    What to do next
                  </h2>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Start a new booking flow to pick an open appointment time,
                  then complete checkout again when you are ready.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed bg-muted/20 p-6">
              <h2 className="text-lg font-semibold">Next steps</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {recoverySteps.map((step) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/70" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/categories">Book Appointment</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/">
                  Return Home
                  <ChevronRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
