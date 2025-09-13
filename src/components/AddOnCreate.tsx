import { Create, Form, TextInput, NumberInput, SaveButton } from "./admin";
import { useForm } from "react-hook-form";

// validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;

const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be ≥ 0" : undefined;

export default function AddOnCreate() {
  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  return (
    <Create>
      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: fields */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              New Add-On
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

          {/* Right: (empty / hints) */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Tips
            </h3>
            <p className="text-sm text-muted-foreground">
              Add-ons are optional extras customers can attach to a service.
              Keep names short and clear (e.g., “Extra Length”, “Beads”).
            </p>
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          <SaveButton />
        </div>
      </Form>
    </Create>
  );
}
