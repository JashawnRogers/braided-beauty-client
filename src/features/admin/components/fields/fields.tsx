import { useRecordContext } from "ra-core";
import type { RaRecord } from "ra-core";
import { getValue, type CustomFieldProps } from "@/features/admin/types";

/** Truncate long text with tooltip */
export function TruncateField<R extends RaRecord = RaRecord>({
  source,
  emptyText = "—",
  className,
  ...rest
}: CustomFieldProps<R> & { max?: number }) {
  const record = useRecordContext<R>();
  if (!record) return null;

  const raw = getValue(record, source) as string | undefined | null;
  if (!raw) return <span className={className}>{emptyText}</span>;

  const max = (rest as any).max ?? 120;
  const truncated = raw.length > max ? raw.slice(0, max).trimEnd() + "…" : raw;

  return (
    <span className={className} title={raw}>
      {truncated}
    </span>
  );
}

/** Format number/string as USD (adjust currency/locale as needed) */
export function MoneyField<R extends RaRecord = RaRecord>({
  source,
  emptyText = "—",
  className,
}: CustomFieldProps<R>) {
  const record = useRecordContext<R>();
  if (!record) return null;

  const raw = getValue(record, source);
  if (raw === undefined || raw === null || raw === "") {
    return <span className={className}>{emptyText}</span>;
  }

  const amount =
    typeof raw === "string"
      ? Number(raw)
      : typeof raw === "number"
      ? raw
      : Number(raw as any);

  if (!Number.isFinite(amount))
    return <span className={className}>{emptyText}</span>;

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return <span className={className}>{formatted}</span>;
}

/** Render minutes as "Xh Ym" */
export function MinutesField<R extends RaRecord = RaRecord>({
  source,
  emptyText = "—",
  className,
}: CustomFieldProps<R>) {
  const record = useRecordContext<R>();
  if (!record) return null;

  const minutesRaw = getValue(record, source);
  const minutes = Number(minutesRaw);
  if (!Number.isFinite(minutes))
    return <span className={className}>{emptyText}</span>;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const parts: string[] = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);

  return <span className={className}>{parts.join(" ") || "0m"}</span>;
}
