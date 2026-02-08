import { createDecipheriv, createHash } from "node:crypto";

import { env } from "../../config/env";

const FIXED_IV = "5e8y6w45ju8w9jq8";

export function deriveAes256Key(clientSecret: string): Buffer {
  const raw = Buffer.from(clientSecret, "utf8");

  // 文档要求 256bits。若非 32 字节，则用 SHA-256 规整到 32 字节。
  if (raw.length === 32) {
    return raw;
  }

  return createHash("sha256").update(raw).digest();
}

export function decryptSensitiveField(cipherTextBase64: string, clientSecret = env.KD_CLIENT_SECRET): string {
  const key = deriveAes256Key(clientSecret);
  const iv = Buffer.from(FIXED_IV, "utf8");
  const encrypted = Buffer.from(cipherTextBase64, "base64");

  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  decipher.setAutoPadding(true);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export function decryptKnownSensitiveFields(payload: unknown, clientSecret = env.KD_CLIENT_SECRET): unknown {
  if (Array.isArray(payload)) {
    return payload.map((item) => decryptKnownSensitiveFields(item, clientSecret));
  }

  if (!isRecord(payload)) {
    return payload;
  }

  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string" && isSensitiveFieldName(key)) {
      try {
        output[key] = decryptSensitiveField(value, clientSecret);
      } catch {
        output[key] = value;
      }
    } else {
      output[key] = decryptKnownSensitiveFields(value, clientSecret);
    }
  }

  return output;
}

function isSensitiveFieldName(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase();
  return ["contact_phone", "contact_address", "mobile", "phone", "address"].includes(normalized);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
