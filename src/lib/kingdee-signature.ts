import { createHmac } from "node:crypto";

function uppercasePercentHex(value: string): string {
  return value.replace(/%[0-9a-fA-F]{2}/g, (segment) => segment.toUpperCase());
}

function doubleUrlEncode(value: string): string {
  return uppercasePercentHex(encodeURIComponent(encodeURIComponent(value)));
}

function compareAscii(a: string, b: string): number {
  const minLength = Math.min(a.length, b.length);

  for (let index = 0; index < minLength; index += 1) {
    const diff = a.charCodeAt(index) - b.charCodeAt(index);
    if (diff !== 0) {
      return diff;
    }
  }

  return a.length - b.length;
}

export function buildParamString(params: Record<string, string>): string {
  const keys = Object.keys(params).sort(compareAscii);

  if (keys.length === 0) {
    return "";
  }

  return keys
    .map((key) => `${doubleUrlEncode(key)}=${doubleUrlEncode(params[key] ?? "")}`)
    .join("&");
}

export function buildStringToSign(
  method: string,
  path: string,
  params: Record<string, string>,
  nonce: string,
  timestamp: string
): string {
  const normalizedMethod = method.trim().toUpperCase();
  const encodedPath = uppercasePercentHex(encodeURIComponent(path));
  const paramString = buildParamString(params);

  return `${normalizedMethod}\n${encodedPath}\n${paramString}\nx-api-nonce:${nonce}\nx-api-timestamp:${timestamp}\n`;
}

export function genAppSignature(appKey: string, appSecret: string): string {
  // app_signature = Base64( hexLower( HMAC_SHA256(appSecret, app_key) ) 的 UTF-8 字节 )
  const hmacHex = createHmac("sha256", appSecret).update(appKey, "utf8").digest("hex");
  return Buffer.from(hmacHex, "utf8").toString("base64");
}

export function genXApiSignature(
  method: string,
  path: string,
  params: Record<string, string>,
  nonce: string,
  timestamp: string,
  clientSecret: string
): string {
  const signText = buildStringToSign(method, path, params, nonce, timestamp);
  const hmacHex = createHmac("sha256", clientSecret).update(signText, "utf8").digest("hex");

  return Buffer.from(hmacHex, "utf8").toString("base64");
}
