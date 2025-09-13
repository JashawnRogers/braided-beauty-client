// src/admin/services/ServiceCreate.tsx
import { Create, Form, TextInput, NumberInput, SaveButton } from "./admin";
import { useForm, useWatch } from "react-hook-form";

// validators
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

export default function ServiceCreate() {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      depositAmount: 0,
      durationMinutes: 60,
      photoUrl: "",
      videoUrl: "",
      pointsEarned: 0,
    },
  });

  return (
    <Create>
      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: main fields */}
          <section className="rounded-md border p-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              New Service
            </h3>

            <TextInput source="name" label="Name" validate={required()} />

            <TextInput
              source="description"
              label="Description"
              multiline
              rows={4}
              validate={maxLen(1000)}
            />

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

            <NumberInput
              source="durationMinutes"
              label="Duration (minutes)"
              min={0}
              step={5}
              validate={nonNegative}
            />

            <NumberInput
              source="pointsEarned"
              label="Points Earned"
              min={0}
              validate={nonNegative}
            />
          </section>

          {/* Right: media & live preview */}
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

            <div className="mt-4 space-y-3">
              <MediaPreview />
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          <SaveButton />
        </div>
      </Form>
    </Create>
  );
}

/** Inline media preview from the current form values */
function MediaPreview() {
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
