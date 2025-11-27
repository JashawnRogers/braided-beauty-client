import {
  Edit,
  TextInput,
  SelectInput,
  NumberInput,
  DateField,
  SaveButton,
  TextField,
  DeleteButton,
  SimpleForm,
  FormToolbar,
  DataTable,
} from "@/features/admin";
import { useRecordContext } from "ra-core";
import { phone } from "../../../../lib/formatPhone";
const USER_TYPE_CHOICES = [
  { id: "ADMIN", name: "Admin" },
  { id: "MEMBER", name: "Member" },
  { id: "GUEST", name: "Guest" },
];

// validation helpers
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;
const email = (v: string) =>
  v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Invalid email" : undefined;
const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be ≥ 0" : undefined;

function RecentAppointmentsPanel() {
  const record = useRecordContext<any>();

  const rows = record?.appointments ?? [];

  if (!rows.length) {
    return (
      <section className="w-full rounded-md border p-4 mb-6">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
          Recent Appointments
        </h3>
        <div className="text-sm text-muted-foreground">
          No recent appointments to show.
        </div>
      </section>
    );
  }

  const data = rows.map((r: any) => ({ ...r, id: r.id }));

  return (
    <section className="w-full rounded-md border p-4 mb-6">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
        Recent Appointments
      </h3>

      <DataTable
        data={data}
        rowClick={(record: any) => `/appointments/${record.id}`}
      >
        <DataTable.Col
          label="Date"
          source="appointmentTime"
          render={(row: any) =>
            row.start ? new Date(row.start).toLocaleString() : "-"
          }
        />
        <DataTable.Col label="Service" source="service.name" />
        <DataTable.Col label="Status" source="appointmentStatus" />
        <DataTable.Col label="Payment" source="paymentStatus" />
      </DataTable>
    </section>
  );
}

function UserEditToolbar() {
  return (
    <FormToolbar className="mt-6 flex space-x-5 justify-items-end border-t pt-4">
      <DeleteButton />
      <SaveButton />
    </FormToolbar>
  );
}

export default function UserEdit() {
  return (
    <Edit
      transform={(data) => ({
        id: data.id,
        name: data.name,
        email: data.email,
        userType: data.userType,
        loyaltyRecord: {
          points: data.loyaltyRecord?.points ?? 0,
          redeemedPoints: data.loyaltyRecord?.redeemedPoints ?? 0,
        },
        phoneNumber: phone.toE164(data.phoneNumber),
      })}
    >
      {/* One Form that wraps *all* inputs & action buttons */}
      <SimpleForm
        toolbar={<UserEditToolbar />}
        className="w-full"
        sanitizeEmptyValues
        defaultValues={{
          phoneNumber: "",
          loyaltyRecord: { points: 0, redeemedPoints: 0 },
        }}
      >
        <div className="grid w-full grid-cols-1 md:gap-6 md:grid-cols-2">
          {/* Left column: editable fields */}
          <section className="w-full rounded-md space-y-6 border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Profile
            </h3>

            <TextInput source="name" label="Name" validate={required()} />
            <TextInput
              source="email"
              label="Email"
              validate={[required(), email]}
            />
            <TextInput
              source="phoneNumber"
              label="Phone"
              format={(value) => phone.formatFromE164(value) ?? ""}
              parse={(value) => phone.toRaw(value) ?? ""}
              inputMode="numeric"
              placeholder="(123) 456-7890"
              validate={(value) =>
                phone.isValid(value) ? undefined : "Enter 10 digits"
              }
            />

            <SelectInput
              source="userType"
              label="User Type"
              choices={USER_TYPE_CHOICES}
              validate={required()}
            />

            <NumberInput
              source="loyaltyRecord.points"
              label="Loyalty Points"
              validate={nonNegative}
              min={0}
            />
          </section>

          {/* Right column: read-only meta (Fields, not Inputs) */}
          <section className="w-full rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Meta
            </h3>
            <div className="grid grid-cols-[6rem,1fr] items-start gap-y-2 text-sm">
              <span className="text-muted-foreground">ID</span>
              <TextField source="id" />

              <span className="text-muted-foreground">Created</span>
              <DateField source="createdAt" showTime empty={"null"} />

              <span className="text-muted-foreground">Updated</span>
              <DateField source="updatedAt" showTime />
            </div>
          </section>
        </div>
        <div className="w-full">
          <RecentAppointmentsPanel />
        </div>
      </SimpleForm>
    </Edit>
  );
}
