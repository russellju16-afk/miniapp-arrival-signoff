export function maskSecret(secret: string, keep = 4): string {
  if (!secret) {
    return "";
  }

  if (secret.length <= keep * 2) {
    return `${secret.slice(0, 1)}***${secret.slice(-1)}`;
  }

  return `${secret.slice(0, keep)}***${secret.slice(-keep)}`;
}

export function sanitizeSensitiveObject(payload: unknown): unknown {
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeSensitiveObject(item));
  }

  if (!isRecord(payload)) {
    return payload;
  }

  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (isSensitiveKey(key) && typeof value === "string") {
      output[key] = maskSecret(value);
      continue;
    }

    output[key] = sanitizeSensitiveObject(value);
  }

  return output;
}

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    normalized.includes("secret") ||
    normalized.includes("token") ||
    normalized.includes("signature") ||
    normalized === "authorization"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
