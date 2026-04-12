type LogMeta = Record<string, unknown>;

const SENSITIVE_KEY_RE =
  /token|authorization|cookie|password|secret|email|phone|receipt|payment|checkout|note|body|response|headers/i;

function toSafePath(value: string) {
  try {
    const url = new URL(value);
    return url.pathname;
  } catch {
    return value.split("?")[0];
  }
}

function sanitizeValue(value: unknown): unknown {
  if (value == null) return value;

  if (typeof value === "string") {
    return value.startsWith("/") || value.startsWith("http")
      ? toSafePath(value)
      : value;
  }

  if (typeof value === "number" || typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    return value.slice(0, 10).map(sanitizeValue);
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      ...(typeof (value as Error & { status?: unknown }).status === "number"
        ? { status: (value as Error & { status: number }).status }
        : {}),
    };
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !SENSITIVE_KEY_RE.test(key))
        .map(([key, entry]) => [key, sanitizeValue(entry)])
    );
  }

  return undefined;
}

function withMeta(meta?: LogMeta) {
  return meta ? sanitizeValue(meta) : undefined;
}

export const logger = {
  warn(event: string, meta?: LogMeta) {
    console.warn(`[app] ${event}`, withMeta(meta));
  },
  error(event: string, error: unknown, meta?: LogMeta) {
    console.error(`[app] ${event}`, {
      ...((withMeta(meta) as LogMeta | undefined) ?? {}),
      error: sanitizeValue(error),
    });
  },
};

export { toSafePath };
