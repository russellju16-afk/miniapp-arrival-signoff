import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  EndpointIndex,
  EndpointItem,
  extractEndpointIndex,
  writeEndpointIndexFile
} from "../../lib/kingdee-doc-parser";

const INDEX_FILE = path.resolve(process.cwd(), "kingdee_endpoints.json");

export type CoreEndpointKey =
  | "customerList"
  | "salesOrderList"
  | "salesOrderDetail"
  | "salesOrderSave"
  | "salesOutboundList"
  | "salesOutboundDetail"
  | "receiptList"
  | "receiptDetail";

interface EndpointHint {
  title: string;
  method: "GET" | "POST";
}

const CORE_ENDPOINT_HINTS: Record<CoreEndpointKey, EndpointHint> = {
  customerList: {
    title: "客户列表",
    method: "GET"
  },
  salesOrderList: {
    title: "销售订单列表",
    method: "GET"
  },
  salesOrderDetail: {
    title: "销售订单详情",
    method: "GET"
  },
  salesOrderSave: {
    title: "销售订单保存",
    method: "POST"
  },
  salesOutboundList: {
    title: "销售出库单列表",
    method: "GET"
  },
  salesOutboundDetail: {
    title: "销售出库单详情",
    method: "GET"
  },
  receiptList: {
    title: "收款单列表",
    method: "GET"
  },
  receiptDetail: {
    title: "收款单详情",
    method: "GET"
  }
};

class EndpointCatalog {
  private cache: EndpointIndex | null = null;
  private resolvedMap: Partial<Record<CoreEndpointKey, EndpointItem>> | null = null;

  load(forceRefresh = false): EndpointIndex {
    if (!forceRefresh && this.cache) {
      return this.cache;
    }

    if (!forceRefresh && existsSync(INDEX_FILE)) {
      const raw = readFileSync(INDEX_FILE, "utf8");
      this.cache = JSON.parse(raw) as EndpointIndex;
      return this.cache;
    }

    const index = extractEndpointIndex();
    writeEndpointIndexFile(INDEX_FILE, index);
    this.cache = index;
    this.resolvedMap = null;
    return index;
  }

  getByKey(key: CoreEndpointKey): EndpointItem {
    const map = this.loadCoreEndpointMap();
    const endpoint = map[key];
    if (!endpoint) {
      throw new Error(`未在 kingdee_endpoints.json 中找到核心接口: ${key}`);
    }

    return endpoint;
  }

  loadCoreEndpointMap(): Partial<Record<CoreEndpointKey, EndpointItem>> {
    if (this.resolvedMap) {
      return this.resolvedMap;
    }

    const index = this.load(false);
    const map: Partial<Record<CoreEndpointKey, EndpointItem>> = {};

    for (const [key, hint] of Object.entries(CORE_ENDPOINT_HINTS) as Array<[CoreEndpointKey, EndpointHint]>) {
      const endpoint = index.endpoints.find(
        (item) =>
          item.method === hint.method &&
          (item.title === hint.title || item.fullTitle.endsWith(`/${hint.title}`))
      );
      if (endpoint) {
        map[key] = endpoint;
      }
    }

    this.resolvedMap = map;
    return map;
  }

  findByTitle(title: string): EndpointItem | null {
    const index = this.load(false);
    return (
      index.endpoints.find((endpoint) => endpoint.title === title || endpoint.fullTitle.endsWith(`/${title}`)) ??
      null
    );
  }

  findByContains(keyword: string): EndpointItem | null {
    const index = this.load(false);
    return (
      index.endpoints.find(
        (endpoint) => endpoint.title.includes(keyword) || endpoint.fullTitle.includes(keyword)
      ) ?? null
    );
  }
}

export const endpointCatalog = new EndpointCatalog();
