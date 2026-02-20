import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";

type Props = {
  readonly open: boolean;
  onOpenChange: (open: boolean) => void;

  readonly isGuest: boolean;

  readonly guestEmail: string;
  readonly onGuestEmailChange: (value: string) => void;

  readonly note: string;
  readonly onNoteChange: (value: string) => void;

  readonly promoCode: string;
  readonly onPromoCodeChange: (value: string) => void;

  readonly appointmentError: string | null;

  readonly isSubmitting: boolean;
  readonly onSubmit: () => void;

  // Optional UI helpers
  readonly summaryTitle?: string; // e.g. "Feb 19, 2026 2:00 PM"
  readonly serviceName?: string;
  readonly totalMinutes?: number;
  readonly totalPrice?: number;

  // Optional: if you want the checkbox label to link to a policy page/section
  readonly policyHref?: string; // e.g. "/policy"
};

function isValidEmail(email: string) {
  // good-enough UI validation (server is still the source of truth)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function BookingDetailsDialog({
  open,
  onOpenChange,
  isGuest,
  guestEmail,
  onGuestEmailChange,
  note,
  onNoteChange,
  promoCode,
  onPromoCodeChange,
  appointmentError,
  isSubmitting,
  onSubmit,
  summaryTitle,
  serviceName,
  totalMinutes,
  totalPrice,
  policyHref,
}: Readonly<Props>) {
  const guestEmailError = useMemo(() => {
    if (!isGuest) return null;
    if (!guestEmail.trim()) return "Email is required for guests.";
    if (!isValidEmail(guestEmail)) return "Please enter a valid email.";
    return null;
  }, [isGuest, guestEmail]);

  // NEW: policy acknowledgement
  const [policyAccepted, setPolicyAccepted] = useState(false);

  // NEW: reset checkbox (and any UI-only state) whenever dialog opens
  useEffect(() => {
    if (open) {
      setPolicyAccepted(false);
    }
  }, [open]);

  const policyError = useMemo(() => {
    if (!open) return null;
    if (policyAccepted) return null;
    return "Please confirm you've read the booking policy.";
  }, [open, policyAccepted]);

  const canSubmit = !isSubmitting && !guestEmailError && policyAccepted;

  const handleSubmit = () => {
    // guard (nice UX + avoids accidental calls)
    if (!policyAccepted) return;
    if (guestEmailError) return;
    onSubmit();
  };

  const hasHeader = Boolean(serviceName || summaryTitle);
  const hasMeta = totalMinutes != null || totalPrice != null;

  const formatMoney = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm your booking</DialogTitle>
        </DialogHeader>

        {/* Summary (helps UX a lot) */}
        {hasHeader && (
          <div className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {serviceName && (
                  <div className="truncate text-sm font-medium">
                    {serviceName}
                  </div>
                )}
                {summaryTitle && (
                  <div className="text-xs text-muted-foreground">
                    {summaryTitle}
                  </div>
                )}
              </div>

              {totalPrice != null && (
                <div className="shrink-0 text-sm font-semibold">
                  ${formatMoney(totalPrice)}
                </div>
              )}
            </div>

            {hasMeta && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {totalMinutes != null && (
                  <span className="rounded-md bg-muted px-2 py-1">
                    {totalMinutes} min
                  </span>
                )}
                {/* Only show price chip if you *didn't* show it top-right */}
                {totalPrice != null && (
                  <span className="rounded-md bg-muted px-2 py-1">
                    ${formatMoney(totalPrice)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Promo code (guest + member) */}
        <div className="space-y-2">
          <Label htmlFor="promoCode">Promo code (optional)</Label>
          <Input
            id="promoCode"
            placeholder="e.g. WELCOME10"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Promo is applied to the remaining balance (after deposit), if
            eligible.
          </p>
        </div>

        {/* Guest Email */}
        {isGuest && (
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email for confirmation</Label>
            <Input
              id="guestEmail"
              type="email"
              placeholder="you@example.com"
              value={guestEmail}
              onChange={(e) => onGuestEmailChange(e.target.value)}
            />
            {guestEmailError && (
              <p className="text-xs text-destructive">{guestEmailError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              We'll only use this to send your booking confirmation and receipt.
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="note">Notes (optional)</Label>
          <Textarea
            id="note"
            placeholder="Anything the stylist should know?"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
          />
        </div>

        {/* NEW: Booking policy checkbox */}
        <div className="space-y-2">
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <Checkbox
              id="policyAccepted"
              checked={policyAccepted}
              onCheckedChange={(v) => setPolicyAccepted(v === true)}
              className="mt-0.5"
            />
            <div className="grid gap-1 leading-none">
              <Label htmlFor="policyAccepted" className="cursor-pointer">
                I have read and agree to the booking policy
              </Label>

              {policyHref ? (
                <a
                  href={policyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-foreground underline underline-offset-4"
                >
                  View policy
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Please review the policy above before booking.
                </p>
              )}
            </div>
          </div>

          {!policyAccepted && (
            <p className="text-xs text-destructive">{policyError}</p>
          )}
        </div>

        {appointmentError && (
          <p className="text-sm text-destructive">{appointmentError}</p>
        )}

        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
            {isSubmitting ? "Booking..." : "Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
