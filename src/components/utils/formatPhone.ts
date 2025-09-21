export const phone = {
  // Keep only digits (10 max) - safe for every keystroke
  toRaw(value?: string) {
    return (value ?? "").replace(/\D/g, "").slice(0, 10);
  },

  // print as (xxx) xxx-xxxx from either raw or messy input
  format(value?: string) {
    const digits = phone.toRaw(value);
    const matched = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
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

  // Validate 10 US digits (works with raw or formatted input)
  isValid(value?: string) {
    return phone.toRaw(value).length === 10;
  },

  // Convert to E.164 (+1XXXXXXXXXX). Returns empty string if not valid
  toE164(value?: string): string | null {
    const digits = phone.toRaw(value);
    return digits.length === 10 ? `+1${digits}` : null;
  },
};
