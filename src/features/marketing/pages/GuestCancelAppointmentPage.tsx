import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { apiPublicGet, apiPublicPost } from "@/lib/apiClient";
import { formatJavaDate } from "@/lib/date";

type AddOn = {
  readonly name: string;
};

type GuestCancelPreviewDTO = {
  readonly appointmentId: string;
  readonly appointmentTime: string; // ISO string from backend
  readonly serviceName: string;
  readonly addOns?: AddOn[]; // names only
  readonly note?: string | null;
  readonly guestEmail?: string | null;
};

type GuestCancelRequestDTO = {
  cancelReason?: string;
};

export function GuestCancelAppointmentPage() {
  const { token } = useParams<{ token: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [preview, setPreview] = useState<GuestCancelPreviewDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [reason, setReason] = useState("");
  const [confirmedPolicy, setConfirmedPolicy] = useState(false);

  const [success, setSuccess] = useState(false);

  const safeToken = useMemo(() => (token ?? "").trim(), [token]);

  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        if (!safeToken) {
          setPreview(null);
          setError("Missing cancellation token.");
          return;
        }

        // Preview endpoint (recommended)
        const data = await apiPublicGet<GuestCancelPreviewDTO>(
          `/appointments/guest/${safeToken}`
        );

        if (!cancelled) {
          setPreview(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error(err);
          setPreview(null);
          setError(
            err?.message || "This cancellation link is invalid or expired."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [safeToken]);

  const canSubmit =
    !!preview && confirmedPolicy && !isSubmitting && !isLoading && !success;

  const handleCancel = async () => {
    if (!preview || !safeToken) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: GuestCancelRequestDTO = {
        cancelReason: reason.trim() ? reason.trim() : undefined,
      };

      // Cancel endpoint
      await apiPublicPost<void>(
        `/appointments/guest/cancel/${safeToken}`,
        payload
      );

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to cancel this appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 mt-24">
      <div className="space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cancel Appointment
          </h1>
          <p className="text-sm text-muted-foreground">
            Confirm your cancellation below. Deposits are non-refundable.
          </p>
        </header>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Appointment details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading details...
              </p>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {!isLoading && !error && preview && (
              <>
                {/* Summary block */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Date & time</p>
                    <p className="font-medium">
                      {formatJavaDate(preview.appointmentTime)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Service</p>
                    <p className="font-medium">{preview.serviceName}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Add-ons</p>
                    {preview.addOns && preview.addOns.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm">
                        {preview.addOns.map((a) => (
                          <li key={a.name}>{a.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">None</p>
                    )}
                  </div>

                  {preview.note ? (
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground">Your note</p>
                      <p className="text-sm">{preview.note}</p>
                    </div>
                  ) : null}
                </div>

                <Separator />

                {/* Policy + reason */}
                {!success ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-sm font-semibold">
                        Cancellation policy
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        <li>Deposits are non-refundable.</li>
                        <li>
                          If you need help, contact us and we’ll do our best to
                          assist.
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Reason (optional)</p>
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Let us know why you’re canceling (optional)"
                        className="min-h-[110px]"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">
                        {reason.length}/500
                      </p>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border p-3">
                      <Checkbox
                        id="policy"
                        checked={confirmedPolicy}
                        onCheckedChange={(v) => setConfirmedPolicy(Boolean(v))}
                      />
                      <label
                        htmlFor="policy"
                        className="text-sm leading-5 text-muted-foreground"
                      >
                        I understand that my deposit is non-refundable and I’m
                        confirming this cancellation.
                      </label>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Button variant="outline" asChild disabled={isSubmitting}>
                        <Link to="/categories">Keep appointment</Link>
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={!canSubmit}
                      >
                        {isSubmitting
                          ? "Cancelling..."
                          : "Confirm cancellation"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <p className="text-sm font-semibold text-emerald-900">
                        Appointment cancelled
                      </p>
                      <p className="mt-1 text-sm text-emerald-900/80">
                        You’re all set. We’ve processed your cancellation.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Button asChild>
                        <Link to="/categories">Book another appointment</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Having trouble? Reply to your confirmation email or contact us for
          help.
        </p>
      </div>
    </div>
  );
}
