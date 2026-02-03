import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SaveButton,
  DeleteButton,
  DateField,
  TextField,
  SelectInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  FileInput,
} from "@/features/admin";
import { ReferenceInput } from "@/features/admin/components/inputs/reference-input";
import { useWatch } from "react-hook-form";
import { transformServiceEdit } from "../../../../lib/mediaTransform";

// Simple validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;

const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be ≥ 0" : undefined;

const maxLen =
  (n: number, msg = `Max ${n} characters`) =>
  (v: string) =>
    v && v.length > n ? msg : undefined;

function ServiceEditToolbar() {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
      <DeleteButton />
      <SaveButton />
    </div>
  );
}

export default function ServiceEdit() {
  return (
    <Edit
      mutationMode="pessimistic"
      transform={transformServiceEdit}
      queryOptions={{
        select: (data) => ({
          ...data,
          addOnIds: data.addOnIds ?? data.addOns?.map((a: any) => a.id ?? []),
        }),
      }}
    >
      <SimpleForm toolbar={<ServiceEditToolbar />}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left column: main editable fields */}
          <section className="rounded-md border p-4 space-y-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Service
            </h3>

            <TextInput source="name" label="Name" validate={required()} />

            <ReferenceInput source="categoryId" reference="categories">
              <SelectInput label="Category" optionText="name" />
            </ReferenceInput>

            <ReferenceArrayInput source="addOnIds" reference="addons">
              <AutocompleteArrayInput label="Add-Ons" optionText="name" />
            </ReferenceArrayInput>

            <TextInput
              source="description"
              label="Description"
              multiline
              rows={4}
              validate={maxLen(250)}
            />

            {/* Money fields (BigDecimal on backend) */}
            <NumberInput
              source="price"
              label="Price (USD)"
              step={0.01}
              min={0}
              validate={nonNegative}
            />

            <NumberInput
              source="depositAmount"
              label="Deposit (USD)"
              step={0.01}
              min={0}
              validate={nonNegative}
            />

            {/* Duration in minutes */}
            <NumberInput
              source="durationMinutes"
              label="Duration (minutes)"
              min={0}
              step={5}
              validate={nonNegative}
            />
          </section>

          {/* Right column: media + meta */}
          <section className="rounded-md border p-4 space-y-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Media
            </h3>

            <FileInput
              source="photoFiles"
              label="Photo URL"
              multiple
              placeholder="Drag and drop an image here"
            />

            {/* Tiny preview area */}
            <div className="mt-4 space-y-3">
              <MediaPreview />
            </div>

            <h3 className="mt-6 mb-3 text-sm font-semibold text-muted-foreground">
              Meta
            </h3>
            <div className="grid grid-cols-1 items-start gap-y-2 text-sm">
              <div className="space-x-5">
                <span className="text-muted-foreground">ID</span>
                <TextField source="id" />
              </div>
              <div className="space-x-5">
                <span className="text-muted-foreground">Times Booked</span>
                <TextField source="timesBooked" />
              </div>

              <div className="space-x-5">
                <span className="text-muted-foreground">Created</span>
                <DateField source="createdAt" showTime />
              </div>

              <div className="space-x-5">
                <span className="text-muted-foreground">Updated</span>
                <DateField source="updatedAt" showTime />
              </div>
            </div>
          </section>
        </div>
      </SimpleForm>
    </Edit>
  );
}

/**
 * Optional inline preview for photo based on current form values.
 * Falls back gracefully if fields are empty/invalid.
 */
function MediaPreview() {
  const photoFiles: any[] = useWatch({ name: "photoFiles" }) ?? [];

  const files = Array.isArray(photoFiles) ? photoFiles : [];

  if (!files.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Preview ({files.length})</p>

      <div className="grid grid-cols-3 gap-2">
        {files.slice(0, 6).map((item, idx) => {
          const src =
            item?.src ??
            (item?.rawFile instanceof File
              ? URL.createObjectURL(item.rawFile)
              : null);

          if (!src) return null;

          return (
            <img
              key={idx}
              src={src}
              alt="Preview"
              className="h-20 w-full rounded object-cover border"
            />
          );
        })}
      </div>
    </div>
  );
}
