import {
  Edit,
  Form,
  TextInput,
  NumberInput,
  SaveButton,
  DeleteButton,
  TextField,
} from "./admin";
import { useForm } from "react-hook-form";

// validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;

const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be ≥ 0" : undefined;

export default function AddOnEdit() {
  const form = useForm();

  return (
    <Edit>
      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: editable fields */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Add-On
            </h3>

            <TextInput source="name" label="Name" validate={required()} />

            <NumberInput
              source="price"
              label="Price (USD)"
              step={0.01}
              min={0}
              validate={nonNegative}
            />
          </section>

          {/* Right: meta (read-only) */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Meta
            </h3>
            <div className="grid grid-cols-[8rem,1fr] items-start gap-y-2 text-sm">
              <span className="text-muted-foreground">ID</span>
              <TextField source="id" />
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
