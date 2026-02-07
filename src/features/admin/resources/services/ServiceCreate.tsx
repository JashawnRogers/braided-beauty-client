import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SaveButton,
  FileInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  SelectInput,
} from "@/features/admin";
import { ReferenceInput } from "@/features/admin/components/inputs/reference-input";
import { transformServiceCreate } from "../../../../lib/mediaTransform";
import ExistingPhotos from "../../components/inputs/ExistingPhotos";

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
          </section>

          {/* Right: media & live preview */}
          <section className="rounded-md border p-4 space-y-4">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Media
            </h3>

            <FileInput
              source="photoFiles"
              multiple
              label="Photos (up to 5)"
              placeholder="Drag and drop an image here"
            />

            <div className="mt-4 space-y-3">
              <ExistingPhotos />
            </div>
          </section>
        </div>
      </SimpleForm>
    </Create>
  );
}
