export function formatJavaDate(input: string | null | undefined): string {
  if (!input) return "-";

  const date = new Date(input);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}
