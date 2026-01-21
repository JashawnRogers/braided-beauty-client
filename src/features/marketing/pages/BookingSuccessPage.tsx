import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGet } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { ReceiptCard } from "./components/ReceiptCard";

type AddOns = Readonly<{
  id: string;
  name: string;
  price: number;
}>;

type BookingConfirmation = Readonly<{
  appointmentId: string;
  serviceName: string;
  servicePrice: number;
  appointmentTime: string;
  durationMinutes: number;
  depositAmount: number;
  remainingBalance: number;
  paymentStatus: string;
  addOns: AddOns[];
  totalAmount: number;
}>;

export default function BookingSuccessPage() {
  const [params] = useSearchParams();

  const sessionId = params.get("session_id");
  const id = params.get("id");
  const token = params.get("token");

  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);

        // A) Stripe deposit flow
        if (sessionId) {
          let attempts = 0;
          const maxAttempts = 10;

          const poll = async (): Promise<void> => {
            try {
              const data = await apiGet<BookingConfirmation>(
                `/appointments/confirm/by-session?sessionId=${encodeURIComponent(
                  sessionId
                )}`
              );
              setConfirmation(data);
            } catch (err: any) {
              if (err?.status === 202 && attempts < maxAttempts) {
                attempts++;
                setTimeout(poll, 1500);
                return;
              }
              if (err?.status === 409) {
                setError("Payment failed. Please try again.");
                return;
              }
              setError("Could not load confirmation.");
            }
          };

          poll();
          return;
        }

        // B) No-deposit / email deep-link flow
        if (id && token) {
          const data = await apiGet<BookingConfirmation>(
            `/appointments/confirm?id=${id}&token=${encodeURIComponent(token)}`
          );
          console.log("Confirmation", data);
          setConfirmation(data);
          return;
        }
      } catch {
        setError("Could not load confirmation.");
      }
    };

    run();
  }, [sessionId, id, token]);

  const calendarHref =
    id && token
      ? `webcal://localhost:8080/api/v1/appointments/confirm/ics?id=${id}&token=${encodeURIComponent(
          token
        )}`
      : sessionId
      ? `webcal://localhost:8080/api/v1/appointments/confirm/ics/by-session?sessionId=${encodeURIComponent(
          sessionId
        )}`
      : null;

  // If neither exists, that means you navigated without params
  if (!sessionId && !(id && token)) {
    return (
      <div className="max-w-xl min-h-[70vh] mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold mt-48">
          Missing booking reference
        </h1>
        <p className="mt-4">Please check your confirmation email.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl min-h-[70vh] mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold mt-48">Something went wrong</h1>
        <p className="mt-4">{error}</p>
      </div>
    );
  }

  if (!confirmation) {
    return (
      <div className="max-w-xl min-h-[70vh] mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold mt-48">Booking successful!</h1>
        <p className="mt-4">We're confirming your appointment...</p>

        {sessionId && (
          <p className="mt-2 text-sm text-muted-foreground">
            Reference: {sessionId}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center">
      <div className="max-w-xl w-full mx-auto px-6 text-center">
        <ReceiptCard
          heading="You’re booked 🎉"
          subheading="Your appointment has been successfully scheduled."
          serviceName={confirmation.serviceName}
          servicePrice={confirmation.servicePrice}
          appointmentTime={confirmation.appointmentTime}
          durationMinutes={confirmation.durationMinutes}
          depositAmount={confirmation.depositAmount}
          remainingBalance={confirmation.remainingBalance}
          addOns={confirmation.addOns}
          totalAmount={confirmation.totalAmount}
          isFinalPayment={false}
        />
        {calendarHref && (
          <a href={calendarHref}>
            <Button variant="outline" className="mt-4">
              <Calendar className="mr-2" /> Add to calendar
            </Button>
          </a>
        )}

        <p className="mt-6 text-sm text-muted-foreground">
          A confirmation email has been sent with your booking details.
        </p>
      </div>
    </div>
  );
}
