import { SelectInput, TextInput } from "react-admin";
import {
  List,
  DataTable,
  TextField,
  NumberField,
  EditButton,
} from "../../admin";
import { TruncateField, MoneyField, MinutesField } from "../../admin/fields";

export default function ServiceList() {
  const serviceFilters = [
    <TextInput key="q" source="q" label="Search" alwaysOn />,
    <SelectInput key="name" source="name" label="Name" emptyText="All" />,
  ];

  return (
    <List
      filters={serviceFilters}
      perPage={10}
      sort={{ field: "name", order: "ASC" }}
    >
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
        <DataTable.Col>
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
