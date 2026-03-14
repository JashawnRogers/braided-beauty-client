import {
  Edit,
  SimpleForm,
  SaveButton,
  FormToolbar,
  TextInput,
  NumberInput,
  DateField,
} from "@/features/admin";

function FeeToolbar() {
  return (
    <FormToolbar className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </FormToolbar>
  );
}

export default function EditFees() {
  return (
    <Edit
      resource="fee"
      transform={(data) => ({
        id: data.id,
        name: data.name,
        amount: data.amount,
      })}
      title="Edit Fee"
      redirect="list"
    >
      <SimpleForm toolbar={<FeeToolbar />}>
        <TextInput source="id" label="ID" readOnly className="w-1/3" />

        <TextInput source="name" label="Name" className="w-1/3" />
        <NumberInput source="amount" label="Amount" className="w-1/3" />

        <DateField source="createdAt" title="Created At" className="w-1/3" />

        <DateField source="updatedAt" title="Updated At" className="w-1/3" />
      </SimpleForm>
    </Edit>
  );
}
