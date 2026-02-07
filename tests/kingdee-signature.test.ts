import {
  buildParamString,
  buildStringToSign,
  genAppSignature,
  genXApiSignature
} from "../src/lib/kingdee-signature";

describe("kingdee-signature utils", () => {
  test("buildParamString: 无参数返回空字符串", () => {
    expect(buildParamString({})).toBe("");
  });

  test("buildParamString: 参数按 ASCII 排序 + 双重 URL 编码 + 百分号十六进制大写", () => {
    const params = {
      "z key": "value/1",
      "a&b": "x=y",
      cn: "中文 空格"
    };

    expect(buildParamString(params)).toBe(
      "a%2526b=x%253Dy&cn=%25E4%25B8%25AD%25E6%2596%2587%2520%25E7%25A9%25BA%25E6%25A0%25BC&z%2520key=value%252F1"
    );
  });

  test("buildStringToSign: 无参数时保留空参数行和末尾换行", () => {
    const stringToSign = buildStringToSign(
      "post",
      "/openapi/v1/token",
      {},
      "nonce-1",
      "1700000000000"
    );

    expect(stringToSign).toBe(
      "POST\n%2Fopenapi%2Fv1%2Ftoken\n\nx-api-nonce:nonce-1\nx-api-timestamp:1700000000000\n"
    );
  });

  test("genAppSignature: 同一输入稳定一致", () => {
    const appKey = "app_key_123";
    const appSecret = "app_secret_456";

    const signature1 = genAppSignature(appKey, appSecret);
    const signature2 = genAppSignature(appKey, appSecret);

    expect(signature1).toBe(signature2);
    expect(signature1).toBe(
      "Njc1ZGU1NTFhNmRmM2I0MGNmZGJlZDZiNzY0MjFhYzIxZTJkOTdjZjYyZjdkZTVmMmQ4M2M1YzkwOWQ4MTMzYQ=="
    );
  });

  test("genXApiSignature: 含特殊字符参数时稳定一致", () => {
    const params = {
      "z key": "value/1",
      "a&b": "x=y",
      cn: "中文 空格"
    };

    const signature1 = genXApiSignature(
      "GET",
      "/openapi/v1/orders",
      params,
      "nonce-xyz",
      "1700000000123",
      "client_secret_abc"
    );

    const signature2 = genXApiSignature(
      "GET",
      "/openapi/v1/orders",
      params,
      "nonce-xyz",
      "1700000000123",
      "client_secret_abc"
    );

    expect(signature1).toBe(signature2);
    expect(signature1).toBe(
      "NjdjYzdmYWQ4OTMwMDkyNmUzZmQwMWVmMDMyMWU4MTMzN2I2ZjkzNDk3NDljNWQ0MTA4NzI0ODY0MDk3NzkzMQ=="
    );
  });
});
