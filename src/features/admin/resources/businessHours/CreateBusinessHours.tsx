import { Create, SimpleForm, SaveButton, SelectInput } from "@/features/admin";
import {
  buildTimeChoices,
  CLOSED_CHOICES,
  DAYS_OF_WEEK,
  required,
  validateTimes,
} from "@/features/admin/ra/businessHours";
import RASelect from "../../components/inputs/RASelect";

function CreateBusinessHoursToolbar() {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </div>
  );
}

const TIME_CHOICES = buildTimeChoices();

export default function CreateBusinessHours() {
  return (
    <Create
      transform={(data) => ({
        dayOfWeek: data.dayOfWeek,
        isClosed: Boolean(data.isClosed),
        openTime: data.isClosed ? null : data.openTime,
        closeTime: data.isClosed ? null : data.closeTime,
      })}
      title="Create Business Hours"
    >
      <SimpleForm
        toolbar={<CreateBusinessHoursToolbar />}
        validate={validateTimes}
      >
        <div className="grid grid-rows-1 grid-cols-1 gap-6">
          <section className="rounded-md border p-4 space-y-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              New Day
            </h3>

            <SelectInput
              label="Open for business?"
              source="isClosed"
              choices={CLOSED_CHOICES}
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
    </Create>
  );
}
