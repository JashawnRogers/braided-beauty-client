import {
  List,
  DataTable,
  TextField,
  NumberField,
  DateField,
  TextInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
  EditButton,
} from "./admin";
import { TruncateField, MoneyField } from "./admin/fields";

// ---- Choices (adjust to your enums) ----
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

// ---- Top bar filters ----
// NOTE: dataProvider targets Spring, map these keys in getList:
//  - q -> ?search=
//  - appointmentTime_gte/lte -> ?from/to (ISO)
//  - appointmentStatus -> passthrough
//  - paymentStatus -> passthrough
//  - serviceId -> ?serviceId=
//  - serviceName -> for json-server demo only (remove once using serviceId)
const appointmentFilters = [
  <TextInput key="q" source="q" label="Search" alwaysOn />,
  <SelectInput
    key="appointmentStatus"
    source="appointmentStatus"
    label="Status"
    choices={APPOINTMENT_STATUS_CHOICES}
    emptyText="All"
    alwaysOn
  />,
  <SelectInput
    key="paymentStatus"
    source="paymentStatus"
    label="Payment"
    choices={PAYMENT_STATUS_CHOICES}
    emptyText="All"
  />,
  // If your backend expects a FK, prefer serviceId (ReferenceInput). If your list embeds `service`,
  // this is only for filtering, not display.
  <ReferenceInput
    key="serviceId"
    source="serviceId"
    reference="services"
    label="Service"
    alwaysOn={false}
  >
    <AutocompleteInput optionText="name" />
  </ReferenceInput>,
  // Date range (use type="date"); map to ISO in dataProvider
  <TextInput
    key="appointmentTime_gte"
    source="appointmentTime_gte"
    label="After"
    type="date"
  />,
  <TextInput
    key="appointmentTime_lte"
    source="appointmentTime_lte"
    label="Before"
    type="date"
  />,
];

export default function AppointmentList() {
  return (
    <List
      filters={appointmentFilters}
      perPage={25}
      sort={{ field: "appointmentTime", order: "DESC" }}
    >
      <DataTable rowClick="edit" bulkActionButtons={false}>
        <DataTable.Col source="id" label="ID" field={TextField} />

        {/* Service name from nested DTO */}
        <DataTable.Col
          source="service.name"
          label="Service"
          field={TextField}
        />

        {/* Time & statuses */}
        <DataTable.Col label="Appointment Time">
          <DateField source="appointmentTime" showTime />
        </DataTable.Col>
        <DataTable.Col
          source="appointmentStatus"
          label="Status"
          field={TextField}
        />
        <DataTable.Col
          source="paymentStatus"
          label="Payment"
          field={TextField}
        />

        {/* Money & points */}
        <DataTable.Col label="Deposit">
          <MoneyField source="depositAmount" />
        </DataTable.Col>
        <DataTable.Col
          source="pointsEarned"
          label="Points"
          field={NumberField}
        />

        {/* Stripe + Note */}
        <DataTable.Col label="Stripe Payment ID">
          <TruncateField source="stripePaymentId" max={32} />
        </DataTable.Col>
        <DataTable.Col label="Note">
          <TruncateField source="note" max={80} />
        </DataTable.Col>

        {/* Created/Updated (compact) */}
        <DataTable.Col label="Created">
          <DateField source="createdAt" showTime />
        </DataTable.Col>
        <DataTable.Col label="Updated">
          <DateField source="updatedAt" showTime />
        </DataTable.Col>

        <DataTable.Col>
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
