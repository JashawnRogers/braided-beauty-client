import { Create, SimpleForm, SaveButton, TextInput } from "../../admin";

function CreateCategoriesToolbar() {
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

export default function CreateCategories() {
  return (
    <Create
      transform={(data) => ({
        name: data.name,
      })}
      redirect="list"
    >
      <SimpleForm toolbar={<CreateCategoriesToolbar />}>
        <TextInput
          source="name"
          label="Name"
          validate={required()}
          className="w-1/3"
        />
      </SimpleForm>
    </Create>
  );
}
