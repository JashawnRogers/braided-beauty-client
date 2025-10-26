import {
  List,
  DataTable,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  EditButton,
} from "../../admin";

export default function LoyaltyList() {
  return (
    <List perPage={25} sort={{ field: "updatedAt", order: "DESC" }}>
      <DataTable rowClick="edit" bulkActionButtons={false}>
        <DataTable.Col source="id" label="ID" field={TextField} />

        {/* User (via FK userId) */}
        <DataTable.Col label="User">
          <ReferenceField source="userId" reference="users" link="show">
            <TextField source="name" />
          </ReferenceField>
        </DataTable.Col>

        <DataTable.Col source="points" label="Points" field={NumberField} />
        <DataTable.Col
          source="redeemedPoints"
          label="Redeemed"
          field={NumberField}
        />

        {/* If updatedAt is an ISO timestamp, DateField works great */}
        <DataTable.Col label="Updated">
          <DateField source="updatedAt" showTime />
        </DataTable.Col>

        <DataTable.Col label="">
          <EditButton />
        </DataTable.Col>
      </DataTable>
    </List>
  );
}
