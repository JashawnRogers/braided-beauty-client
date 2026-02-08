// months.ts
export type MonthOption = { value: string; label: string };

/**
 * Generates month options from start (inclusive) to now (inclusive).
 * value format: YYYY-MM (easy to parse back into YearMonth on server)
 */
export function buildMonthOptions(
  startYear: number,
  startMonth1to12: number
): MonthOption[] {
  const start = new Date(startYear, startMonth1to12 - 1, 1);
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), 1);

  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  const options: MonthOption[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1; // 1..12
    const value = `${y}-${String(m).padStart(2, "0")}`; // "2026-02"
    const label = fmt.format(cursor); // "February 2026"
    options.push({ value, label });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  // showing newest first
  return options.reverse();
}
