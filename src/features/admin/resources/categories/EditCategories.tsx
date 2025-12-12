import {
  Edit,
  SimpleForm,
  SaveButton,
  FormToolbar,
  TextInput,
} from "@/features/admin";

const required =
  (msg = "Required") =>
  (v: string) =>
    v === null || v === undefined || v === "" ? msg : undefined;

function CategoryToolbar() {
  return (
    <FormToolbar className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </FormToolbar>
  );
}

export default function EditCategories() {
  return (
    <Edit
      resource="categories"
      transform={(data) => ({
        id: data.id,
        name: data.name,
        description: data.description,
      })}
      title="Edit Category"
    >
      <SimpleForm toolbar={<CategoryToolbar />}>
        <TextInput source="id" label="ID" readOnly className="w-1/3" />

        <TextInput
          source="name"
          label="Name"
          validate={required()}
          className="w-1/3"
        />
        <TextInput
          source="description"
          label="Description"
          className="w-1/2"
          multiline={true}
        />
      </SimpleForm>
    </Edit>
  );
}
