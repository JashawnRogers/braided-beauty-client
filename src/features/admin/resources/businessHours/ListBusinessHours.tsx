import { List, DataTable, TextField, EditButton } from "@/features/admin";

export default function ListBusinessHours() {
  return (
    <List perPage={7} sort={{ field: "dayOfWeek", order: "ASC" }}>
      <DataTable bulkActionButtons={true} rowClick="edit">
        <DataTable.Col source="dayOfWeek" label="Day" field={TextField} />
        <DataTable.Col source="openTime" label="Opens" field={TextField} />
        <DataTable.Col source="closeTime" label="Closes" field={TextField} />
        <DataTable.Col label="Closed" source="closed" field={TextField} />
        <DataTable.Col>
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
