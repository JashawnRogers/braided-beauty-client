import {
  Edit,
  Form,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  TextInput,
  BooleanInput,
  SaveButton,
  DeleteButton,
} from "./admin";
import { useNotify, useRedirect } from "ra-core";
import { useForm } from "react-hook-form";

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
  isClosed: d.id === "SUNDAY",
}));

/**
 * Row-level validators for ArrayInput items.
 * RA validator signature: (value, allValues, props) => string | undefined
 * Read the current row via props.index
 */
const requireWhenOpen =
  (field: "openTime" | "closeTime") =>
  (_value: string, allValues: any, props: any) => {
    const row = allValues?.businessHours?.[props?.index] ?? {};
    if (row.isClosed) return undefined;
    if (!row[field]) return "Required";
    return undefined;
  };

const closeAfterOpen = (_value: string, allValues: any, props: any) => {
  const row = allValues?.businessHours?.[props?.index] ?? {};
  if (row.isClosed) return undefined;
  if (row.openTime && row.closeTime && row.openTime >= row.closeTime) {
    return "Must be after open time";
  }
  return undefined;
};

export default function EditBusinessHours() {
  const notify = useNotify();
  const redirect = useRedirect();

  // Provide default values
  const form = useForm({
    defaultValues: { businessHours: defaultHours },
  });

  return (
    <Edit
      mutationOptions={{
        onSuccess: () => {
          notify("Saved", { type: "info" });
          redirect("list", "business-settings");
        },
      }}
    >
      {/* One form wrapping everything so inputs & actions share context */}
      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Editor column */}
          <section className="rounded-md border p-4 md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Business Hours
            </h3>

            <ArrayInput source="businessHours" label={false}>
              <SimpleFormIterator
                inline
                getItemLabel={(index) =>
                  DAYS[index]?.name ?? `Day ${index + 1}`
                }
              >
                <SelectInput
                  source="dayOfWeek"
                  label="Day"
                  choices={DAYS}
                  validate={(v: string) => (v ? undefined : "Required")}
                  className="min-w-40"
                />

                <TextInput
                  source="openTime"
                  label="Open"
                  type="time"
                  parse={(v) => v || null}
                  validate={[requireWhenOpen("openTime")]}
                  className="min-w-36"
                />

                <TextInput
                  source="closeTime"
                  label="Close"
                  type="time"
                  parse={(v) => v || null}
                  validate={[requireWhenOpen("closeTime"), closeAfterOpen]}
                  className="min-w-36"
                />

                <BooleanInput source="isClosed" label="Closed" />
              </SimpleFormIterator>
            </ArrayInput>

            <p className="mt-3 text-xs text-muted-foreground">
              Tip: Times are validated only when a day isn’t marked as “Closed”.
            </p>
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          <DeleteButton />
          <SaveButton />
        </div>
      </Form>
    </Edit>
  );
}
