import type { ReactNode } from "react";
import type { RaRecord } from "ra-core";

/** Minimal RA-like props for custom Field components */
export type CustomFieldProps<R extends RaRecord = RaRecord> = {
  /** Key (supports dot notation) to read from the record */
  source?: string;
  /** Optional column label (table usually supplies this) */
  label?: string;
  /** Whether the column is sortable (your table may use this) */
  sortable?: boolean;
  /** Fallback when value is null/undefined/empty */
  emptyText?: ReactNode;
  /** Optional className for styling */
  className?: string;
};

/** Safe getter that supports dot notation: "user.name" */
export function getValue<R extends RaRecord>(
  record: R | null | undefined,
  source?: string
): unknown {
  if (!record || !source) return undefined;
  if (!source.includes(".")) return (record as any)[source];
  return source
    .split(".")
    .reduce<any>((acc, key) => (acc ? acc[key] : undefined), record);
}
