import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type AddOnLine = Readonly<{
  id?: string;
  name: string;
  price: number; // dollars
}>;

type ReceiptCardProps = Readonly<{
  serviceName: string;
  servicePrice?: number | null; // dollars
  appointmentTime: string; // ISO
  durationMinutes: number;

  depositAmount?: number | null; // dollars
  remainingBalance?: number | null; // dollars
  tipAmount?: number | null; // dollars (for final payment usually)
  totalAmount: number;

  addOns?: AddOnLine[] | null;

  // NEW (optional)
  discountPercent?: number | null; // e.g. 15 for 15%
  discountAmount?: number | null; // dollars

  // Optional label override per page
  heading?: string;
  subheading?: string;

  isFinalPayment: boolean;
}>;

function formatUsd(n?: number | null) {
  if (n == null || !Number.isFinite(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function toNumber(n?: number | null) {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? v : 0;
}

export function ReceiptCard({
  heading = "You’re all set 🎉",
  subheading = "Here are your appointment details.",
  serviceName,
  servicePrice,
  appointmentTime,
  durationMinutes,
  depositAmount,
  remainingBalance,
  tipAmount,
  addOns,
  totalAmount,
  discountPercent,
  discountAmount,
  isFinalPayment,
}: ReceiptCardProps) {
  const safeAddOns = useMemo(() => addOns ?? [], [addOns]);

  const addOnsTotal = useMemo(
    () => safeAddOns.reduce((sum, a) => sum + (Number(a.price) || 0), 0),
    [safeAddOns]
  );

  const hasTip = (tipAmount ?? 0) > 0;

  const svc = toNumber(servicePrice);
  const dep = toNumber(depositAmount);
  const tip = toNumber(tipAmount);
  const discAmt = toNumber(discountAmount);
  const discPct = Math.max(0, Math.min(100, toNumber(discountPercent)));

  const hasDiscount = isFinalPayment && discAmt > 0 && discPct > 0;

  // Existing values you already show:
  const aptCostLessDeposit = svc + addOnsTotal - dep;
  const aptCostLessTip = svc + addOnsTotal;

  // Final payment “Paid today” should be (service + addOns - deposit - discount) + tip
  // Deposit flow still shows deposit only (unchanged).
  const paidTodayFinal = Math.max(
    0,
    aptCostLessDeposit - (hasDiscount ? discAmt : 0) + tip
  );

  return (
    <div className="mt-32 rounded-xl border bg-background shadow-sm">
      <div className="px-6 py-6 text-center">
        <h1 className="text-3xl font-semibold">{heading}</h1>
        <p className="mt-2 text-muted-foreground">{subheading}</p>
      </div>

      {/* Summary */}
      <dl className="grid grid-cols-[10rem,1fr] gap-x-4 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-border">
        {/* Service */}
        <dt className="px-6 py-4 text-sm text-muted-foreground">Service</dt>
        <dd className="px-6 py-4 text-sm font-medium text-right">
          {serviceName}
        </dd>

        {/* Date & Time */}
        <dt className="px-6 py-4 text-sm text-muted-foreground">Date & Time</dt>
        <dd className="px-6 py-4 text-sm font-medium text-right">
          {new Date(appointmentTime).toLocaleString()}
        </dd>

        {/* Duration */}
        <dt className="px-6 py-4 text-sm text-muted-foreground">Duration</dt>
        <dd className="px-6 py-4 text-sm font-medium text-right">
          {durationMinutes} minutes
        </dd>

        {/* Tip */}
        {hasTip && (
          <>
            <dt className="px-6 py-4 text-sm text-muted-foreground">Tip</dt>
            <dd className="px-6 py-4 text-sm font-medium text-right">
              {formatUsd(tipAmount)}
            </dd>
          </>
        )}

        {/* NEW: Discount (final payment only, if applicable) */}
        {hasDiscount && (
          <>
            <dt className="px-6 py-4 text-sm text-muted-foreground">
              Discount ({discPct}%)
            </dt>
            <dd className="px-6 py-4 text-sm font-medium text-right">
              -{formatUsd(discAmt)}
            </dd>
          </>
        )}

        {isFinalPayment ? (
          <>
            <dt className="px-6 py-4 text-sm text-muted-foreground">
              Remaining balance
            </dt>
            <dd className="px-6 py-4 text-sm font-semibold text-right">
              {formatUsd(aptCostLessDeposit)}
            </dd>
          </>
        ) : (
          <>
            <dt className="px-6 py-4 text-sm text-muted-foreground">
              Appointment total
            </dt>
            <dd className="px-6 py-4 text-sm font-semibold text-right">
              {formatUsd(aptCostLessTip)}
            </dd>
          </>
        )}

        {/* Paid today */}
        {isFinalPayment ? (
          <>
            <dt className="px-6 py-4 text-sm text-muted-foreground">
              Paid today
            </dt>
            <dd className="px-6 py-4 text-sm font-semibold text-right">
              {formatUsd(paidTodayFinal)}
            </dd>
          </>
        ) : (
          <>
            <dt className="px-6 py-4 text-sm text-muted-foreground">
              {"Paid today (deposit)"}
            </dt>
            <dd className="px-6 py-4 text-sm font-semibold text-right">
              {formatUsd(Math.abs(dep))}
            </dd>
          </>
        )}

        {/* Remaining balance */}
        {remainingBalance != null && remainingBalance > 0 && (
          <>
            <dt className="px-6 py-4 text-sm text-muted-foreground">
              Remaining balance
            </dt>
            <dd className="px-6 py-4 text-sm font-medium text-right">
              {formatUsd(remainingBalance)}
            </dd>
          </>
        )}
      </dl>

      {/* Expandable exact price breakdown */}
      <div className="px-6 pb-6 pt-4">
        <Collapsible>
          <div className="flex justify-center">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                View price breakdown <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-4">
            <div className="rounded-lg border bg-muted/30">
              <dl className="divide-y">
                <div className="flex justify-between px-4 py-3 text-sm">
                  <dt className="text-muted-foreground">Service</dt>
                  <dd className="font-medium">
                    {formatUsd(servicePrice ?? null)}
                  </dd>
                </div>

                {hasTip && (
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">Tip</dt>
                    <dd className="font-medium">
                      {formatUsd(tipAmount ?? null)}
                    </dd>
                  </div>
                )}

                {safeAddOns.map((a, idx) => (
                  <div
                    key={a.id ?? `${a.name}-${idx}`}
                    className="flex justify-between px-4 py-3 text-sm"
                  >
                    <dt className="text-muted-foreground">{a.name}</dt>
                    <dd className="font-medium">{formatUsd(a.price)}</dd>
                  </div>
                ))}

                {/* NEW: Discount line in breakdown (final payment only, if applicable) */}
                {hasDiscount && (
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">
                      Discount ({discPct}%)
                    </dt>
                    <dd className="font-medium">-{formatUsd(discAmt)}</dd>
                  </div>
                )}

                <div className="flex justify-between px-4 py-3 text-sm">
                  <dt className="text-muted-foreground">
                    Total appointment cost
                  </dt>
                  <dd className="font-semibold">{formatUsd(totalAmount)}</dd>
                </div>
              </dl>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
