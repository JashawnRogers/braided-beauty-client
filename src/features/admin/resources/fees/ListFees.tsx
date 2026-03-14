import {
  List,
  DataTable,
  EditButton,
  TextInput,
  TextField,
  DateField,
  NumberField,
  DeleteButton,
} from "@/features/admin";

export default function ListFees() {
  const feeFilters = [
    <TextInput key="q" source="q" label="Search fees" alwaysOn />,
  ];

  const formatAdminDate = (value?: string | null) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <List
      filters={feeFilters}
      perPage={20}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <DataTable rowClick="edit" bulkActionButtons>
        <DataTable.Col source="name" label="Name" field={TextField} />

        <DataTable.Col
          source="amount"
          label="Amount"
          field={NumberField}
          className="w-[110px]"
        />

        <DataTable.Col
          source="createdAt"
          label="Created at"
          field={DateField}
          render={(record) => formatAdminDate(record.createdAt)}
          className="w-[110px]"
        />

        <DataTable.Col
          source="updatedAt"
          label="Updated at"
          field={DateField}
          render={(record) => formatAdminDate(record.updatedAt)}
          className="w-[110px]"
        />

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
