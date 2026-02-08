import { createCipheriv, createHash } from "node:crypto";

import {
  decryptKnownSensitiveFields,
  decryptSensitiveField,
  deriveAes256Key
} from "../src/modules/core/crypto.util";

const FIXED_IV = Buffer.from("5e8y6w45ju8w9jq8", "utf8");

describe("crypto util", () => {
  test("deriveAes256Key: 非32字节密钥使用 SHA-256 规整", () => {
    const secret = "client-secret";
    const key = deriveAes256Key(secret);

    expect(key.length).toBe(32);
    expect(key.toString("hex")).toBe(createHash("sha256").update(secret, "utf8").digest("hex"));
  });

  test("decryptSensitiveField: 能正确解密 AES-256-CBC 密文", () => {
    const clientSecret = "12345678901234567890123456789012";
    const plainText = "13800000000";
    const cipher = createCipheriv("aes-256-cbc", Buffer.from(clientSecret, "utf8"), FIXED_IV);
    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]).toString("base64");

    expect(decryptSensitiveField(encrypted, clientSecret)).toBe(plainText);
  });

  test("decryptKnownSensitiveFields: 已知敏感字段自动解密", () => {
    const clientSecret = "12345678901234567890123456789012";
    const plainPhone = "13900001111";
    const plainAddress = "深圳南山";
    const cipher1 = createCipheriv("aes-256-cbc", Buffer.from(clientSecret, "utf8"), FIXED_IV);
    const cipher2 = createCipheriv("aes-256-cbc", Buffer.from(clientSecret, "utf8"), FIXED_IV);
    const encryptedPhone = Buffer.concat([cipher1.update(plainPhone, "utf8"), cipher1.final()]).toString("base64");
    const encryptedAddress = Buffer.concat([cipher2.update(plainAddress, "utf8"), cipher2.final()]).toString(
      "base64"
    );

    const output = decryptKnownSensitiveFields(
      {
        contact_phone: encryptedPhone,
        extra: {
          address: encryptedAddress
        }
      },
      clientSecret
    );

    expect(output).toEqual({
      contact_phone: plainPhone,
      extra: {
        address: plainAddress
      }
    });
  });

  test("decryptKnownSensitiveFields: 非法密文不会抛错，保留原值", () => {
    const output = decryptKnownSensitiveFields({
      contact_phone: "not-a-valid-base64-cipher",
      mobile: "bad-cipher"
    });

    expect(output).toEqual({
      contact_phone: "not-a-valid-base64-cipher",
      mobile: "bad-cipher"
    });
  });
});
