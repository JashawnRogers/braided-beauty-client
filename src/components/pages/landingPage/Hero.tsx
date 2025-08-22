export default function Hero() {
  return (
    <section className="py-12 my-24 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-medium lg:text-5xl">Braided Beauty</h2>
          <p>Client care through intentional braiding, beauty & luxury</p>
        </div>

        <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          <div className="space-y-4">
            <div className="text-5xl font-bold">100+</div>
            <p>Clients serviced</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">5,000+</div>
            <p>Hours of experience</p>
          </div>
          <div className="space-y-4">
            <div className="text-5xl font-bold">16+</div>
            <p>Years perfecting braids</p>
          </div>
        </div>
      </div>
    </section>
  );
}
