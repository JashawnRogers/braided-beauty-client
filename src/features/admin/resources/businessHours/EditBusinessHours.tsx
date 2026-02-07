import {
  Edit,
  SimpleForm,
  SelectInput,
  SaveButton,
  DeleteButton,
} from "@/features/admin";
import {
  buildTimeChoices,
  CLOSED_CHOICES,
  DAYS_OF_WEEK,
  required,
  validateTimes,
  toBoolean,
} from "@/features/admin/ra/businessHours";
import RASelect from "../../components/inputs/RASelect";

function EditBusinessHoursToolbar() {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
      <DeleteButton />
      <SaveButton />
    </div>
  );
}

const TIME_CHOICES = buildTimeChoices();

export default function EditBusinessHours() {
  return (
    <Edit
      transform={(data) => ({
        dayOfWeek: data.dayOfWeek,
        isClosed: toBoolean(data.isClosed),
        openTime: data.isClosed ? null : data.openTime,
        closeTime: data.isClosed ? null : data.closeTime,
      })}
      title="Edit Business Hours"
    >
      <SimpleForm
        toolbar={<EditBusinessHoursToolbar />}
        validate={validateTimes}
      >
        <div className="grid grid-rows-1 grid-cols-1 gap-6">
          <section className="rounded-md border p-4 space-y-4">
            <SelectInput
              label="Open for business?"
              source="closed"
              choices={CLOSED_CHOICES}
              format={(v) => (v === true ? "true" : v === false ? "false" : v)}
              parse={(v) => v === "true"}
              className="py-3 w-1/2"
            />
            <SelectInput
              label="Day of Week"
              source="dayOfWeek"
              choices={DAYS_OF_WEEK}
              className="w-1/2"
              validate={required()}
            />
            <RASelect
              label="Open"
              source="openTime"
              choices={TIME_CHOICES}
              triggerClassName="w-1/2"
              contentClassName="w-1/2"
            />
            <RASelect
              label="Close"
              source="closeTime"
              choices={TIME_CHOICES}
              triggerClassName="w-1/2"
              contentClassName="w-1/2"
            />
          </section>
        </div>
      </SimpleForm>
    </Edit>
  );
}
