import {
  Edit,
  SimpleForm,
  SaveButton,
  TextInput,
  NumberInput,
  SelectInput,
  DeleteButton,
} from "@/features/admin";

function EditPromoToolbar() {
  return (
    <div className="mt-6 flex items-center justify-between gap-2 border-t pt-4">
      <DeleteButton />
      <SaveButton />
    </div>
  );
}

const required =
  (msg = "Required") =>
  (v: any) =>
    v === null || v === undefined || v === "" ? msg : undefined;

export default function EditPromoCode() {
  return (
    <Edit
      redirect="list"
      title="Edit Promo Code"
      transform={(data) => ({
        // backend expects: id, codeName, discountType, value, active, startsAt, endsAt, maxRedemptions
        id: data.id,

        codeName: data.codeName?.trim(),

        discountType: data.discountType,

        value:
          data.value === "" || data.value == null ? null : Number(data.value),

        // "true"/"false" strings -> boolean
        active:
          typeof data.active === "string"
            ? data.active === "true"
            : data.active ?? true,

        // allow blank to mean null (patch-friendly)
        startsAt: data.startsAt ? data.startsAt : null,
        endsAt: data.endsAt ? data.endsAt : null,

        maxRedemptions:
          data.maxRedemptions === "" || data.maxRedemptions == null
            ? null
            : Number(data.maxRedemptions),
      })}
    >
      <SimpleForm toolbar={<EditPromoToolbar />}>
        <TextInput
          source="codeName"
          label="Code"
          validate={required()}
          className="w-1/3"
        />

        <SelectInput
          source="discountType"
          label="Discount Type"
          validate={required()}
          choices={[
            { id: "PERCENT", name: "Percent" },
            { id: "AMOUNT", name: "Amount" },
          ]}
          className="w-1/3"
        />

        <NumberInput
          source="value"
          label="Value"
          validate={required()}
          className="w-1/3"
        />

        {/* keep consistent: string values */}
        <SelectInput
          source="active"
          label="Status"
          choices={[
            { id: "true", name: "Active" },
            { id: "false", name: "Inactive" },
          ]}
          // if the record comes in as boolean, SelectInput can still display it weirdly.
          // If you see issues, we can add a tiny defaultValue/parse/format tweak.
          className="w-1/3"
        />

        <NumberInput
          source="maxRedemptions"
          label="Max Redemptions (optional)"
          className="w-1/3"
        />

        <TextInput
          source="startsAt"
          label="Starts At (optional)"
          type="datetime-local"
          className="w-1/5"
          helperText="Leave blank to start immediately."
        />

        <TextInput
          source="endsAt"
          label="Ends At (optional)"
          type="datetime-local"
          className="w-1/5"
          helperText="Leave blank for no expiration."
        />
      </SimpleForm>
    </Edit>
  );
}
