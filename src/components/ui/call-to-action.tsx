import { Button } from "@/components/ui/button";
import { Link } from "react-router";
export default function CallToAction() {
  return (
    <section className="py-8 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Book an appointment today
          </h2>
          <p className="mt-4">Sign up to become a rewards member!</p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/categories">
                <span>Book</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link to="/">
                <span>Sign up</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
