import { TextInput } from "react-admin";
import {
  List,
  DataTable,
  TextField,
  NumberField,
  EditButton,
} from "../../admin";
import { MoneyField, MinutesField } from "../../admin/fields";

export default function ServiceList() {
  const serviceFilters = [
    <TextInput key="q" source="q" label="Search" alwaysOn />,
  ];

  return (
    <List
      filters={serviceFilters}
      perPage={10}
      sort={{ field: "name", order: "ASC" }}
    >
      <DataTable rowClick="edit" bulkActionButtons={true}>
        <DataTable.Col source="name" label="Name" field={TextField} />
        <DataTable.Col
          source="categoryName"
          label="Category"
          field={TextField}
        />

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
