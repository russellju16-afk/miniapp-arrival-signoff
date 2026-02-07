export type SyncJobName =
  | "customer"
  | "supplier"
  | "sal_order"
  | "sal_out_bound"
  | "sal_invoice"
  | "pur_order"
  | "pur_inbound"
  | "pur_invoice"
  | "ap_credit"
  | "ar_credit"
  | "voucher"
  | "inventory"
  | "inventory_stock"
  | "master_data_full"
  | "documents_incremental";

export interface RunSyncJobInput {
  tenantId: string;
  jobName: SyncJobName;
  fromTime?: number;
  toTime?: number;
}

export interface SyncRunResult {
  tenantId: string;
  jobName: SyncJobName;
  fromTime: number | null;
  toTime: number;
  totalPulled: number;
  totalInserted: number;
  totalSkipped: number;
  warnings: string[];
}

export interface SyncStatusItem {
  tenant_id: string;
  job_name: string;
  status: string;
  last_success_at: string | null;
  last_cursor: unknown;
  error: string | null;
  updated_at: string | null;
}
