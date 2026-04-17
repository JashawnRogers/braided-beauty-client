import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clock3,
  Gift,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";
import featuredPic1 from "@/assets/featured-work/featured-pic1.webp";
import featuredPic2 from "@/assets/featured-work/featured-pic2.webp";
import featuredPic3 from "@/assets/featured-work/featured-pic3.webp";
import featuredPic4 from "@/assets/featured-work/featured-pic4.webp";
import featuredPic5 from "@/assets/featured-work/featured-pic5.webp";

const highlights = [
  {
    value: "100+",
    label: "Clients served with a calm, appointment-first experience",
  },
  {
    value: "5,000+",
    label: "Hours spent refining braid quality, prep, and finish",
  },
  {
    value: "5+",
    label: "Years building a luxury braiding practice in Phoenix",
  },
];

const pillars = [
  {
    icon: Sparkles,
    title: "Luxury without noise",
    body: "A polished service flow, intentional styling, and a final result that feels elevated from start to finish.",
  },
  {
    icon: Clock3,
    title: "Respect for your time",
    body: "Clear booking, thoughtful pacing, and service standards designed to keep the experience organized and dependable.",
  },
  {
    icon: HeartHandshake,
    title: "Client-first care",
    body: "Every appointment is built around comfort, communication, and styles that align with your lifestyle.",
  },
];

const process = [
  "Choose a category that matches the style family you want.",
  "Review featured braid work to get a feel for the finish and overall look.",
  "Create an account to manage bookings and return with less friction.",
];

const testimonials = [
  {
    quote:
      "Sophia delivers each service with precision, intention, and respect for your time. The experience feels thoughtfully curated from start to finish.",
    author: "K. Williams",
  },
  {
    quote:
      "She is professional, warm, and incredibly talented. My daughter leaves feeling confident and looking flawless every time.",
    author: "Courtney N.",
  },
  {
    quote:
      "Scheduling was seamless and the service quality matched the communication. It felt easy, polished, and trustworthy.",
    author: "Dom C.",
  },
];

const featuredSlides = [
  { image: featuredPic1, alt: "Braided hairstyle close-up" },
  { image: featuredPic2, alt: "Braided hairstyle detail" },
  { image: featuredPic3, alt: "Detailed braid pattern" },
  { image: featuredPic4, alt: "Finished braided style" },
  { image: featuredPic5, alt: "Long braided hairstyle" },
];

const fadeUp = (distance = 28) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
});

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

