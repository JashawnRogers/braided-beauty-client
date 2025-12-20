// src/admin/addons/AddOnsList.tsx
import {
  List,
  DataTable,
  TextField,
  TextInput,
  EditButton,
} from "@/features/admin"; // if something isn't re-exported, import from "react-admin"
import { MoneyField } from "@/features/admin/components/fields/fields";
import { NumberField } from "react-admin";

// Filters to map in dataProvider.getList:
//   - q           -> name contains (e.g., ?search= or ?nameLike=)
//   - price_gte   -> minimum price
//   - price_lte   -> maximum price
const addOnFilters = [
  <TextInput key="q" source="q" label="Search" alwaysOn />, // by name
  <TextInput
    key="price_gte"
    source="price_gte"
    type="number"
    label="Min Price"
  />,
  <TextInput
    key="price_lte"
    source="price_lte"
    type="number"
    label="Max Price"
  />,
];

export default function AddOnsList() {
  return (
    <List
      filters={addOnFilters}
      perPage={25}
      sort={{ field: "name", order: "ASC" }}
    >
      <DataTable rowClick="edit" bulkActionButtons={true}>
        <DataTable.Col source="name" label="Name" field={TextField} />

        <DataTable.Col label="Price">
          <MoneyField source="price" />
        </DataTable.Col>
        <DataTable.Col label="Duration (in minutes)">
          <NumberField source="durationMinutes" />
        </DataTable.Col>

        <DataTable.Col label="Description">
          <TextField
            source="description"
            empty="No description entered."
            className="block max-w-[200px] truncate"
          />
        </DataTable.Col>

        <DataTable.Col>
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
