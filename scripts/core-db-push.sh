#!/usr/bin/env bash
set -euo pipefail

DB_URL_VALUE="${DB_URL:-file:./prisma/core/dev.db}"
if [[ "${DB_URL_VALUE}" != file:* ]]; then
  echo "core:db:push 仅支持 sqlite file: URL，当前 DB_URL=${DB_URL_VALUE}" >&2
  exit 1
fi

DB_PATH="${DB_URL_VALUE#file:}"
if [[ -z "${DB_PATH}" ]]; then
  echo "无效 DB_URL: ${DB_URL_VALUE}" >&2
  exit 1
fi

mkdir -p "$(dirname "${DB_PATH}")"

column_exists() {
  local table="$1"
  local column="$2"
  sqlite3 "${DB_PATH}" "PRAGMA table_info(${table});" | awk -F'|' '{print $2}' | grep -qx "${column}"
}

add_column_if_missing() {
  local table="$1"
  local column="$2"
  local definition="$3"
  if ! column_exists "${table}" "${column}"; then
    sqlite3 "${DB_PATH}" "ALTER TABLE ${table} ADD COLUMN ${column} ${definition};"
  fi
}

sqlite3 "${DB_PATH}" <<'SQL'
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS kingdee_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  env TEXT NOT NULL UNIQUE,
  app_token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kingdee_raw_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doc_type TEXT NOT NULL,
  kingdee_id TEXT,
  number TEXT,
  payload_json TEXT NOT NULL,
  fetched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS kingdee_raw_documents_type_fetched_idx ON kingdee_raw_documents (doc_type, fetched_at);
CREATE INDEX IF NOT EXISTS kingdee_raw_documents_kingdee_id_idx ON kingdee_raw_documents (kingdee_id);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  company_name TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  kingdee_customer_id TEXT,
  wechat_openid TEXT,
  access_token TEXT UNIQUE,
  token_expires_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS customers_wechat_openid_idx ON customers (wechat_openid);
CREATE INDEX IF NOT EXISTS customers_kingdee_customer_id_idx ON customers (kingdee_customer_id);
CREATE INDEX IF NOT EXISTS customers_status_idx ON customers (status);

