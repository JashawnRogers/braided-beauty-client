import {
  Create,
  SimpleForm,
  SaveButton,
  TextInput,
  SelectInput,
  NumberInput,
} from "@/features/admin";

function CreatePromoToolbar() {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </div>
  );
}

const required =
  (msg = "Required") =>
  (v: any) =>
    v === null || v === undefined || v === "" ? msg : undefined;

const requiredNumber =
  (msg = "Required") =>
  (v: any) =>
    v === null || v === undefined || v === "" || Number.isNaN(Number(v))
      ? msg
      : undefined;

const nonNegative =
  (msg = "Must be >= 0") =>
  (v: any) =>
    v == null ? undefined : Number(v) < 0 ? msg : undefined;

const percentRange =
  (msg = "Percent must be between 1 and 100") =>
  (v: any, allValues?: any) => {
    if (v == null || v === "") return undefined;

    // only enforce when discountType is PERCENT
    if (allValues?.discountType !== "PERCENT") return undefined;

    const n = Number(v);
    if (Number.isNaN(n)) return "Must be a number";
    if (n < 1 || n > 100) return msg;
    return undefined;
  };

export default function CreatePromoCodes() {
  return (
    <Create
      transform={(data) => {
        // active comes from SelectInput as "true" | "false" (string)
        // but backend expects boolean
        const active =
          data.active === "true"
            ? true
            : data.active === "false"
            ? false
            : true; // fallback default

        return {
          // backend expects codeName, discountType, value, active, startsAt, endsAt, maxRedemptions
          codeName: data.codeName?.trim(),
          discountType: data.discountType,
          value: data.value,
          active,
          startsAt: data.startsAt || null,
          endsAt: data.endsAt || null,
          maxRedemptions:
            data.maxRedemptions === "" || data.maxRedemptions == null
              ? null
              : Number(data.maxRedemptions),
        };
      }}
      redirect="list"
    >
      <SimpleForm toolbar={<CreatePromoToolbar />}>
        <TextInput
          source="codeName"
          label="Code"
          validate={required("Promo code name is required")}
          className="w-1/3"
          helperText="Example: WELCOME10 (case-insensitive; saved as uppercase)"
        />

        <SelectInput
          source="discountType"
          label="Discount Type"
          choices={[
            { id: "PERCENT", name: "Percent" },
            { id: "AMOUNT", name: "Amount ($)" },
          ]}
          validate={required("Discount type is required")}
          className="w-1/3"
        />

        <NumberInput
          source="value"
          label="Value"
          validate={[
            requiredNumber("Value is required"),
            nonNegative("Value cannot be negative"),
            percentRange(),
          ]}
          className="w-1/3"
          helperText="Percent: 1–100. Amount: dollars off."
        />

        <SelectInput
          source="active"
          label="Active"
          choices={[
            { id: "true", name: "Active" },
            { id: "false", name: "Inactive" },
          ]}
          defaultValue="true"
          className="w-1/3"
        />

        <NumberInput
          source="maxRedemptions"
          label="Max Redemptions (optional)"
          validate={[nonNegative("Max redemptions cannot be negative")]}
          className="w-1/3"
          helperText="Leave blank for unlimited."
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
    </Create>
  );
}
