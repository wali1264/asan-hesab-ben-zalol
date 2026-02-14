
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  USERS = 'USERS',
  CUSTOMERS = 'CUSTOMERS',
  PRODUCTS = 'PRODUCTS',
  SALES = 'SALES',
  PURCHASES = 'PURCHASES',
  JOURNAL = 'JOURNAL',
  WAREHOUSE = 'WAREHOUSE',
  CURRENCY = 'CURRENCY',
  BRANCHES = 'BRANCHES',
  EXPENSES = 'EXPENSES',
  ASSETS = 'ASSETS',
  REPORTS = 'REPORTS',
  FISCAL_YEARS = 'FISCAL_YEARS',
  AUDIT_LOGS = 'AUDIT_LOGS',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  APPROVALS = 'APPROVALS'
}

export interface NavItem {
  id: ModuleType;
  label: string;
  icon: string;
}

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum InventoryType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface Permission {
  id: number;
  name: string;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
}

export interface Company {
  id: number;
  name: string;
  createdAt: string;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  isBase: boolean;
}

export interface ExchangeRate {
  id: number;
  currencyId: number;
  rate: number; // Rate relative to base currency
  date: string;
  createdAt: string;
}

export interface Account {
  id: number;
  name: string;
  code: string;
  type: AccountType;
  parentId?: number;
  companyId: number;
  createdAt: string;
  isDeleted?: boolean;
}

export interface OpeningBalance {
  id: number;
  accountId: number;
  amount: number;
  fiscalYearId: number;
}

export interface Voucher {
  id: number;
  reference?: string;
  date: string;
  fiscalYearId: number;
  companyId: number;
  entries: JournalEntry[];
  currencyId?: number;
  exchangeRate?: number;
  createdAt: string;
  isDeleted?: boolean;
}

export interface JournalEntry {
  id: number;
  voucherId: number;
  accountId: number;
  accountName?: string; 
  debit: number;
  credit: number;
  createdAt: string;
}

export interface InventoryBatch {
  id: number;
  productId: number;
  productName: string;
  batchNumber: string;
  expiryDate?: string;
  quantity: number;
  remaining: number;
  unitCost: number;
  warehouseId: number;
  warehouseName: string;
  createdAt: string;
  companyId: number;
  isDeleted?: boolean;
}

export interface InventoryTransaction {
  id: number;
  productId: number;
  productName?: string;
  quantity: number;
  type: InventoryType;
  reference?: string;
  companyId: number;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  roleId: number;
  branch: string;
  companyId: number;
  isDeleted?: boolean;
}

export interface FiscalYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  companyId: number;
  createdAt: string;
  isDeleted?: boolean;
}

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  entity: string;
  entityId: number;
  createdAt: string;
  companyId: number;
}

export interface Subscription {
  id: number;
  companyId: number;
  plan: string;
  expiresAt: string;
  isActive: boolean;
}

export interface Approval {
  id: number;
  entity: string;
  entityId: number;
  level: number;
  approved: boolean;
  rejected?: boolean;
  requestDate: string;
  requestedBy: string;
  companyId: number;
}
