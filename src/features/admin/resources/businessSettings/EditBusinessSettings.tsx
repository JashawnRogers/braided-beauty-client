import {
  Edit,
  SimpleForm,
  NumberInput,
  TextInput,
  SaveButton,
  FormToolbar,
} from "@/features/admin";
import { phone } from "@/lib/formatPhone";

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
      transform={(data) => ({
        ...data,
        discountPercentage: data.discountPercentage,
        companyPhoneNumber: phone.toE164(data.companyPhoneNumber) ?? "",
      })}
      resource="business-settings"
      id="singleton"
      title="Edit Business Settings"
    >
      <SimpleForm toolbar={<SettingsToolbar />}>
        <TextInput
          source="companyAddress"
          label="Company Address"
          multiline
          className="w-1/2"
        />

        <TextInput
          source="companyPhoneNumber"
          label="Company Phone Number"
          format={(value) => phone.formatFromE164(value)}
          parse={(value) => phone.toRaw(value)}
          className="w-1/2"
        />

        <TextInput
          source="companyEmail"
          label="Company Email Address"
          className="w-1/2"
        />

        <NumberInput
          source="appointmentBufferTime"
          label="Appointment Buffer Time (in minutes)"
          min={0}
          className="w-1/2"
        />

        <NumberInput
          source="discountPercentage"
          label="Deposit Percentage"
          min={0}
          step={0.01}
          format={(value) => (value == null ? 0 : Number(value))}
          className="w-1/2"
        />
      </SimpleForm>
    </Edit>
  );
}
