// src/admin/services/ServiceCreate.tsx
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SaveButton,
  FileInput,
} from "../../admin";
import { useWatch } from "react-hook-form";
import { transformServiceCreate } from "../../utils/mediaTransform";

function ServiceCreateToolbar() {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
      <SaveButton />
    </div>
  );
}

export default function ServiceCreate() {
  return (
    <Create mutationMode="pessimistic" transform={transformServiceCreate}>
      <SimpleForm toolbar={<ServiceCreateToolbar />}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: main fields */}
          <section className="rounded-md border p-4 space-y-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              New Service
            </h3>

            <TextInput source="name" label="Name" required />
            <TextInput source="category" label="Category" />

            <NumberInput
              source="price"
              label="Price (USD)"
              step={0.01}
              min={0}
            />

            <NumberInput
              disabled
              source="depositAmount"
              label="Deposit (USD)"
              step={0.01}
              min={0}
            />

            <NumberInput
              source="durationMinutes"
              label="Duration (minutes)"
              min={0}
              step={5}
            />

            <NumberInput source="pointsEarned" label="Points Earned" min={0} />

            <TextInput
              source="description"
              label="Description"
              multiline
              maxLength={255}
              rows={4}
            />
          </section>

          {/* Right: media & live preview */}
          <section className="rounded-md border p-4 space-y-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Media
            </h3>

            <FileInput source="photoFiles" multiple label="Photos">
              <FileInput source="src" />
            </FileInput>

            <FileInput source="videoUrl" label="Video" multiple={false}>
              <FileInput source="src" />
            </FileInput>

            <div className="mt-4 space-y-3">
              <MediaPreview />
            </div>
          </section>
        </div>
      </SimpleForm>
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
