import {
  Edit,
  Form,
  TextInput,
  SelectInput,
  NumberInput,
  DateField,
  SaveButton,
  TextField,
  DeleteButton,
} from "./admin";
import { useForm } from "react-hook-form";

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

export default function UserEdit() {
  const form = useForm();
  return (
    <Edit>
      {/* One Form that wraps *all* inputs & action buttons */}
      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left column: editable fields */}
          <section className="rounded-md space-y-6 border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Profile
            </h3>

            <TextInput source="name" label="Name" validate={required()} />
            <TextInput
              source="email"
              label="Email"
              validate={[required(), email]}
            />
            <TextInput source="phone" label="Phone" />

            <SelectInput
              source="userType"
              label="User Type"
              choices={USER_TYPE_CHOICES}
              validate={required()}
            />

            <NumberInput
              source="loyaltyPoints"
              label="Loyalty Points"
              validate={nonNegative}
              min={0}
            />
          </section>

          {/* Right column: read-only meta (Fields, not Inputs) */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Meta
            </h3>
            <div className="grid grid-cols-[8rem,1fr] items-start gap-y-2 text-sm">
              <span className="text-muted-foreground">ID</span>
              <TextField source="id" />

              <span className="text-muted-foreground">Created</span>
              <DateField source="createdAt" showTime />

              <span className="text-muted-foreground">Updated</span>
              <DateField source="updatedAt" showTime />
            </div>
          </section>
        </div>

        {/* Form footer with actions (inside the Form so Save/Delete have context) */}
        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          <DeleteButton />
          <SaveButton />
        </div>
      </Form>
    </Edit>
  );
}
