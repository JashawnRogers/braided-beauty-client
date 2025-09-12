// ListBusinessHours.tsx
import { List, DataTable, TextField, BooleanInput, EditButton } from "./admin";
import { useRecordContext } from "ra-core";

// Optional: compact hours cell
function HoursField(props: any) {
  const record = useRecordContext(props);
  if (!record) return null;
  return (
    <span>
      {record.isClosed
        ? "—"
        : `${record.openTime ?? ""} – ${record.closeTime ?? ""}`}
    </span>
  );
}

export default function ListBusinessHours() {
  return (
    <List perPage={7} sort={{ field: "dayOfWeek", order: "ASC" }}>
      <DataTable bulkActionButtons={false} rowClick="edit">
        <DataTable.Col source="id" field={TextField} />
        <DataTable.Col source="dayOfWeek" label="Day" field={TextField} />
        <DataTable.Col label="Closed">
          <BooleanInput disabled source="isClosed" />
        </DataTable.Col>
        <DataTable.Col label="Hours" field={HoursField} />
        <DataTable.Col>
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
