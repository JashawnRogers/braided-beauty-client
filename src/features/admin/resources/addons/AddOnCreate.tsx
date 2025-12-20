import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SaveButton,
  FormToolbar,
} from "@/features/admin";

// validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;

const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be ≥ 0" : undefined;

function AddOnCreateToolbar() {
  return (
    <FormToolbar className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </FormToolbar>
  );
}

export default function AddOnCreate() {
  return (
    <Create
      transform={(data) => ({
        name: data.name,
        price: data.price,
        description: data.description,
        durationMinutes: data.durationMinutes,
      })}
    >
      <SimpleForm toolbar={<AddOnCreateToolbar />}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: fields */}
          <section className="rounded-md border p-4 space-y-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              New Add-On
            </h3>

            <TextInput source="name" label="Name" validate={required()} />

            <NumberInput
              source="price"
              label="Price (USD)"
              step={5}
              min={0}
              validate={nonNegative}
            />
            <NumberInput
              source="durationMinutes"
              label="Duration (in minutes)"
              step={30}
              min={0}
              validate={nonNegative}
            />
          </section>

          {/* Right side */}
          <section className="rounded-md border p-4">
            <TextInput multiline source="description" maxLength={255} />
          </section>
        </div>
      </SimpleForm>
    </Create>
  );
}