function LandingPage() {
  const reduceMotion = useReducedMotion();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedSlide, setSelectedSlide] = useState(0);
  const inViewProps = reduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
      };

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setSelectedSlide(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <motion.div
        className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(193,150,73,0.24),transparent_48%),linear-gradient(180deg,#f7f1ea_0%,#f6efe6_46%,#f9f6f3_100%)]"
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <motion.div
        className="absolute left-[-7rem] top-40 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 10, 0], y: [0, -12, 0] }}
        transition={{
          duration: 11,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-[-5rem] top-24 -z-10 h-64 w-64 rounded-full bg-amber-100 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -10, 0], y: [0, 12, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <section className="px-6 pb-20 pt-32 sm:pt-36 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            className="max-w-2xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp(18)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur"
            >
              <ShieldCheck className="h-4 w-4 text-primary" />
              Luxury braiding studio serving Deer Valley, Phoenix
            </motion.div>

            <motion.div className="mt-8 space-y-6" variants={fadeUp(22)}>
              <p className="font-serif text-2xl tracking-[0.14em] text-stone-950 sm:text-3xl">
                Braided Beauty
              </p>
              <p className="text-sm uppercase tracking-[0.28em] text-foreground/55">
                Intentional braiding and elevated client care
              </p>
              <h1 className="max-w-xl font-serif text-5xl leading-[0.95] text-stone-950 sm:text-6xl lg:text-7xl">
                Braids that feel refined before you even leave the chair.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-foreground/72 sm:text-xl">
                Braided Beauty pairs polished styling with a quieter kind of
                luxury: clear booking, thoughtful communication, and braid work
                designed to look beautiful and wear well.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp(26)}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary/20 bg-white/70 px-7 text-sm backdrop-blur hover:bg-white"
              >
                <Link to="/about">Meet Your Braider</Link>
              </Button>
            </motion.div>

          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-2xl"
            initial={reduceMotion ? undefined : { opacity: 0, x: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-4 sm:space-y-5">
                <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-stone-200 shadow-[0_24px_60px_-30px_rgba(42,25,8,0.42)]">
                  <img
                    src={featuredPic2}
                    alt="Braided hairstyle detail"
                    className="h-[16rem] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03] sm:h-[18rem]"
                  />
                </div>
                <motion.div
                  className="rounded-[2rem] border border-primary/15 bg-stone-950 px-6 py-7 text-stone-50 shadow-[0_24px_60px_-35px_rgba(42,25,8,0.6)]"
                  animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-2 text-primary-foreground/90">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="mt-4 font-serif text-2xl leading-tight">
                    A service experience built to feel calm, premium, and worth
                    returning to.
                  </p>
                </motion.div>
              </div>

              <div className="space-y-4 pt-8 sm:space-y-5 sm:pt-12">
                <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-stone-200 shadow-[0_24px_60px_-30px_rgba(42,25,8,0.42)]">
                  <img
                    src={featuredPic4}
                    alt="Finished braided style"
                    className="h-[20rem] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03] sm:h-[23rem]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  <div className="overflow-hidden rounded-[1.6rem] border border-white/60 bg-stone-200">
                    <img
                      src={featuredPic1}
                      alt="Braided hairstyle close-up"
                      className="h-32 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04] sm:h-36"
                    />
                  </div>
                  <div className="rounded-[1.6rem] border border-primary/15 bg-white/80 p-5 backdrop-blur">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm uppercase tracking-[0.18em] text-foreground/52">
                      Based in
                    </p>
                    <p className="mt-1 font-serif text-2xl text-stone-950">
                      Phoenix
                    </p>
                    <p className="mt-1 text-sm text-foreground/66">
                      Deer Valley studio
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial={reduceMotion ? undefined : "hidden"}
              animate={reduceMotion ? undefined : "visible"}
              className="mt-5 grid gap-4 sm:grid-cols-3"
            >
              {highlights.map((item) => (
                <motion.div
                  key={item.value}
                  variants={fadeUp(18)}
                  className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_-35px_rgba(52,34,12,0.35)] backdrop-blur"
                >
                  <div className="font-serif text-4xl text-stone-950">
                    {item.value}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-foreground/68">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section
        className="px-6 py-20 lg:px-8 lg:py-24"
        variants={staggerContainer}
        {...inViewProps}
      >
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            variants={fadeUp()}
            className="rounded-[2rem] border border-primary/15 bg-stone-950 px-8 py-10 text-stone-100"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/70">
              The standard
            </p>
            <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight">
              Modern braid work with structure, softness, and intention.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-stone-300">
              The goal is not just a beautiful result. It is a booking and
              in-chair experience that feels organized, elevated, and genuinely
              considerate.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            {pillars.map(({ icon: Icon, title, body }) => (
              <motion.article
                key={title}
                variants={fadeUp(18)}
                className="rounded-[2rem] border border-primary/12 bg-white p-7 shadow-[0_22px_60px_-38px_rgba(52,34,12,0.35)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-2xl text-stone-950">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-foreground/70">
                  {body}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="px-6 py-6 lg:px-8 lg:py-8"
        variants={fadeUp()}
        {...inViewProps}
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-primary/20 bg-white/80 p-5 shadow-[0_20px_60px_-35px_rgba(52,34,12,0.28)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-foreground/70">
                  <Gift className="h-3.5 w-3.5 text-primary" />
                  Member account
                </div>
                <p className="mt-4 font-serif text-2xl leading-tight text-stone-950">
                  Create your account before booking to keep everything in one
                  place.
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground/68">
                  Save your details, view upcoming appointments, and enter the
                  rewards member flow without disruption.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-11 rounded-full px-6 text-sm"
                >
                  <Link to="/signup">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full border-primary/20 bg-background/80 px-6 text-sm"
                >
                  <Link to="/login">Member Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="px-6 py-20 lg:px-8 lg:py-24"
        variants={staggerContainer}
        {...inViewProps}
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <motion.div variants={fadeUp()}>
            <p className="text-sm uppercase tracking-[0.28em] text-foreground/52">
              Featured work
            </p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
              A rotating gallery built around the braid work itself.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-foreground/70">
              A simple auto-advancing carousel keeps the section polished and
              image-led while still fitting the cleaner homepage layout.
            </p>

            <div className="mt-8 space-y-4">
              {process.map((step) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/80 px-5 py-4 backdrop-blur"
                >
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 text-foreground/74">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp(18)} className="relative">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: "start", loop: true }}
              plugins={
                reduceMotion
                  ? []
                  : [
                      AutoScroll({
                        playOnInit: true,
                        startDelay: 2500,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                      }),
                    ]
              }
              className="w-full"
            >
              <CarouselContent className="items-stretch">
                {featuredSlides.map((slide) => (
                  <CarouselItem key={slide.alt}>
                    <div className="overflow-hidden rounded-[2.2rem] border border-primary/12 bg-white shadow-[0_24px_60px_-40px_rgba(52,34,12,0.42)]">
                      <div className="overflow-hidden bg-stone-200">
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          className="h-[22rem] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03] sm:h-[28rem] lg:h-[34rem]"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {featuredSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to featured work slide ${index + 1}`}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={
                      index === selectedSlide
                        ? "h-2.5 w-8 rounded-full bg-primary transition-all"
                        : "h-2.5 w-2.5 rounded-full bg-primary/25 transition-all hover:bg-primary/45"
                    }
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous featured work slide"
                  onClick={() => carouselApi?.scrollPrev()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-background text-foreground transition-colors hover:bg-accent"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next featured work slide"
                  onClick={() => carouselApi?.scrollNext()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 bg-background text-foreground transition-colors hover:bg-accent"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="px-6 py-20 lg:px-8 lg:py-24"
        variants={staggerContainer}
        {...inViewProps}
      >
        <motion.div
          variants={fadeUp()}
          className="mx-auto max-w-7xl rounded-[2.2rem] border border-primary/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(247,239,229,0.92))] p-8 shadow-[0_24px_60px_-40px_rgba(52,34,12,0.42)] sm:p-10"
        >
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-foreground/52">
              Client words
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-stone-950 sm:text-5xl">
              Trust is part of the aesthetic.
            </h2>
          </div>

          <motion.div
            variants={staggerContainer}
            className="mt-10 grid gap-5 lg:grid-cols-3"
          >
            {testimonials.map((item) => (
              <motion.figure
                key={item.author}
                variants={fadeUp(16)}
                className="rounded-[1.8rem] border border-white/80 bg-white/85 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <blockquote className="mt-5 text-sm leading-7 text-foreground/76">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm font-medium text-stone-950">
                  {item.author}
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="px-6 pb-20 pt-6 lg:px-8 lg:pb-28"
        variants={fadeUp()}
        {...inViewProps}
      >
        <motion.div
          className="mx-auto max-w-7xl rounded-[2.4rem] bg-stone-950 px-8 py-10 text-stone-100 sm:px-12 sm:py-14"
          whileHover={reduceMotion ? undefined : { y: -2 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-stone-400">
                Ready when you are
              </p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Create your account, then book with a cleaner repeatable flow.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-stone-300">
                An account makes future appointments, profile details, and
                rewards participation easier to manage while keeping the premium
                experience intact.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-stone-800 bg-stone-900/70 px-4 py-2 text-sm text-stone-200">
                <MapPin className="h-4 w-4 text-primary" />
                Deer Valley, Phoenix, Arizona
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="h-12 rounded-full px-7">
                <Link to="/signup">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-stone-700 bg-transparent px-7 text-stone-100 hover:bg-stone-900"
              >
                <Link to="/categories">Book Appointment</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}

export default LandingPage;
