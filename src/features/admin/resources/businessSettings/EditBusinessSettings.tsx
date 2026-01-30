import {
  Edit,
  SimpleForm,
  NumberInput,
  TextInput,
  SaveButton,
  FormToolbar,
} from "@/features/admin";

function SettingsToolbar() {
  return (
    <FormToolbar className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </FormToolbar>
  );
}

export default function EditBusinessSettings() {
  return (
    <Edit
      resource="business-settings"
      id="singleton"
      title="Edit Business Settings"
    >
      <SimpleForm toolbar={<SettingsToolbar />}>
        <TextInput source="companyAddress" label="Company Address" multiline />

        <TextInput source="companyPhoneNumber" label="Company Phone Number" />

        <TextInput source="companyEmail" label="Company Email Address" />

        <NumberInput
          source="appointmentBufferTime"
          label="Appointment Buffer Time (in minutes)"
          min={0}
        />
      </SimpleForm>
    </Edit>
  );
}
