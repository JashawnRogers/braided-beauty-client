import {
  Edit,
  TextInput,
  SelectInput,
  DateField,
  SaveButton,
  DeleteButton,
  TextField,
  SimpleForm,
  FormToolbar,
  EmailField,
  NumberInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  AutocompleteInput,
} from "@/features/admin";
import { useWatch } from "react-hook-form";
import { useRefresh, useNotify } from "ra-core";
import { PayViaCashButton } from "../../components/buttons/pay-via-cash-button";
import { ReferenceInput } from "../../components/inputs/reference-input";
import { PayViaCardButton } from "../../components/buttons/pay-via-card-button";

const APPOINTMENT_STATUS_CHOICES = [
  { id: "CONFIRMED", name: "Confirmed" },
  { id: "CANCELLED", name: "Cancelled" },
  { id: "COMPLETED", name: "Completed" },
  { id: "NO_SHOW", name: "No Show" },
  { id: "PENDING_CONFIRMATION", name: "Pending confirmation" },
];

const PAYMENT_STATUS_CHOICES = [
  { id: "PENDING_PAYMENT", name: "Pending payment" },
  { id: "PAID_DEPOSIT", name: "Paid deposit" },
  { id: "PAID_IN_FULL", name: "Paid in full" },
  { id: "PAYMENT_FAILED", name: "Payment failed" },
  { id: "REFUNDED", name: "Refunded" },
  { id: "NO_DEPOSIT_REQUIRED", name: "No deposit required" },
];

// Validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;

// Helpers for datetime-local <-> ISO string
const toLocalInput = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  // YYYY-MM-DDTHH:mm for datetime-local
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (local?: string | null) => {
  if (!local) return undefined;
  const ms = Date.parse(local);
  if (Number.isNaN(ms)) return undefined;
  return new Date(ms).toISOString();
};

function AppointmentEditToolbar() {
  return (
    <FormToolbar className="mt-6 flex space-x-5 justify-items-end border-t pt-4">
      <DeleteButton />
      <SaveButton />
    </FormToolbar>
  );
}

function TipInput() {
  const appointmentStatus = useWatch<{ appointmentStatus?: string }>({
    name: "appointmentStatus",
  });

  const disableTip = appointmentStatus == "COMPLETED";

  return <NumberInput source="tipAmount" label="Tip" disabled={disableTip} />;
}

export default function AppointmentEdit() {
  const notify = useNotify();
  const refresh = useRefresh();

  const onSuccess = () => {
    notify("Changes saved", { type: "success" });
    refresh();
  };

  return (
    <Edit
      redirect={false}
      title="Appointment"
      transform={(data) => ({
        appointmentId: data.id,
        note: data.note ?? null,
        cancelReason: data.cancelReason ?? null,
        serviceId: data.serviceId,
        addOnIds: data.addOnIds ?? null,
        tipAmount: data.tipAmount ?? null,
        paymentStatus: data.paymentStatus,
        appointmentStatus: data.appointmentStatus,
        appointmentTime: data.appointmentTime,
      })}
      mutationOptions={{ onSuccess }}
      mutationMode="pessimistic"
    >
      <SimpleForm
        toolbar={<AppointmentEditToolbar />}
        className="w-full"
        sanitizeEmptyValues
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-md border p-4 space-y-6">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Appointment
            </h3>

            <ReferenceInput source="serviceId" reference="services">
              <AutocompleteInput label="Service" className="min-h-14" />
            </ReferenceInput>

            <ReferenceArrayInput source="addOnIds" reference="addons">
              <AutocompleteArrayInput label="Add-Ons" optionText="name" />
            </ReferenceArrayInput>

            <TextInput
              source="appointmentTime"
              label="Appointment Time"
              type="datetime-local"
              format={toLocalInput} // record -> input
              parse={fromLocalInput} // input -> record
              validate={required()}
            />

            <SelectInput
              source="appointmentStatus"
              label="Appointment Status"
              choices={APPOINTMENT_STATUS_CHOICES}
              validate={required()}
            />
            <SelectInput
              source="paymentStatus"
              label="Payment Status"
              choices={PAYMENT_STATUS_CHOICES}
              validate={required()}
            />

            <TipInput />

            <NumberInput
              source="remainingBalance"
              label="Remaining Balance (excluding tip)"
              disabled
            />

            <NumberInput
              source="totalAmount"
              label="Total Cost (including tip)"
              disabled
            />
          </section>

          {/* Right: read-only meta & embedded service info (optional) */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Meta
            </h3>
            <div className="grid grid-cols-[10rem,1fr] items-start gap-y-2 text-sm">
              <span className="text-muted-foreground">ID</span>
              <TextField source="id" />

              <span className="text-muted-foreground">Customer Name</span>
              <TextField source="customerName" />

              <span className="text-muted-foreground">Customer Email</span>
              <EmailField source="customerEmail" aria-disabled />

              <span className="text-muted-foreground">Created</span>
              <DateField source="createdAt" showDate showTime />

              <span className="text-muted-foreground">Updated</span>
              <DateField source="updatedAt" showDate showTime />
            </div>

            <TextInput
              source="note"
              label="Notes"
              multiline
              rows={4}
              maxLength={250}
              className="min-w-full mt-4"
            />

            <div className="flex mt-10 gap-2">
              <PayViaCashButton />
              <PayViaCardButton />
            </div>
          </section>
        </div>
      </SimpleForm>
    </Edit>
  );
}
