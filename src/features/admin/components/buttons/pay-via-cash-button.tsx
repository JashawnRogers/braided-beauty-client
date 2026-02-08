import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNotify, useRecordContext, useRefresh } from "ra-core";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/apiClient";
import {
  AdminAppointmentSummaryDTO,
  type AdminAppointmentRequestDTO,
} from "@/features/account/types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useParams } from "react-router-dom";

function formatUsd(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n)
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "-";
}

export function PayViaCashButton() {
  const notify = useNotify();
  const refresh = useRefresh();
  const { id } = useParams();
  const record = useRecordContext(); // Loaded appointment record
  const { getValues } = useFormContext(); // Current form values including edits

  const [open, setOpen] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);

  const summary = useMemo(() => {
    const v = getValues();
    return {
      customerName: record?.customerName,
      customerEmail: record?.customerEmail,
      serviceName: record?.serviceName,
      remainingBalance: v.remainingBalance ?? record?.remainingBalance,
      tipAmount: v.tipAmount ?? null,
      totalAmount: v.totalAmount ?? record?.totalAmount,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]); // record changes when navigating; form values are read on open/confirm anyway

  const onPayCash = async () => {
    const values = getValues();

    if (!id) {
      notify("Missing appointment ID. Please refresh and try again.", {
        type: "error",
      });
      return;
    }

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

    console.log("params id: ", id);
    console.log("payload: ", payload);

    try {
      setBusy(true);
      await apiPost<AdminAppointmentSummaryDTO>(
        "/appointment/closeout-cash",
        payload
      );
      notify("Cash payment successful", { type: "success" });
      setOpen(false);
      refresh();
    } catch (err: any) {
      notify(err?.message ?? "Failed to record cash payment", {
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const isAlreadyPaid =
    record?.paymentStatus === "PAID_IN_FULL" ||
    getValues().paymentStatus == "PAID_IN_FULL";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          disabled={isAlreadyPaid || summary.remainingBalance == 0}
        >
          Pay via Cash
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          This will mark the appointment as paid via cash.
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
              <span className="text-muted-foreground">Remaining balance: </span>
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
          <AlertDialogAction onClick={onPayCash} disabled={busy || !id}>
            {busy ? "Processing..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
