import {
  List,
  DataTable,
  EditButton,
  TextInput,
  TextField,
  DeleteButton,
} from "@/features/admin";

export default function ListCategories() {
  const categoryFilters = [
    <TextInput key="q" source="q" label="Search" alwaysOn />,
  ];

  return (
    <List
      filters={categoryFilters}
      perPage={10}
      sort={{ field: "name", order: "ASC" }}
    >
      <DataTable rowClick="edit" bulkActionButtons={true}>
        <DataTable.Col source="name" label="Name" field={TextField} />

        <DataTable.Col>
          <EditButton />
        </DataTable.Col>

        <DataTable.Col>
          <DeleteButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
