import "dotenv/config";

type Level = "ok" | "warn" | "error";

interface CheckItem {
  key: string;
  level: Level;
  message: string;
}

function mask(value: string): string {
  if (!value) {
    return "(empty)";
  }
  if (value.length <= 8) {
    return `${value[0] ?? "*"}***${value[value.length - 1] ?? "*"}`;
  }
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

function run(): number {
  const env = process.env;
  const nodeEnv = env.NODE_ENV ?? "development";
  const checks: CheckItem[] = [];

  const requiredInAll = ["DB_URL", "PORT"];
  const kdRequired = ["KD_CLIENT_ID", "KD_CLIENT_SECRET", "KD_APP_KEY", "KD_APP_SECRET"];

  for (const key of requiredInAll) {
    const fallback = key === "DB_URL" ? "file:./prisma/core/dev.db" : key === "PORT" ? "3000" : "";
    const value = env[key]?.trim() || fallback;
    if (!value) {
      checks.push({ key, level: "error", message: `${key} 未配置` });
    } else {
      checks.push({ key, level: "ok", message: `${key} 已配置（当前值: ${value}）` });
    }
  }

  for (const key of kdRequired) {
    const value = env[key]?.trim() ?? "";
    if (!value) {
      checks.push({
        key,
        level: nodeEnv === "production" ? "error" : "warn",
        message: `${key} 未配置（当前值: ${mask(value)}）`
      });
      continue;
    }

    checks.push({
      key,
      level: "ok",
      message: `${key} 已配置（当前值: ${mask(value)}）`
    });
  }

  const hasError = checks.some((item) => item.level === "error");

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        ok: !hasError,
        nodeEnv,
        checks
      },
      null,
      2
    )
  );

  return hasError ? 1 : 0;
}

process.exitCode = run();
