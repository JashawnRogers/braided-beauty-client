import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiPatch } from "@/lib/apiClient";
import { AppointmentSummaryDTO } from "../types";
import { formatJavaDate } from "@/lib/date";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly appointment: AppointmentSummaryDTO | null;
  readonly onCanceled?: (appointmentId: string) => void;
};

const CANCEL_ENDPOINT = "/appointments/cancel";

export function CancelAppointmentModal({
  open,
  onOpenChange,
  appointment,
  onCanceled,
}: Props) {
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    if (!appointment) return "Cancel appointment";
    return `Cancel ${appointment.serviceName}`;
  }, [appointment]);

  useEffect(() => {
    if (!open) {
      setReason("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  async function handleConfirm() {
    if (!appointment) return;

    const cancelReason = reason.trim();

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: { appointmentId: string; cancelReason?: string } = {
        appointmentId: appointment.id,
      };

      if (cancelReason.length > 0) {
        payload.cancelReason = cancelReason;
      }

      await apiPatch(CANCEL_ENDPOINT, payload);

      onOpenChange(false);
      onCanceled?.(appointment.id);
    } catch (e: any) {
      setError(e?.message || "Failed to cancel appointment");
    } finally {
      setIsSubmitting(false);
    }
  }

  const apptTimeLabel = appointment
    ? formatJavaDate(appointment.appointmentTime)
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {appointment ? (
              <>
                You’re about to cancel your appointment on{" "}
                <span className="font-medium">{apptTimeLabel}</span>.
              </>
            ) : (
              "You’re about to cancel this appointment."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTitle>Deposits are non-refundable</AlertTitle>
            <AlertDescription className="text-sm">
              If you cancel, your deposit will not be refunded.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Reason (optional)</h3>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional - Let us know why you're canceling"
              rows={4}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              This will be shared with the business.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Keep my appointment
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting || !appointment}
          >
            {isSubmitting ? "Canceling…" : "Confirm cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
