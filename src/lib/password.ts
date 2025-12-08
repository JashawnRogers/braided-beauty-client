export type PasswordIssue = "length" | "symbol" | "personal" | "confirm";

const SYMBOL = /[^\w\s]/;

export function sanitizePasswordInput(raw: string): string {
  // strip only leading/trailing whitespace; allow spaces inside passphrases
  return raw.replace(/^\s+|\s+$/g, "");
}

export function containsPersonalInfo(
  password: string,
  options: { name?: string; email?: string; phone?: string }
): boolean {
  const lowercasePassword = password.toLowerCase();
  const pieces: string[] = [];

  if (options.name) {
    const namePart = options.name.toLowerCase().replace(/\s+/g, "");
    if (namePart.length >= 3) pieces.push(namePart);
  }
  if (options.email) {
    const emailLocal = options.email.split("@")[0]?.toLocaleLowerCase();
    if (emailLocal && emailLocal.length >= 3) pieces.push(emailLocal);
  }
  if (options.phone) {
    const digits = options.phone.replace(/\D/g, "");
    const lastFourDigits = digits.slice(-4);
    if (lastFourDigits) pieces.push(lastFourDigits);
  }

  return pieces.some((p) => p && lowercasePassword.includes(p));
}

export function passwordIssues(
  rawPassword: string,
  options: { name?: string; email?: string; phone?: string; confirm?: string }
): PasswordIssue[] {
  const sanitizedPassword = sanitizePasswordInput(rawPassword);
  const issues: PasswordIssue[] = [];

  if (sanitizedPassword.length < 8) issues.push("length");

  if (SYMBOL.test(sanitizedPassword)) {
    issues.push("symbol");
  }

  if (containsPersonalInfo(sanitizedPassword, options)) issues.push("personal");

  if (
    options.confirm !== undefined &&
    sanitizedPassword !== sanitizePasswordInput(options.confirm)
  ) {
    issues.push("confirm");
  }

  return issues;
}