CREATE TABLE IF NOT EXISTS customer_registration_applications (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  review_remark TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS customer_registration_apps_customer_status_idx ON customer_registration_applications (customer_id, status);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  detail TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS customer_addresses_customer_default_idx ON customer_addresses (customer_id, is_default);

CREATE TABLE IF NOT EXISTS invoice_profiles (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  title TEXT NOT NULL,
  tax_no TEXT NOT NULL,
  bank_name TEXT,
  bank_account TEXT,
  address_phone TEXT,
  email TEXT,
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS invoice_profiles_customer_default_idx ON invoice_profiles (customer_id, is_default);

CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  items_json TEXT NOT NULL,
  remark TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS quote_requests_customer_status_idx ON quote_requests (customer_id, status);

CREATE TABLE IF NOT EXISTS invoice_requests (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  order_ids_json TEXT NOT NULL,
  invoice_profile_id TEXT,
  remark TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kingdee_ref_id TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_profile_id) REFERENCES invoice_profiles(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS invoice_requests_customer_status_idx ON invoice_requests (customer_id, status);
CREATE INDEX IF NOT EXISTS invoice_requests_profile_idx ON invoice_requests (invoice_profile_id);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  sales_order_id TEXT,
  kingdee_bill_id TEXT,
  kingdee_bill_number TEXT,
  source_doc_no TEXT,
  details_json TEXT,
  synced_at DATETIME,
  status TEXT NOT NULL DEFAULT 'PENDING',
  signed_at DATETIME,
  signed_payload_json TEXT,
  sign_idempotency_key TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS deliveries_customer_status_idx ON deliveries (customer_id, status);
CREATE INDEX IF NOT EXISTS deliveries_kingdee_bill_id_idx ON deliveries (kingdee_bill_id);
CREATE INDEX IF NOT EXISTS deliveries_kingdee_bill_number_idx ON deliveries (kingdee_bill_number);

CREATE TABLE IF NOT EXISTS reconciliations (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  period_start DATETIME NOT NULL,
  period_end DATETIME NOT NULL,
  statement_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  confirmed_at DATETIME,
  confirm_remark TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS reconciliations_customer_period_idx ON reconciliations (customer_id, period_start, period_end);

CREATE TABLE IF NOT EXISTS reconciliation_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reconciliation_id TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  doc_no TEXT,
  doc_date DATETIME,
  amount REAL NOT NULL DEFAULT 0,
  raw_json TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS reconciliation_lines_reconciliation_id_idx ON reconciliation_lines (reconciliation_id);
CREATE INDEX IF NOT EXISTS reconciliation_lines_doc_idx ON reconciliation_lines (doc_type, doc_no);

CREATE TABLE IF NOT EXISTS sync_checkpoints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scope TEXT NOT NULL UNIQUE,
  job_name TEXT NOT NULL,
  cursor_json TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  last_run_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS sync_checkpoints_job_updated_idx ON sync_checkpoints (job_name, updated_at);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  default_unit_id TEXT,
  kingdee_material_id TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS products_status_idx ON products (status);

CREATE TABLE IF NOT EXISTS product_skus (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  sku_code TEXT NOT NULL UNIQUE,
  sku_name TEXT NOT NULL,
  specs_json TEXT,
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  unit_id TEXT,
  kingdee_material_id TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS product_skus_product_status_idx ON product_skus (product_id, status);

CREATE TABLE IF NOT EXISTS price_caches (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  unit_price REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CNY',
  source TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (sku_id) REFERENCES product_skus(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS price_caches_customer_sku_unique ON price_caches (customer_id, sku_id);
CREATE INDEX IF NOT EXISTS price_caches_sku_idx ON price_caches (sku_id);

CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  qty INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (sku_id) REFERENCES product_skus(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_cart_sku_unique ON cart_items (cart_id, sku_id);
CREATE INDEX IF NOT EXISTS cart_items_customer_idx ON cart_items (customer_id);

CREATE TABLE IF NOT EXISTS sales_orders (
  id TEXT PRIMARY KEY,
  order_no TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'CREATED',
  settlement_mode TEXT NOT NULL DEFAULT 'OFFLINE',
  currency TEXT NOT NULL DEFAULT 'CNY',
  total_amount REAL NOT NULL DEFAULT 0,
  remark TEXT,
  delivery_info_json TEXT,
  idempotency_key TEXT,
  kingdee_order_id TEXT,
  kingdee_order_number TEXT,
  writeback_error TEXT,
  canceled_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS sales_orders_customer_status_idx ON sales_orders (customer_id, status);
CREATE INDEX IF NOT EXISTS sales_orders_customer_idem_idx ON sales_orders (customer_id, idempotency_key);
CREATE INDEX IF NOT EXISTS sales_orders_kingdee_number_idx ON sales_orders (kingdee_order_number);

CREATE TABLE IF NOT EXISTS sales_order_lines (
  id TEXT PRIMARY KEY,
  sales_order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  sku_name TEXT NOT NULL,
  sku_code TEXT NOT NULL,
  qty INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  line_amount REAL NOT NULL,
  raw_json TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (sku_id) REFERENCES product_skus(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS sales_order_lines_order_idx ON sales_order_lines (sales_order_id);

CREATE TABLE IF NOT EXISTS order_writeback_logs (
  id TEXT PRIMARY KEY,
  sales_order_id TEXT NOT NULL,
  success INTEGER NOT NULL,
  request_id TEXT,
  trace_id TEXT,
  summary TEXT,
  request_json TEXT NOT NULL,
  response_json TEXT,
  error_code TEXT,
  error_message TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS order_writeback_logs_order_created_idx ON order_writeback_logs (sales_order_id, created_at);
SQL

# 兼容老库：历史版本可能缺少下面字段
add_column_if_missing "customers" "phone" "TEXT"
add_column_if_missing "customers" "access_token" "TEXT"
add_column_if_missing "customers" "token_expires_at" "DATETIME"
add_column_if_missing "customers" "status" "TEXT NOT NULL DEFAULT 'ACTIVE'"
add_column_if_missing "customers" "company_name" "TEXT"
add_column_if_missing "customers" "contact_name" "TEXT"
add_column_if_missing "customers" "contact_phone" "TEXT"
add_column_if_missing "deliveries" "sales_order_id" "TEXT"
add_column_if_missing "deliveries" "source_doc_no" "TEXT"
add_column_if_missing "deliveries" "details_json" "TEXT"
add_column_if_missing "deliveries" "synced_at" "DATETIME"
add_column_if_missing "deliveries" "sign_idempotency_key" "TEXT"
add_column_if_missing "reconciliations" "confirm_remark" "TEXT"
add_column_if_missing "sales_orders" "delivery_info_json" "TEXT"
add_column_if_missing "order_writeback_logs" "request_id" "TEXT"
add_column_if_missing "order_writeback_logs" "trace_id" "TEXT"
add_column_if_missing "order_writeback_logs" "summary" "TEXT"

sqlite3 "${DB_PATH}" <<'SQL'
CREATE UNIQUE INDEX IF NOT EXISTS customers_access_token_key ON customers (access_token);
CREATE INDEX IF NOT EXISTS customers_access_token_idx ON customers (access_token);
CREATE INDEX IF NOT EXISTS customers_token_expires_at_idx ON customers (token_expires_at);
CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers (phone);
CREATE INDEX IF NOT EXISTS deliveries_sign_idempotency_key_idx ON deliveries (sign_idempotency_key);
CREATE INDEX IF NOT EXISTS deliveries_sales_order_id_idx ON deliveries (sales_order_id);
SQL

echo "core sqlite schema synced: ${DB_PATH}"
