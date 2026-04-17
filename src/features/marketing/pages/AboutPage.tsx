import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import headshot from "@/assets/featured-work/placeholder.webp";

const brandPrinciples = [
  {
    title: "Mission",
    body: "To offer intentional braiding rooted in care, professionalism, and a luxury experience that respects each client's time, hair, and confidence.",
  },
  {
    title: "Vision",
    body: "To create a beauty brand known for polished service, thoughtful client care, and braid work that feels elevated, dependable, and deeply personal.",
  },
  {
    title: "Future",
    body: "To keep growing Braided Beauty into a trusted destination where high standards, strong values, and an even more seamless client experience continue to lead.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(193,150,73,0.22),transparent_46%),linear-gradient(180deg,#f7f1ea_0%,#f6efe6_42%,#f9f6f3_100%)]" />
      <div className="absolute left-[-7rem] top-36 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-4rem] top-20 -z-10 h-64 w-64 rounded-full bg-amber-100 blur-3xl" />

      <section className="px-6 pb-16 pt-32 sm:pt-12 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              The values behind Braided Beauty
            </div>
            <h1 className="mt-8 font-serif text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
              About Braided Beauty
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">
              Intentional braiding rooted in beauty, care, and a luxury
              experience that honors your time and your natural hair.
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-7 text-sm"
              >
                <Link to="/categories">
                  Book Appointment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {brandPrinciples.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-primary/12 bg-white/85 p-7 shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)] backdrop-blur"
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
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2.4rem] bg-stone-900 shadow-[0_30px_70px_-35px_rgba(42,25,8,0.42)]">
            <div className="absolute left-10 top-10 hidden h-28 w-28 rounded-full bg-primary/10 blur-2xl sm:block" />
            <div className="relative flex min-h-[30rem] items-center justify-center sm:min-h-[34rem] lg:min-h-[38rem]">
              <img
                src={headshot}
                alt="Sophia Rochelle of Braided Beauty"
                className="h-full max-h-[38rem] w-full object-contain object-top"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,18,11,0.84)_0%,rgba(24,18,11,0.62)_40%,rgba(24,18,11,0.22)_68%,rgba(24,18,11,0.08)_100%)]" />
            </div>

            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-6 text-stone-50 sm:p-8 lg:p-10">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.28em] text-stone-300">
                    Meet the braider
                  </p>
                  <h2 className="mt-3 font-serif text-4xl italic leading-tight text-white sm:text-5xl">
                    Meet your braider
                  </h2>
                  <div className="mt-6 space-y-4 text-sm leading-7 text-stone-200 sm:text-base sm:leading-8">
                    <p>
                      Hi there! I'm Sophia Rochelle, a braider with over 16
                      years of experience{" "}
                      <span className="font-semibold text-white">
                        specializing in intentional, high-quality styles and
                        prioritizing you.
                      </span>
                    </p>
                    <p>
                      Rooted in faith and driven by care, I lead you with{" "}
                      <span className="font-semibold text-white">
                        value, integrity, and excellence
                      </span>
                      , offering more than just a hairstyle, but a luxury
                      experience where you feel seen, and beautifully served. My
                      goal is to make sure every client walks away feeling
                      restored, confident, and satisfied.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-1 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] bg-stone-950 px-8 py-10 text-stone-100 shadow-[0_30px_80px_-45px_rgba(42,25,8,0.62)] sm:px-12 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-stone-400">
              The heart behind the chair
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              The Heart Behind The Chair
            </h2>
          </div>

          <div className="mt-8 max-w-4xl border-l border-stone-700 pl-6 text-base leading-8 text-stone-300 sm:pl-8">
            <p className="font-semibold text-stone-100">
              Braided Beauty began with a deep love for hair and a mission to
              celebrate every client who sits in our chair.
            </p>
            <p className="mt-6">
              That moment when your energy shifts from anticipation to joy, is
              what drives our commitment to excellence. We're not just about
              beautiful outcomes. We take pride in the process; thoughtful and
              intentional from start to finish. No performative professionalism,
              just integrity, high standards, and service that honors your time.
            </p>
            <p className="mt-6">
              Every appointment is designed to leave you feeling empowered,
              seen, and beautifully satisfied.
            </p>
            <cite className="mt-8 block font-medium text-stone-100">
              Braided Beauty
            </cite>
          </div>
        </div>
      </section>
    </main>
  );
}
