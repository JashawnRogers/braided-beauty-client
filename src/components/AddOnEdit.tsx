import {
  Edit,
  SimpleForm,
  FormToolbar,
  TextInput,
  NumberInput,
  SaveButton,
  DeleteButton,
} from "./admin";

// validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;

const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be ≥ 0" : undefined;

function AddOnToolBar() {
  return (
    <FormToolbar className="mt-6 flex space-x-5 justify-items-end border-t pt-4">
      <DeleteButton />
      <SaveButton />
    </FormToolbar>
  );
}

export default function AddOnEdit() {
  return (
    <Edit
      transform={(data) => ({
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description,
      })}
    >
      <SimpleForm
        className="w-full"
        toolbar={<AddOnToolBar />}
        sanitizeEmptyValues
      >
        <div className="grid grid-cols-1 md:gap-6 md:grid-cols-2">
          {/* Left: editable fields */}
          <section className="w-full rounded-md border p-4 space-y-8">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Add-On
            </h3>
            <TextInput source="name" label="Name" validate={required()} />

            <NumberInput
              source="price"
              label="Price (USD)"
              min={0}
              validate={nonNegative}
            />
          </section>

          {/* Right side */}
          <section className="rounded-md border p-4">
            <TextInput source="description" maxLength={255} multiline />
          </section>
        </div>
      </SimpleForm>
    </Edit>
  );
}
