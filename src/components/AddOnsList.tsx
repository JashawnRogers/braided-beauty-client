// src/admin/addons/AddOnsList.tsx
import { List, DataTable, TextField, TextInput, EditButton } from "./admin"; // if something isn't re-exported, import from "react-admin"
import { MoneyField } from "@/components/admin/fields";

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
      <DataTable rowClick="edit" bulkActionButtons={false}>
        <DataTable.Col source="name" label="Name" field={TextField} />

        <DataTable.Col label="Price">
          <MoneyField source="price" />
        </DataTable.Col>

        {/* <DataTable.Col source="id" label="ID" field={TextField} /> */}

        <DataTable.Col>
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
