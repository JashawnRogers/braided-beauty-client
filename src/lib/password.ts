export type PasswordIssue = "length" | "symbol" | "personal" | "confirm";

const HAS_UPPERCASE = /[A-Z]/;
const HAS_LOWERCASE = /[a-z]/;
const HAS_NUMBER = /\d/;
const HAS_SYMBOL = /[^A-Za-z0-9\s]/;
const MIN_PASSWORD_LENGTH = 8;

export type PasswordRuleResult = {
  minLengthMet: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  isPasswordValid: boolean;
};

export function sanitizePasswordInput(raw: string): string {
  // strip only leading/trailing whitespace; allow spaces inside passphrases
  return raw.replace(/^\s+|\s+$/g, "");
}

export function evaluatePasswordRules(rawPassword: string): PasswordRuleResult {
  const password = sanitizePasswordInput(rawPassword);

  const minLengthMet = password.length >= MIN_PASSWORD_LENGTH;
  const hasUppercase = HAS_UPPERCASE.test(password);
  const hasLowercase = HAS_LOWERCASE.test(password);
  const hasNumber = HAS_NUMBER.test(password);
  const hasSymbol = HAS_SYMBOL.test(password);

  return {
    minLengthMet,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
    isPasswordValid:
      minLengthMet && hasUppercase && hasLowercase && hasNumber && hasSymbol,
  };
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
  const passwordRules = evaluatePasswordRules(sanitizedPassword);
  const issues: PasswordIssue[] = [];

  if (!passwordRules.minLengthMet) issues.push("length");

  if (!passwordRules.hasSymbol) {
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
