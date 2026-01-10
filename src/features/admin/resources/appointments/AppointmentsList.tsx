import { List, DataTable, TextField, DateField } from "@/features/admin";
import { MoneyField } from "../../components/fields/fields";

export default function AppointmentList() {
  return (
    <List perPage={25} sort={{ field: "appointmentTime", order: "DESC" }}>
      <DataTable rowClick="edit">
        <DataTable.Col source="serviceName" label="Service" field={TextField} />
        <DataTable.Col
          source="customerName"
          label="Customer"
          field={TextField}
          disableSort
        />
        <DataTable.Col
          source="appointmentTime"
          label="Date"
          field={DateField}
        />
        <DataTable.Col
          source="appointmentStatus"
          label="Appointment Status"
          field={TextField}
        />
        <DataTable.Col
          source="totalAmount"
          label="Total Price (including tip)"
          field={MoneyField}
        />
        <DataTable.Col
          source="paymentStatus"
          label="Payment Status"
          field={TextField}
        />
      </DataTable>
    </List>
  );
}
