import fs from "node:fs/promises";
import path from "node:path";

const ONE_PX_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==";

describe("core admin upload routes", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.ADMIN_TOKEN = "dev-admin-token";
    process.env.UPLOAD_DIR = "./uploads";
    process.env.UPLOAD_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  test("POST /api/admin/uploads/image 可上传图片", async () => {
    const adminUploadImage = jest.fn().mockResolvedValue({
      url: "http://localhost:3000/uploads/admin/products/20260208/demo.png",
      relativePath: "/uploads/admin/products/20260208/demo.png",
      fileName: "demo.png",
      contentType: "image/png",
      size: 123
    });

    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {
        adminUploadImage
      }
    }));

    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const dataUrl = `data:image/png;base64,${ONE_PX_PNG_BASE64}`;
    const response = await app.inject({
      method: "POST",
      url: "/api/admin/uploads/image",
      headers: {
        authorization: "Bearer dev-admin-token",
        "content-type": "application/json"
      },
      payload: {
        dataUrl,
        filename: "cover.png",
        folder: "products"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(adminUploadImage).toHaveBeenCalledWith({
      dataUrl,
      filename: "cover.png",
      folder: "products"
    });

    const payload = JSON.parse(response.payload);
    expect(payload.ok).toBe(true);
    expect(payload.data.url).toContain("/uploads/admin/products/");

    await app.close();
  });

  test("GET /uploads/* 可访问已上传文件", async () => {
    jest.doMock("../src/modules/core/core.service", () => ({
      coreService: {}
    }));
    const { buildApp } = await import("../src/app");
    const app = buildApp();

    const relativeParts = ["admin", "products", "jest", "unit-test.png"];
    const uploadsBaseDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./uploads");
    const absolutePath = path.join(uploadsBaseDir, ...relativeParts);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, Buffer.from(ONE_PX_PNG_BASE64, "base64"));

    try {
      const urlPath = `/uploads/${relativeParts.join("/")}`;
      const response = await app.inject({
        method: "GET",
        url: urlPath
      });
      expect(response.statusCode).toBe(200);
      expect(String(response.headers["content-type"] || "")).toContain("image/png");
      expect(Buffer.isBuffer(response.rawPayload)).toBe(true);
      expect(response.rawPayload.length).toBeGreaterThan(0);
    } finally {
      await fs.rm(path.join(uploadsBaseDir, "admin", "products", "jest"), {
        recursive: true,
        force: true
      });
      await app.close();
    }
  });
});

