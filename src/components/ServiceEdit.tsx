import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SaveButton,
  DeleteButton,
  DateField,
  TextField,
} from "./admin";
import { useWatch } from "react-hook-form";
import { transformServiceEdit } from "./utils/mediaTransform";

// Simple validators
const required =
  (msg = "Required") =>
  (v: any) =>
    v == null || v === "" ? msg : undefined;

const nonNegative = (v: any) =>
  v != null && Number(v) < 0 ? "Must be ≥ 0" : undefined;

const isUrl =
  (msg = "Invalid URL") =>
  (v: string) =>
    v && !/^https?:\/\/\S+$/i.test(v) ? msg : undefined;

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
    <Edit mutationMode="pessimistic" transform={transformServiceEdit}>
      <SimpleForm toolbar={<ServiceEditToolbar />}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left column: main editable fields */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Service
            </h3>

            <TextInput source="name" label="Name" validate={required()} />

            <TextInput
              source="description"
              label="Description"
              multiline
              rows={4}
              validate={maxLen(1000)}
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

            {/* Loyalty points awarded for this service */}
            <NumberInput
              source="pointsEarned"
              label="Points Earned"
              min={0}
              validate={nonNegative}
            />
          </section>

          {/* Right column: media + meta */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Media
            </h3>

            <TextInput
              source="photoUrl"
              label="Photo URL"
              validate={isUrl()}
              placeholder="https://example.com/photo.jpg"
            />

            <TextInput
              source="videoUrl"
              label="Video URL"
              validate={isUrl()}
              placeholder="https://example.com/video.mp4"
            />

            {/* Tiny preview area */}
            <div className="mt-4 space-y-3">
              <MediaPreview />
            </div>

            <h3 className="mt-6 mb-3 text-sm font-semibold text-muted-foreground">
              Meta
            </h3>
            <div className="grid grid-cols-[8rem,1fr] items-start gap-y-2 text-sm">
              <span className="text-muted-foreground">ID</span>
              <TextField source="id" />

              <span className="text-muted-foreground">Times Booked</span>
              <TextField source="timesBooked" />

              <span className="text-muted-foreground">Created</span>
              <DateField source="createdAt" showTime />

              <span className="text-muted-foreground">Updated</span>
              <DateField source="updatedAt" showTime />
            </div>
          </section>
        </div>
      </SimpleForm>
    </Edit>
  );
}

/**
 * Optional inline preview for photo/video based on current form values.
 * Falls back gracefully if fields are empty/invalid.
 */
function MediaPreview() {
  // local import to avoid polluting top-level bundle if you don’t use it elsewhere
  const photoUrl: string | undefined = useWatch({ name: "photoUrl" });
  const videoUrl: string | undefined = useWatch({ name: "videoUrl" });

  const isValidUrl = (u?: string) => !!u && /^https?:\/\/\S+$/i.test(u);

  return (
    <div className="space-y-2">
      {isValidUrl(photoUrl) ? (
        <div className="rounded-md border p-2">
          <p className="mb-2 text-xs text-muted-foreground">Photo preview</p>
          <img
            src={photoUrl}
            alt="Service preview"
            className="max-h-40 w-full rounded object-cover"
          />
        </div>
      ) : null}

      {isValidUrl(videoUrl) ? (
        <div className="rounded-md border p-2">
          <p className="mb-2 text-xs text-muted-foreground">Video preview</p>
          <video src={videoUrl} controls className="h-40 w-full rounded" />
        </div>
      ) : null}
    </div>
  );
}
