import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGet } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

type BookingConfirmation = {
  appointmentId: string;
  serviceName: string;
  appointmentTime: string;
  durationMinutes: number;
  depositAmount: number;
  remainingBalance: number;
  paymentStatus: string;
};

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
                `/appointments/confirm/by-session?sessionId=${sessionId}`
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
          setConfirmation(data);
          return;
        }
      } catch {
        setError("Could not load confirmation.");
      }
    };

    run();
  }, [sessionId, id, token]);

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
        <h1 className="text-3xl font-semibold">You’re booked 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          Your appointment has been successfully scheduled.
        </p>

        <div className="mt-8 rounded-xl border bg-background shadow-sm">
          <dl className="divide-y">
            <div className="flex justify-between px-6 py-4 text-sm">
              <dt className="text-muted-foreground">Service</dt>
              <dd className="font-medium">{confirmation.serviceName}</dd>
            </div>

            <div className="flex justify-between px-6 py-4 text-sm">
              <dt className="text-muted-foreground">Date & Time</dt>
              <dd className="font-medium">
                {new Date(confirmation.appointmentTime).toLocaleString()}
              </dd>
            </div>

            <div className="flex justify-between px-6 py-4 text-sm">
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="font-medium">
                {confirmation.durationMinutes} minutes
              </dd>
            </div>

            <div className="flex justify-between px-6 py-4 text-sm">
              <dt className="text-muted-foreground">Deposit Paid</dt>
              <dd className="font-medium">${confirmation.depositAmount}</dd>
            </div>

            <div className="flex justify-between px-6 py-4 text-sm">
              <dt className="text-muted-foreground">Remaining Balance</dt>
              <dd className="font-medium">
                ${confirmation.remainingBalance ?? "0"}
              </dd>
            </div>
          </dl>
        </div>
        <Button variant="outline" className="mt-4">
          <Calendar /> Add to calendar
        </Button>

        <p className="mt-6 text-sm text-muted-foreground">
          A confirmation email has been sent with your booking details.
        </p>
      </div>
    </div>
  );
}
