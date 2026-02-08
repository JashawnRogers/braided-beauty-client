import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGet } from "@/lib/apiClient";
import { ReceiptCard } from "./components/ReceiptCard";

type AddOns = Readonly<{
  id: string;
  name: string;
  price: number;
}>;

type FinalPaymentConfirmation = Readonly<{
  appointmentId: string;
  serviceName: string;
  servicePrice: number;
  appointmentTime: string;
  durationMinutes: number;
  depositAmount?: number;
  remainingBalance: number;
  tipAmount?: number | null;
  paymentStatus: string;
  addOns: AddOns[];
  totalAmount: number;
  discountPercent?: number | null;
  discountAmount?: number | null;
}>;

export default function FinalPaymentSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [confirmation, setConfirmation] =
    useState<FinalPaymentConfirmation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);

        if (!sessionId) return;

        let attempts = 0;
        const maxAttempts = 10;

        const poll = async (): Promise<void> => {
          try {
            // Should return 202 until webhook has updated appointment/payment,
            // and 200 once completed.
            const data = await apiGet<FinalPaymentConfirmation>(
              `/appointments/final/confirm/by-session?sessionId=${encodeURIComponent(
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
            setError("Could not load payment confirmation.");
          }
        };

        poll();
      } catch {
        setError("Could not load payment confirmation.");
      }
    };

    run();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="max-w-xl min-h-[70vh] mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold mt-48">
          Missing payment reference
        </h1>
        <p className="mt-4">
          Please check the link you were redirected to after payment.
        </p>
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
        <h1 className="text-2xl font-semibold mt-48">Payment successful!</h1>
        <p className="mt-4">We’re confirming your payment…</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Reference: {sessionId}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center">
      <div className="max-w-xl w-full mx-auto px-6 text-center">
        <ReceiptCard
          heading="Payment complete!"
          subheading="Thanks! Your final payment has been received."
          serviceName={confirmation.serviceName}
          servicePrice={confirmation.servicePrice}
          appointmentTime={confirmation.appointmentTime}
          durationMinutes={confirmation.durationMinutes}
          depositAmount={confirmation.depositAmount}
          remainingBalance={0}
          tipAmount={confirmation.tipAmount}
          addOns={confirmation.addOns}
          totalAmount={confirmation.totalAmount}
          isFinalPayment={true}
          discountAmount={confirmation.discountAmount}
          discountPercent={confirmation.discountPercent}
        />

        <p className="mt-6 text-sm text-muted-foreground">
          Tip: You can close this page. The business will still receive
          confirmation once processing completes and an emailed receipt will be
          sent to you.
        </p>
      </div>
    </div>
  );
}
