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

  // Optional label override per page
  heading?: string;
  subheading?: string;

  isFinalPayment: boolean;
}>;

function formatUsd(n?: number | null) {
  if (n == null || !Number.isFinite(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
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
  isFinalPayment,
}: ReceiptCardProps) {
  const safeAddOns = useMemo(() => addOns ?? [], [addOns]);

  const addOnsTotal = useMemo(
    () => safeAddOns.reduce((sum, a) => sum + (Number(a.price) || 0), 0),
    [safeAddOns]
  );

  const hasTip = (tipAmount ?? 0) > 0;

  const paidToday =
    (servicePrice ?? 0) - (depositAmount ?? 0) + (tipAmount ?? 0) + addOnsTotal;

  const aptCostLessDeposit =
    (servicePrice ?? 0) + (addOnsTotal ?? 0) - (depositAmount ?? 0);

  const aptCostLessTip = (servicePrice ?? 0) + (addOnsTotal ?? 0);

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
              {formatUsd(Math.abs(paidToday))}
            </dd>
          </>
        ) : (
          <>
            <dt className="px-6 py-4 text-sm text-muted-foreground">
              {"Paid today (deposit)"}
            </dt>
            <dd className="px-6 py-4 text-sm font-semibold text-right">
              {formatUsd(Math.abs(depositAmount ?? 0))}
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
