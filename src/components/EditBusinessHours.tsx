import {
  Edit,
  SimpleForm,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  TextInput,
  BooleanInput,
  required,
  useNotify,
  useRedirect,
} from "react-admin";

const DAYS = [
  { id: "MONDAY", name: "Monday" },
  { id: "TUESDAY", name: "Tuesday" },
  { id: "WEDNESDAY", name: "Wednesday" },
  { id: "THURSDAY", name: "Thursday" },
  { id: "FRIDAY", name: "Friday" },
  { id: "SATURDAY", name: "Saturday" },
  { id: "SUNDAY", name: "Sunday" },
];

const defaultHours = DAYS.map((d) => ({
  dayOfWeek: d.id,
  openTime: "09:00",
  closeTime: "17:00",
  isClosed: d.id === "SUNDAY", // example default
}));

// Simple validator: require times when not closed & open < close
const validateRow = (values: any) => {
  const errors: any = {};
  if (!values.isClosed) {
    if (!values.openTime) errors.openTime = "Required";
    if (!values.closeTime) errors.closeTime = "Required";
    if (
      values.openTime &&
      values.closeTime &&
      values.openTime >= values.closeTime
    ) {
      errors.closeTime = "Must be after open time";
    }
  }
  return errors;
};

export default function AdminBusinessSettingsEdit() {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Edit
      mutationOptions={{
        onSuccess: () => {
          notify("Saved", { type: "info" });
          redirect("list", "business-settings");
        },
      }}
    >
      <SimpleForm defaultValues={{ businessHours: defaultHours }}>
        <ArrayInput source="businessHours" label="Business Hours">
          <SimpleFormIterator
            getItemLabel={(index) => DAYS[index]?.name ?? `Day ${index + 1}`}
            inline
          >
            <SelectInput
              source="dayOfWeek"
              choices={DAYS}
              validate={required()}
              fullWidth
            />
            <TextInput
              source="openTime"
              type="time"
              parse={(v) => v || null}
              validate={(all) => validateRow(all)}
            />
            <TextInput
              source="closeTime"
              type="time"
              parse={(v) => v || null}
              validate={(all) => validateRow(all)}
            />
            <BooleanInput source="isClosed" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
}
