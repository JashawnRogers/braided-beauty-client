import { Button } from "@/components/ui/button";
import AboutContent from "@/components/ui/content-1";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-4xl font-semibold md:text-5xl">About Braided Beauty</h1>
        <p className="mt-4 text-muted-foreground">
          Intentional braiding rooted in beauty, care, and a luxury experience
          that honors your time and your natural hair.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/categories">Book Appointment</Link>
          </Button>
        </div>
      </div>

      <AboutContent />
    </section>
  );
}
