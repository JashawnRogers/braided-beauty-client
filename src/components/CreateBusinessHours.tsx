import {
  Create,
  SimpleForm,
  SaveButton,
  SelectInput,
  BooleanInput,
} from "./admin";

function CreateBusinessHoursToolbar() {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </div>
  );
}

export default function CreateBusinessHours() {
  const daysOfWeek = [
    { id: "SUNDAY", name: "Sunday" },
    { id: "MONDAY", name: "Monday" },
    { id: "TUESDAY", name: "Tuesday" },
    { id: "WEDNESDAY", name: "Wednesday" },
    { id: "THURSDAY", name: "Thursday" },
    { id: "FRIDAY", name: "Friday" },
    { id: "SATURDAY", name: "Saturday" },
  ];

  const timeSlot = [
    { id: "06:00:00", name: "6:00 AM" },
    { id: "06:30:00", name: "6:30 AM" },
    { id: "07:00:00", name: "7:00 AM" },
    { id: "07:30:00", name: "7:30 AM" },
    { id: "08:00:00", name: "8:00 AM" },
    { id: "08:30:00", name: "8:30 AM" },
    { id: "09:00:00", name: "9:00 AM" },
    { id: "09:30:00", name: "9:30 AM" },
    { id: "10:00:00", name: "10:00 AM" },
    { id: "10:30:00", name: "10:30 AM" },
    { id: "11:00:00", name: "11:00 AM" },
    { id: "11:30:00", name: "11:30 AM" },
    { id: "12:00:00", name: "12:00 PM" },
    { id: "12:30:00", name: "12:30 PM" },
    { id: "13:00:00", name: "1:00 PM" },
    { id: "13:30:00", name: "1:30 PM" },
    { id: "14:00:00", name: "2:00 PM" },
    { id: "14:30:00", name: "2:30 PM" },
    { id: "15:00:00", name: "3:00 PM" },
    { id: "15:30:00", name: "3:30 PM" },
    { id: "16:00:00", name: "4:00 PM" },
    { id: "16:30:00", name: "4:30 PM" },
    { id: "17:00:00", name: "5:00 PM" },
    { id: "17:30:00", name: "5:30 PM" },
    { id: "18:00:00", name: "6:00 PM" },
    { id: "18:30:00", name: "6:30 PM" },
    { id: "19:00:00", name: "7:00 PM" },
    { id: "19:30:00", name: "7:30 PM" },
    { id: "20:00:00", name: "8:00 PM" },
    { id: "20:30:00", name: "8:30 PM" },
    { id: "21:00:00", name: "9:00 PM" },
    { id: "21:30:00", name: "9:30 PM" },
    { id: "22:00:00", name: "10:00 PM" },
    { id: "22:30:00", name: "10:30 PM" },
    { id: "23:00:00", name: "11:00 PM" },
  ];

  const required =
    (msg = "Required") =>
    (v: any) =>
      v == null || v == "" ? msg : undefined;

  const validateTimes = (values: any) => {
    const errors: Record<string, string> = {};
    if (!values.isClosed) {
      if (!values.openTime) errors.openTime = "Required";
      if (!values.closeTime) errors.closeTime = "Required";
      if (
        values.openTime &&
        values.closeTime &&
        values.openTime >= values.closeTime
      ) {
        errors.closeTime = "Close time must be after open time";
      }
    }
    return errors;
  };
  return (
    <Create
      transform={(data) => ({
        dayOfWeek: data.dayOfWeek,
        isClosed: !!data.isClosed,
        openTime: data.isClosed ? null : data.openTime,
        closeTime: data.isClosed ? null : data.closeTime,
      })}
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
              label="Day of Week"
              source="dayOfWeek"
              choices={daysOfWeek}
              className="w-1/3"
              validate={required()}
            />
            <BooleanInput
              label="Open For Business?"
              source="isClosed"
              defaultValue={false}
              className="py-3"
            />
            <SelectInput
              label="Open"
              source="openTime"
              choices={timeSlot}
              className="w-1/3"
            />
            <SelectInput
              label="Close"
              source="closeTime"
              choices={timeSlot}
              className="w-1/3"
            />
          </section>
        </div>
      </SimpleForm>
    </Create>
  );
}
