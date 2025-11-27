import {
  Edit,
  Form,
  TextInput,
  NumberInput,
  SelectInput,
  AutocompleteInput,
  DateField,
  SaveButton,
  DeleteButton,
  TextField,
} from "@/features/admin";
import { ReferenceInput } from "@/features/admin/components/inputs/reference-input";
import { useForm } from "react-hook-form";

const APPOINTMENT_STATUS_CHOICES = [
  { id: "SCHEDULED", name: "Scheduled" },
  { id: "CONFIRMED", name: "Confirmed" },
  { id: "COMPLETED", name: "Completed" },
  { id: "CANCELLED", name: "Cancelled" },
  { id: "NO_SHOW", name: "No Show" },
];

const PAYMENT_STATUS_CHOICES = [
  { id: "PENDING", name: "Pending" },
  { id: "AUTHORIZED", name: "Authorized" },
  { id: "PAID", name: "Paid" },
  { id: "REFUNDED", name: "Refunded" },
  { id: "FAILED", name: "Failed" },
];

// Validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;
const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be greater than or equal to 0" : undefined;

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

export default function AppointmentEdit() {
  const form = useForm();

  return (
    <Edit>
      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: editable appointment fields */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Appointment
            </h3>

            <ReferenceInput
              source="serviceId"
              reference="services"
              label="Service"
            >
              <AutocompleteInput optionText="name" />
            </ReferenceInput>

            <TextInput
              source="appointmentTime"
              label="When"
              type="datetime-local"
              format={toLocalInput} // record -> input
              parse={fromLocalInput} // input -> record
              validate={required()}
            />

            <SelectInput
              source="appointmentStatus"
              label="Status"
              choices={APPOINTMENT_STATUS_CHOICES}
              validate={required()}
            />
            <SelectInput
              source="paymentStatus"
              label="Payment"
              choices={PAYMENT_STATUS_CHOICES}
              validate={required()}
            />

            <NumberInput
              source="depositAmount"
              label="Deposit"
              step={0.01}
              min={0}
              validate={nonNegative}
            />
            <NumberInput
              source="pointsEarned"
              label="Points Earned"
              min={0}
              disabled
            />

            {/* Stripe + Note */}
            <TextInput source="stripePaymentId" label="Stripe Payment ID" />
            <TextInput source="note" label="Note" />
          </section>

          {/* Right: read-only meta & embedded service info (optional) */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Meta
            </h3>
            <div className="grid grid-cols-[10rem,1fr] items-start gap-y-2 text-sm">
              <span className="text-muted-foreground">ID</span>
              <TextField source="id" />

              <span className="text-muted-foreground">Created</span>
              <DateField source="createdAt" showTime />

              <span className="text-muted-foreground">Updated</span>
              <DateField source="updatedAt" showTime />
            </div>

            <div className="mt-4 grid grid-cols-[10rem,1fr] items-start gap-y-2 text-sm">
              <span className="text-muted-foreground">Service Name</span>
              <TextField source="service.name" />
              <span className="text-muted-foreground">Service Price</span>
              <TextField source="service.price" />
              <span className="text-muted-foreground">Service Duration</span>
              <TextField source="service.durationMinutes" />
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          <DeleteButton />
          <SaveButton />
        </div>
      </Form>
    </Edit>
  );
}
