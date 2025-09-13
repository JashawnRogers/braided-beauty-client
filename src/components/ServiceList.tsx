import {
  List,
  DataTable,
  TextField,
  NumberField,
  UrlField,
  EditButton,
  TextInput,
} from "./admin";
import { TruncateField, MoneyField, MinutesField } from "./admin/fields";

// Filters for the service list
const serviceFilters = [
  <TextInput key="q" source="q" label="Search" />,
  <TextInput
    key="price_gte"
    source="price_gte"
    label="Min Price"
    type="number"
    step={0.01}
  />,
  <TextInput
    key="price_lte"
    source="price_lte"
    label="Max Price"
    type="number"
    step={0.01}
  />,
  <TextInput
    key="durationMinutes_gte"
    source="durationMinutes_gte"
    label="Min Minutes"
    type="number"
  />,
  <TextInput
    key="durationMinutes_lte"
    source="durationMinutes_lte"
    label="Max Minutes"
    type="number"
  />,
  <TextInput
    key="pointsEarned_gte"
    source="pointsEarned_gte"
    label="Min Points"
    type="number"
  />,
];

export default function ServiceList() {
  return (
    <List
      filters={serviceFilters}
      perPage={25}
      sort={{ field: "name", order: "ASC" }}
      filterDefaultValues={{ price_gte: true }}
    >
      <DataTable rowClick="edit" bulkActionButtons={false}>
        <DataTable.Col source="id" label="ID" field={TextField} />
        <DataTable.Col source="name" label="Name" field={TextField} />

        {/* Description truncated with tooltip */}
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

        {/* Points earned and times booked */}
        <DataTable.Col
          source="pointsEarned"
          label="Points"
          field={NumberField}
        />
        <DataTable.Col
          source="timesBooked"
          label="Times Booked"
          field={NumberField}
        />

        {/* Media links (if not empty) */}
        <DataTable.Col source="photoUrl" label="Photo" field={UrlField} />
        <DataTable.Col source="videoUrl" label="Video" field={UrlField} />

        <DataTable.Col>
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
