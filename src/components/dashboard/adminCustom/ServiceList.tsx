import {
  List,
  DataTable,
  TextField,
  NumberField,
  UrlField,
  EditButton,
} from "../../admin";
import { TruncateField, MoneyField, MinutesField } from "../../admin/fields";

export default function ServiceList() {
  return (
    <List perPage={10} sort={{ field: "name", order: "ASC" }}>
      <DataTable rowClick="edit" bulkActionButtons={true}>
        <DataTable.Col source="name" label="Name" field={TextField} />
        <DataTable.Col source="category" label="Category" field={TextField} />

        <DataTable.Col label="Description">
          <TruncateField source="description" />
        </DataTable.Col>

        {/* Price & Deposit formatted as currency */}
        <DataTable.Col label="Price">
          <MoneyField source="price" />
        </DataTable.Col>
        <DataTable.Col label="Deposit">
          <MoneyField source="depositAmount" />
        </DataTable.Col>

        {/* Duration formatted as "Xh Ym" */}
        <DataTable.Col label="Duration">
          <MinutesField source="durationMinutes" />
        </DataTable.Col>

        <DataTable.Col
          source="timesBooked"
          label="Times Booked"
          field={NumberField}
        />

        {/* Media links (if not empty) */}
        <DataTable.Col source="photoKeys" label="Photo" field={UrlField} />
        <DataTable.Col source="videoUrl" label="Video" field={UrlField} />

        <DataTable.Col>
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
