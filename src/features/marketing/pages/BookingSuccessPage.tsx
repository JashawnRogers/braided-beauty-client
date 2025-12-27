import { useSearchParams } from "react-router";

export default function BookingSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="max-w-xl min-h-[70vh] mx-auto py-16 text-center">
      <h1 className="text-2xl font-semibold mt-48">Payment Successful!</h1>
      <p className="mt-4">We're confirming your appointment...</p>

      {sessionId && (
        <p className="mt-2 text-sm text-muted-foreground">
          Reference: {sessionId}
        </p>
      )}
    </div>
  );
}
