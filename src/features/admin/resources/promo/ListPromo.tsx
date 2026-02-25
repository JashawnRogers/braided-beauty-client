import {
  List,
  DataTable,
  EditButton,
  TextInput,
  TextField,
  DateField,
  NumberField,
  DeleteButton,
  SelectInput,
} from "@/features/admin";

export default function ListPromoCodes() {
  const promoFilters = [
    <TextInput key="q" source="q" label="Search code" alwaysOn />,
    <SelectInput
      key="active"
      source="active"
      label="Status"
      alwaysOn={true}
      choices={[
        { id: "true", name: "Active" },
        { id: "false", name: "Inactive" },
        { id: " ", name: "All" },
      ]}
      className="w-1/3"
    />,
  ];

  const formatAdminDate = (value?: string | null) => {
    if (!value) return "NA";

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "NA";

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(d); // "Feb 23, 2026"
  };

  const formatStatus = (v: unknown) =>
    v === true || v === "true" ? "Active" : "Inactive";

  return (
    <List
      filters={promoFilters}
      filterDefaultValues={{ active: "true" }}
      perPage={20}
      sort={{ field: "codeName", order: "ASC" }}
    >
      <DataTable rowClick="edit" bulkActionButtons>
        <DataTable.Col source="codeName" label="Code" field={TextField} />
        <DataTable.Col
          source="discountType"
          label="Type"
          field={TextField}
          className="w-[110px]"
        />
        <DataTable.Col
          source="value"
          label="Value"
          field={NumberField}
          className="w-[110px]"
        />

        <DataTable.Col
          label="Status"
          field={TextField}
          source="active"
          render={(record) => formatStatus(record.active)}
          className="w-[110px]"
        />

        <DataTable.Col
          source="startsAt"
          label="Starts"
          field={DateField}
          render={(record) => formatAdminDate(record.startsAt)}
          className="w-[150px]"
        />
        <DataTable.Col
          source="endsAt"
          label="Ends"
          field={DateField}
          render={(record) => formatAdminDate(record.endsAt)}
          className="w-[150px]"
        />
        <DataTable.Col
          source="timesRedeemed"
          label="Used"
          field={NumberField}
          className="w-[90px]"
        />
        <DataTable.Col
          source="maxRedemptions"
          label="Max"
          field={NumberField}
          className="w-[90px]"
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
