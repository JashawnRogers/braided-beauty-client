import { useMemo, useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  useNotify,
  useRecordContext,
  useDataProvider,
  useRefresh,
} from "ra-core";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/apiClient";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import FinalPaymentQrModal from "../qr-code";
import type { AdminAppointmentRequestDTO } from "@/features/account/types";

type CheckoutLinkResponse = {
  checkoutUrl: string;
  appointmentId: string;
};

function formatUsd(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n)
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "-";
}

export function PayViaCardButton() {
  const notify = useNotify();
  const { id } = useParams();
  const record = useRecordContext();
  const { getValues } = useFormContext();

  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const pollRef = useRef<number | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const summary = useMemo(() => {
    const v = getValues();
    return {
      customerName: record?.customerName,
      customerEmail: record?.customerEmail,
      serviceName: record?.serviceName,
      remainingBalance: v.remainingBalance ?? record?.remainingBalance,
      tipAmount: v.tipAmount ?? null,
      totalAmount: v.totalAmount ?? record?.totalAmount,
      paymentStatus: v.paymentStatus ?? record?.paymentStatus,
      appointmentStatus: v.appointmentStatus ?? record?.appointmentStatus,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);

  const isAlreadyPaid = summary.paymentStatus === "PAID_IN_FULL";

  const startPolling = (appointmentId: string) => {
    if (pollRef.current) window.clearInterval(pollRef.current);

    pollRef.current = window.setInterval(async () => {
      try {
        const { data } = await dataProvider.getOne("appointments", {
          id: appointmentId,
        });

        const paid = data.paymentStatus;

        if (paid === "PAID_IN_FULL") {
          window.clearInterval(pollRef.current!);

          notify("Payment successful ✅", { type: "success" });
          refresh();
          setQrOpen(false);
        } else if (paid === "PAYMENT_FAILED") {
          notify("Payment failed. Please retry or change payment method", {
            type: "error",
          });
          refresh();
          setQrOpen(false);
        }
      } catch {
        // ignoring transient errors
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  const onCreateCheckoutLink = async () => {
    const values = getValues();

    if (!id) {
      notify("Missing appointment ID. Please refresh and try again.", {
        type: "error",
      });
      return;
    }

    // Use same DTO style you already have if you want to include tipAmount
    const payload: AdminAppointmentRequestDTO = {
      appointmentId: record?.id ?? values.id,
      note: values.note ?? null,
      cancelReason: values.cancelReason ?? null,
      appointmentStatus: values.appointmentStatus,
      appointmentTime: values.appointmentTime,
      serviceId: values.serviceId ?? record?.serviceId,
      addOnIds: values.addOnIds ?? null,
      tipAmount: values.tipAmount ?? null,
    };

    try {
      setBusy(true);
      // Endpoint should create final-payment checkout session and return URL
      const res = await apiPost<CheckoutLinkResponse>(
        "/appointment/closeout-stripe",
        payload
      );

      setCheckoutUrl(res.checkoutUrl);
      setConfirmOpen(false);
      setQrOpen(true);
      startPolling(record?.id ?? values?.id);

      notify("QR code ready. Have the customer scan to pay.", {
        type: "success",
      });
    } catch (err: any) {
      notify(err?.message ?? "Failed to create payment link", {
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            disabled={isAlreadyPaid || summary.remainingBalance == 0}
          >
            Pay via Card/Wallet (QR)
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            This will generate a QR code for the customer to pay the remaining
            balance.
            <div className="mt-3 space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Customer: </span>
                {summary.customerName}
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                {summary.customerEmail}
              </div>
              <div>
                <span className="text-muted-foreground">Service: </span>
                {summary.serviceName}
              </div>
              <div>
                <span className="text-muted-foreground">
                  Remaining balance:{" "}
                </span>
                {formatUsd(summary.remainingBalance)}
              </div>
              <div>
                <span className="text-muted-foreground">Tip amount: </span>
                {formatUsd(summary.tipAmount)}
              </div>
              <div>
                <span className="text-muted-foreground">
                  Total to be paid today:{" "}
                </span>
                {formatUsd(summary.remainingBalance + summary.tipAmount)}
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onCreateCheckoutLink}
              disabled={busy || !id}
            >
              {busy ? "Generating..." : "Generate QR"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-lg">
          {checkoutUrl && <FinalPaymentQrModal checkoutUrl={checkoutUrl} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
