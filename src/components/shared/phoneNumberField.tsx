import { useRecordContext } from "ra-core";
import { phone } from "@/components/utils/formatPhone";

export function PhoneNumberField({ source }: { source: string }) {
  const record = useRecordContext();
  if (!record) return null;

  return <span>{phone.format(record[source])}</span>;
}
