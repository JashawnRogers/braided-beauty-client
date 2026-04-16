import { Button } from "@/components/ui/button";
import BookingPolicy from "@/features/account/components/BookingPolicy";
import { Link } from "react-router-dom";

export default function PoliciesPage() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">Policies</h1>
          <p className="mt-3 text-muted-foreground">
            Please review these details before booking your appointment.
          </p>
        </div>

        <BookingPolicy className="mt-6" />

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link to="/categories">Book Appointment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
