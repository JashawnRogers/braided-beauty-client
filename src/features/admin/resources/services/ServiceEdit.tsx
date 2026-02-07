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
import { transformServiceEdit } from "../../../../lib/mediaTransform";
import ExistingPhotos from "../../components/inputs/ExistingPhotos";

// Simple validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;

const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be ≥ 0" : undefined;

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
        select: (data) => {
          const addOnIds =
            data.addOnIds ?? data.addOns?.map((a: any) => a.id) ?? [];

          // Build FileInput-friendly array for existing photos
          const keys: string[] = Array.isArray(data.photoKeys)
            ? data.photoKeys
            : [];
          const urls: string[] = Array.isArray(data.photoUrls)
            ? data.photoUrls
            : [];

          const existingPhotoFiles = keys
            .map((key, idx) => ({
              title: key, // we'll use this as the key identity
              src: urls[idx] ?? "", // presigned URL from backend
            }))
            .filter((x) => x.src);

          return {
            ...data,
            addOnIds,
            photoFiles: existingPhotoFiles, // ✅ THIS is what FileInput will render
          };
        },
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
              maxLength={250}
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
              label="Photos (up to 5)"
              multiple
              placeholder="Drag and drop an image here"
            />

            <div className="mt-4 space-y-3">
              <ExistingPhotos />
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
