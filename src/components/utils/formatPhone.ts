export default function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return value;

  let formatted = "";
  if (match[1]) formatted = `(${match[1]}`;
  if (match[2]) formatted += `) ${match[2]}`;
  if (match[3]) formatted += `-${match[3]}`;
  return formatted;
}

// Normalize for backend (E.164, US only)
export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  throw new Error("Invalid US phone number");
}
