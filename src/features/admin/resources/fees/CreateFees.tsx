import {
  Create,
  SimpleForm,
  SaveButton,
  TextInput,
  NumberInput,
} from "@/features/admin";

function CreateFeesToolbar() {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </div>
  );
}

const required =
  (msg = "Required") =>
  (v: string) =>
    v === null || v === undefined || v === "" ? msg : undefined;

export default function CreateFees() {
  return (
    <Create
      transform={(data) => ({
        name: data.name,
        amount: data.amount,
      })}
      redirect="list"
    >
      <SimpleForm toolbar={<CreateFeesToolbar />}>
        <TextInput
          source="name"
          label="Name"
          validate={required()}
          className="w-1/3"
        />
        <NumberInput source="amount" label="Amount" className="w-1/3" />
      </SimpleForm>
    </Create>
  );
}
