import {
  List,
  DataTable,
  TextField,
  EmailField,
  NumberField,
  TextInput,
  SelectInput,
} from "./admin";
import { PhoneNumberField } from "./shared/phoneNumberField";

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
];

export default function UserList() {
  return (
    <List
      filters={userFilters}
      perPage={25}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <DataTable rowClick="edit" bulkActionButtons={true}>
        <DataTable.Col source="name" label="Name" field={TextField} />
        <DataTable.Col source="userType" label="Type" field={TextField} />
        <DataTable.Col source="email" label="Email" field={EmailField} />
        <DataTable.Col
          source="phoneNumber"
          label="Phone"
          field={PhoneNumberField}
        />
        <DataTable.Col
          source="loyaltyRecord.points"
          label="Rewards Points"
          field={NumberField}
        />
        <DataTable.Col
          source="loyaltyRecord.redeemedPoints"
          label="Redeemed Points"
          field={NumberField}
        />
      </DataTable>
    </List>
  );
}
