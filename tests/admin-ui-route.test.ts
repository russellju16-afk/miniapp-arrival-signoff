import { buildApp } from "../src/app";

describe("admin ui route", () => {
  test("GET /admin returns html", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/admin"
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.body).toContain("运营后台");
    expect(response.body).toContain("/admin/assets/main.js");
    expect(response.body).toContain("/admin/assets/styles.css");

    await app.close();
  });

  test("GET /admin/assets/main.js returns javascript asset", async () => {
    const app = buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/admin/assets/main.js"
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("application/javascript");
    expect(response.body).toContain("AppSidebar");
    expect(response.body).toContain("ApplicationsPage");
    expect(response.body).toContain("SettingsPage");

    await app.close();
  });
});
