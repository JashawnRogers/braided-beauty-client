import { ReferenceInput, AutocompleteInput } from "react-admin";
import { CreateCategoryDialog } from "./CreateCategoryDialog";

export default function CategoryField() {
  return (
    <ReferenceInput source="categoryId" reference="categories" perPage={999}>
      <div className="ra-autocomplete-field">
        <AutocompleteInput
          label="Category"
          optionText="name"
          optionValue="id"
          create={<CreateCategoryDialog />}
          helperText={false}
          margin="none"
          // createLabel="Start typing to add a new category"
          createItemLabel={(filter) => `Create ${filter}`}
          className="ra-autocomplete-trigger w-full"
        />
      </div>
    </ReferenceInput>
  );
}
