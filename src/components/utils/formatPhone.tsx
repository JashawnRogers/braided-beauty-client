export const phone = {
  // Keep only digits (10 max) - safe for input
  toRaw(value?: string) {
    return (value ?? "").replace(/\D/g, "").slice(0, 10);
  },

  // print as (xxx) xxx-xxxx from either raw or messy input
  formatFromE164(value?: string): string {
    if (!value) return "";

    const digits = value.replace(/\D/g, "").slice(-10);
    let tenDigits: string;

    if (digits.length === 11 && digits.startsWith("1")) {
      tenDigits = digits.slice(1);
    } else if (digits.length == 10) {
      tenDigits = digits;
    } else {
      return digits;
    }

    const matched = tenDigits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!matched) return value ?? "";
    const [, firstGroup, secondGroup, thirdGroup] = matched;
    return [
      firstGroup && `(${firstGroup}`,
      secondGroup && `) ${secondGroup}`,
      thirdGroup && `-${thirdGroup}`,
    ]
      .filter(Boolean)
      .join("");
  },

  // For formatted input
  isValid(value?: string) {
    return phone.toRaw(value).length === 10;
  },

  // Convert to E.164 (+1XXXXXXXXXX). Returns empty string if not valid
  toE164(value?: string): string | null {
    if (!value) return null;

    const digits = value?.replace(/\D/g, "");
    if (digits.length == 10) return `+1${digits}`;
    if (digits.length == 11 && digits.startsWith("1")) return `+${digits}`;
    return null;
  },
};
