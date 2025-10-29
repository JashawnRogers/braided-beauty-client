import {
  Edit,
  SimpleForm,
  NumberInput,
  SaveButton,
  FormToolbar,
  SelectInput,
} from "../../admin";

const required =
  (msg = "Required") =>
  (v: any) =>
    v === null || v === undefined || v === "" ? msg : undefined;

function LoyaltyToolbar() {
  return (
    <FormToolbar className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </FormToolbar>
  );
}

export default function EditLoyaltySettings() {
  return (
    <Edit resource="loyalty-settings" id="singleton">
      <SimpleForm toolbar={<LoyaltyToolbar />}>
        <SelectInput
          source="programEnabled"
          label="Loyalty Program Enabled?"
          choices={[
            { id: true, name: "Enabled" },
            { id: false, name: "Disabled" },
          ]}
          validate={required()}
        />
        <NumberInput
          source="signupBonusPoints"
          label="Signup Bonus Points"
          min={0}
        />
        <NumberInput
          source="earnPerAppointment"
          label="Points earned per appointment"
          min={0}
          step={5.0}
        />
      </SimpleForm>
    </Edit>
  );
}
