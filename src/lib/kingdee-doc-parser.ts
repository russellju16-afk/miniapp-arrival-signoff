import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface EndpointItem {
  id: string;
  sectionNumber: number;
  fullTitle: string;
  title: string;
  category: string;
  method: string;
  url: string;
  path: string;
  params: EndpointParam[];
}

export interface EndpointIndex {
  sourcePath: string;
  generatedAt: string;
  total: number;
  endpoints: EndpointItem[];
}

const DOC_CANDIDATES = [
  "/mnt/data/jdy-all-developer-docs-full.md",
  path.resolve(process.cwd(), "jdy-all-developer-docs-full.md")
];

export function resolveKingdeeDocPath(): string {
  for (const candidate of DOC_CANDIDATES) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `未找到金蝶文档，请确认以下路径至少存在一个: ${DOC_CANDIDATES.join(", ")}`
  );
}

export function parseEndpointIndexFromMarkdown(markdown: string, sourcePath: string): EndpointIndex {
  const sectionRegex = /\n##\s+(\d+)\.\s+([^\n]+)\n([\s\S]*?)(?=\n##\s+\d+\.\s+[^\n]+\n|$)/g;
  const endpoints: EndpointItem[] = [];

  let matched: RegExpExecArray | null;
  while ((matched = sectionRegex.exec(`\n${markdown}`)) !== null) {
    const sectionNumber = Number(matched[1]);
    const fullTitle = matched[2].trim();
    const body = matched[3];

    const methodMatch = body.match(/请求方式：\s*([A-Za-z]+)/);
    const urlMatch = body.match(/请求地址：\s*(https?:\/\/[^\s]+)/);

    if (!methodMatch || !urlMatch) {
      continue;
    }

    const method = methodMatch[1].toUpperCase();
    const url = urlMatch[1].trim();

    let parsedPath = "";
    try {
      parsedPath = new URL(url).pathname;
    } catch {
      continue;
    }

    const titleMatch = body.match(/- 标题:\s*`([^`]+)`/);
    const title = titleMatch?.[1]?.trim() || fullTitle.split("/").pop() || fullTitle;
    const category = fullTitle.split("/")[0] ?? "未分类";
    const params = extractParamsTable(body);

    endpoints.push({
      id: `ep_${sectionNumber}`,
      sectionNumber,
      fullTitle,
      title,
      category,
      method,
      url,
      path: parsedPath,
      params
    });
  }

  return {
    sourcePath,
    generatedAt: new Date().toISOString(),
    total: endpoints.length,
    endpoints
  };
}

function extractParamsTable(sectionBody: string): EndpointParam[] {
  const marker = "#### params参数";
  const markerIndex = sectionBody.indexOf(marker);
  if (markerIndex < 0) {
    return [];
  }

  const tail = sectionBody.slice(markerIndex + marker.length);
  const stopMarkers = ["#### 请求示例", "### 响应参数", "#### body参数", "#### headers参数"];
  let endIndex = tail.length;

  for (const stopMarker of stopMarkers) {
    const idx = tail.indexOf(stopMarker);
    if (idx >= 0 && idx < endIndex) {
      endIndex = idx;
    }
  }

  const tableBlock = tail.slice(0, endIndex);
  const lines = tableBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));

  if (lines.length < 3) {
    return [];
  }

  const rows = lines
    .slice(2)
    .filter((line) => !/^\|\s*-+/.test(line))
    .map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0)
    )
    .filter((cells) => cells.length >= 1);

  return rows.map((cells) => {
    const [name = "", type = "", requiredRaw = "", description = ""] = cells;

    return {
      name,
      type,
      required: normalizeRequired(requiredRaw),
      description
    };
  });
}

function normalizeRequired(value: string): boolean {
  const normalized = value.toLowerCase();
  return ["true", "是", "必填", "yes", "y", "1"].includes(normalized);
}

export function extractEndpointIndex(sourcePath = resolveKingdeeDocPath()): EndpointIndex {
  const markdown = readFileSync(sourcePath, "utf8");
  return parseEndpointIndexFromMarkdown(markdown, sourcePath);
}

export function writeEndpointIndexFile(outputPath: string, endpointIndex: EndpointIndex): void {
  writeFileSync(outputPath, `${JSON.stringify(endpointIndex, null, 2)}\n`, "utf8");
}
