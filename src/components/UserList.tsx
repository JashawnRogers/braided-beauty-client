import {
  List,
  DataTable,
  TextField,
  EmailField,
  NumberField,
  DateField,
  TextInput,
  SelectInput,
} from "./admin";

const USER_TYPE_CHOICES = [
  { id: "ADMIN", name: "Admin" },
  { id: "MEMBER", name: "Member" },
  { id: "GUEST", name: "Guest" },
];

const userFilters = [
  <TextInput key="q" source="q" label="Search" alwaysOn />,
  <SelectInput
    key="userType"
    source="userType"
    label="User Type"
    choices={USER_TYPE_CHOICES}
    emptyText="All"
  />,
  <TextInput
    key="createdAt_gte"
    type="date"
    source="createdAt_gte"
    label="Created after"
  />,
  <TextInput
    key="createdAt_lte"
    type="date"
    source="createdAt_lte"
    label="Created before"
  />,
];

export default function UserList() {
  return (
    <List
      filters={userFilters}
      perPage={25}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <DataTable rowClick="edit" bulkActionButtons={false}>
        <DataTable.Col source="name" label="Name" field={TextField} />
        <DataTable.Col source="userType" label="Type" field={TextField} />
        <DataTable.Col source="email" label="Email" field={EmailField} />
        <DataTable.Col source="phone" label="Phone" field={TextField} />
        <DataTable.Col label="Created">
          <DateField source="createdAt" showTime />
        </DataTable.Col>
        <DataTable.Col
          source="loyaltyPoints"
          label="Rewards Points"
          field={NumberField}
        />
      </DataTable>
    </List>
  );
}
