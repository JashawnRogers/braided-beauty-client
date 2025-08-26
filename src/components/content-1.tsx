import headshot from "../../public/featured-work/placeholder.webp";

export default function About() {
  return (
    <section className="pb-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          Meet your braider
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <img
                src={headshot}
                className="rounded-[15px] h-auto shadow dark:hidden"
                alt="payments illustration light"
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              Hi there! I'm Sophia Rochelle, a braider with over 16 years of
              experience{" "}
              <span className="text-accent-foreground font-bold">
                specializing in intentional, high-quality styles and
                prioritizing you.
              </span>{" "}
            </p>
            <p className="text-muted-foreground">
              Rooted in faith and driven by care, I lead you with{" "}
              <span className="text-accent-foreground font-bold">
                value, integrity, and excellence
              </span>{" "}
              , offering more than just a hairstyle, but a luxury experience
              where you feel seen, and beautifully served. My goal is to make
              sure every client walks away feeling restored, confident, and
              satisfied.
            </p>

            <div className="pt-6">
              <h4 className="italic text-2xl pb-2">
                The Heart Behind The Chair
              </h4>
              <blockquote className="border-l-4 pl-4">
                <p className="font-semibold">
                  Braided Beauty began with a deep love for hair and a mission
                  to celebrate every client who sits in our chair.
                </p>
                <br />
                <p>
                  That moment when your energy shifts from anticipation to joy,
                  is what drives our commitment to excellence. We're not just
                  about beautiful outcomes. We take pride in the process;
                  thoughtful and intentional from start to finish. No
                  performative professionalism, just integrity, high standards,
                  and service that honors your time.
                </p>
                <br />
                <p>
                  Every appointment is designed to leave you feeling empowered,
                  seen, and beautifully satisfied.
                </p>
                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">Braided Beauty</cite>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
