import { Button } from "@/components/ui/button";
import BookingPolicy from "@/features/account/components/BookingPolicy";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const policyHighlights = [
  {
    title: "Prepared appointments",
    body: "Reviewing the policies in advance helps every appointment begin on time and keeps the experience smooth for both the client and the braider.",
  },
  {
    title: "Clear expectations",
    body: "Deposits, cancellations, late arrivals, and payment details are laid out clearly so there is less confusion before booking.",
  },
  {
    title: "Protected experience",
    body: "These standards support a cleaner booking process, stronger communication, and the elevated service experience Braided Beauty is known for.",
  },
];

export default function PoliciesPage() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(193,150,73,0.22),transparent_46%),linear-gradient(180deg,#f7f1ea_0%,#f6efe6_42%,#f9f6f3_100%)]" />
      <div className="absolute left-[-7rem] top-36 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-4rem] top-20 -z-10 h-64 w-64 rounded-full bg-amber-100 blur-3xl" />

      <section className="px-6 pb-16 pt-32 sm:pt-36 lg:px-8 lg:pb-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Policy details before booking
            </div>
            <h1 className="mt-8 font-serif text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
              Policies
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
              Please review these details before booking your appointment so
              the experience stays clear, smooth, and respectful of everyone’s
              time.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {policyHighlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-primary/40 bg-white/85 p-7 shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)] backdrop-blur"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-foreground/48">
                {item.title}
              </p>
              <p className="mt-5 text-base leading-8 text-foreground/72">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] border border-primary/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(247,239,229,0.92))] p-6 shadow-[0_24px_60px_-40px_rgba(52,34,12,0.42)] sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-4 py-1.5 text-sm text-foreground/78">
              <Sparkles className="h-4 w-4 text-primary" />
              Booking standards and studio expectations
            </div>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
              Review the details before reserving your appointment.
            </h2>
          </div>

          <div className="mt-8 rounded-[2rem] bg-white/70 p-2 sm:p-3">
            <BookingPolicy className="m-0 rounded-[1.5rem] bg-transparent" />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-2 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] bg-stone-950 px-8 py-10 text-stone-100 shadow-[0_30px_80px_-45px_rgba(42,25,8,0.62)] sm:px-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-stone-400">
                Ready to book
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Once the policies look good, move straight into booking.
              </h2>
              <p className="mt-4 text-base leading-8 text-stone-300">
                Reviewing this page first helps the rest of the booking flow
                feel cleaner and more predictable from start to finish.
              </p>
            </div>

            <div>
              <Button asChild size="lg" className="h-12 rounded-full px-7">
                <Link to="/categories">
                  Book Appointment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
