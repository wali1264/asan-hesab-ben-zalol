
import { AccountType, Account, Voucher, JournalEntry, FiscalYear, ModuleType, InventoryBatch, InventoryTransaction, InventoryType, Company, User, Permission, RolePermission, AuditLog, Subscription, OpeningBalance, Approval, Currency, ExchangeRate } from '../types';

let _inMemoryToken: string | null = null;

const MOCK_COMPANIES: Company[] = [
  { id: 1, name: "Nexus Enterprise Core", createdAt: "2024-01-01T00:00:00.000Z" },
  { id: 2, name: "Global Logistics Ltd", createdAt: "2024-02-15T00:00:00.000Z" }
];

const MOCK_CURRENCIES: Currency[] = [
  { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', isBase: true },
  { id: 2, code: 'EUR', name: 'Euro', symbol: '€', isBase: false },
  { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', isBase: false },
];

const MOCK_EXCHANGE_RATES: ExchangeRate[] = [
  { id: 1, currencyId: 2, rate: 1.08, date: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 2, currencyId: 2, rate: 1.10, date: '2024-05-01T00:00:00.000Z', createdAt: '2024-05-01T00:00:00.000Z' },
];

const MOCK_PERMISSIONS: Permission[] = [
  { id: 1, name: 'VIEW_DASHBOARD' },
  { id: 2, name: 'VIEW_REPORTS' },
  { id: 3, name: 'CREATE_SALE' },
  { id: 4, name: 'CREATE_JOURNAL' },
  { id: 5, name: 'MANAGE_STOCK' },
  { id: 6, name: 'VIEW_USERS' },
  { id: 7, name: 'MANAGE_FISCAL' },
  { id: 8, name: 'VIEW_AUDIT' },
  { id: 9, name: 'MANAGE_APPROVALS' },
];

const MOCK_ROLE_PERMISSIONS: RolePermission[] = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(pid => ({ id: Math.random(), roleId: 1, permissionId: pid })),
  { id: 10, roleId: 2, permissionId: 1 },
  { id: 11, roleId: 2, permissionId: 2 },
  { id: 13, roleId: 3, permissionId: 1 },
  { id: 14, roleId: 3, permissionId: 3 },
  { id: 15, roleId: 3, permissionId: 5 },
];

let MOCK_FISCAL_YEARS: FiscalYear[] = [
  { id: 1, name: "FY 2024", startDate: "2024-01-01T00:00:00.000Z", endDate: "2024-12-31T23:59:59.000Z", isClosed: false, companyId: 1, createdAt: new Date().toISOString(), isDeleted: false },
];

const MOCK_ACCOUNTS: Account[] = [
  { id: 1, name: "Liquid Assets", code: "1000", type: AccountType.ASSET, companyId: 1, createdAt: "2024-01-01T00:00:00.000Z", isDeleted: false },
  { id: 2, name: "Main Cash Node", code: "1001", type: AccountType.ASSET, parentId: 1, companyId: 1, createdAt: "2024-01-01T00:00:00.000Z", isDeleted: false },
  { id: 4, name: "Accounts Receivable", code: "1100", type: AccountType.ASSET, companyId: 1, createdAt: "2024-01-01T00:00:00.000Z", isDeleted: false },
  { id: 5, name: "Sales Revenue", code: "4000", type: AccountType.REVENUE, companyId: 1, createdAt: "2024-01-01T00:00:00.000Z", isDeleted: false },
  { id: 6, name: "Operating Expenses", code: "5000", type: AccountType.EXPENSE, companyId: 1, createdAt: "2024-01-01T00:00:00.000Z", isDeleted: false },
];

let MOCK_VOUCHERS: Voucher[] = [
  { id: 1001, reference: "SEED_OPENING", date: "2024-01-01T00:00:00.000Z", fiscalYearId: 1, companyId: 1, createdAt: "2024-01-01T00:00:00.000Z", entries: [], isDeleted: false, currencyId: 1, exchangeRate: 1 }
];

let MOCK_CUSTOMERS = [
  { id: 1, name: "Acme Corp", email: "contact@acme.com", phone: "+1-555-0101", balance: 15000, companyId: 1, isDeleted: false },
  { id: 2, name: "Global Tech", email: "info@global.tech", phone: "+1-555-0202", balance: 5000, companyId: 1, isDeleted: false },
];

let MOCK_PRODUCTS = [
  { id: 101, name: "Industrial Sensor A1", sku: "SN-A1-001", price: 150, stock: 85, companyId: 1, isDeleted: false },
  { id: 102, name: "Controller Unit X", sku: "CU-X-099", price: 450, stock: 20, companyId: 1, isDeleted: false },
];

let MOCK_INVENTORY_BATCHES: InventoryBatch[] = [
  { id: 1, productId: 101, productName: 'Industrial Sensor A1', batchNumber: 'BAT-2024-001', quantity: 100, remaining: 85, unitCost: 120, warehouseId: 1, warehouseName: 'Central Node', createdAt: '2024-01-10T00:00:00.000Z', companyId: 1, isDeleted: false }
];

let MOCK_INVENTORY_TRANSACTIONS: InventoryTransaction[] = [];
let MOCK_AUDIT_LOGS: AuditLog[] = [];
let MOCK_APPROVALS: Approval[] = [];

const getContext = () => {
  const userStr = localStorage.getItem('nexus_user');
  if (!userStr) return { companyId: 1, roleId: 1, userId: 1 };
  const user = JSON.parse(userStr);
  return { companyId: user.companyId || 1, roleId: user.roleId || 1, userId: user.id || 1 };
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

const simulatedErrorHandler = (err: any): ApiResponse => {
  return { success: false, error: err.message || "Internal Server Error", statusCode: 500 };
};

export const apiService = {
  getToken() { return _inMemoryToken || localStorage.getItem('nexus_jwt'); },
  setToken(t: string, user: any) { 
    _inMemoryToken = t; 
    localStorage.setItem('nexus_jwt', t); 
    localStorage.setItem('nexus_user', JSON.stringify(user));
    window.dispatchEvent(new Event('auth-change')); 
  },
  clearToken() { 
    _inMemoryToken = null; 
    localStorage.removeItem('nexus_jwt'); 
    localStorage.removeItem('nexus_user');
    window.dispatchEvent(new Event('auth-change')); 
  },

  async checkPermission(permissionName: string): Promise<boolean> {
    const { roleId } = getContext();
    const permission = MOCK_PERMISSIONS.find(p => p.name === permissionName);
    if (!permission) return false;
    return !!MOCK_ROLE_PERMISSIONS.find(rp => rp.roleId === roleId && rp.permissionId === permission.id);
  },

  async createAuditLog(action: string, entity: string, entityId: number) {
    const { companyId, userId } = getContext();
    MOCK_AUDIT_LOGS.unshift({ id: Date.now(), userId, action, entity, entityId, companyId, createdAt: new Date().toISOString() });
  },

  async getExchangeRate(currencyId: number, date: string): Promise<ExchangeRate | null> {
    const targetDate = new Date(date);
    const currency = MOCK_CURRENCIES.find(c => c.id === currencyId);
    if (!currency || currency.isBase) return { id: 0, currencyId, rate: 1, date: targetDate.toISOString(), createdAt: '' };
    const validRates = MOCK_EXCHANGE_RATES.filter(r => r.currencyId === currencyId && new Date(r.date) <= targetDate).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return validRates[0] || null;
  },

  async login(u: string, p: string): Promise<ApiResponse> {
    const roleId = u === 'auditor' ? 2 : 3;
    const mockUser: User = { id: 101, username: u, role: 'ADMIN', roleId, branch: 'Central', companyId: 1 };
    this.setToken(`mock_jwt_${Date.now()}`, mockUser);
    return { success: true };
  },

  async register(data: any): Promise<ApiResponse> {
    return { success: true, message: "Registration successful." };
  },

  async getCurrentCompany(): Promise<ApiResponse<Company>> {
    const { companyId } = getContext();
    return { success: true, data: MOCK_COMPANIES.find(c => c.id === companyId) || MOCK_COMPANIES[0] };
  },

  async get(module: string, includeDeleted = false): Promise<ApiResponse> {
    try {
      const m = module.toLowerCase();
      const { companyId } = getContext();
      const where = (item: any) => item.companyId === companyId && (includeDeleted || item.isDeleted === false);

      if (m === 'accounts') return { success: true, data: MOCK_ACCOUNTS.filter(where) };
      if (m === 'customers') return { success: true, data: MOCK_CUSTOMERS.filter(where) };
      if (m === 'products') return { success: true, data: MOCK_PRODUCTS.filter(where) };
      if (m === 'journal') return { success: true, data: MOCK_VOUCHERS.filter(where) };
      if (m === 'fiscal_years') return { success: true, data: MOCK_FISCAL_YEARS.filter(where) };
      if (m === 'warehouse') return { success: true, data: { transactions: MOCK_INVENTORY_TRANSACTIONS.filter(t => t.companyId === companyId), batches: MOCK_INVENTORY_BATCHES.filter(where) } };
      if (m === 'approvals') return { success: true, data: MOCK_APPROVALS.filter(a => a.companyId === companyId) };
      if (m === 'audit_logs') return { success: true, data: MOCK_AUDIT_LOGS.filter(l => l.companyId === companyId) };
      if (m === 'currency') return { success: true, data: MOCK_CURRENCIES };
      
      return { success: true, data: [] };
    } catch (err) {
      return simulatedErrorHandler(err);
    }
  },

  async post(module: string, data: any): Promise<ApiResponse> {
    try {
      const { companyId } = getContext();
      const m = module.toLowerCase();
      const createdAt = new Date().toISOString();

      if (m === 'journal') {
        const curId = data.currencyId ? parseInt(data.currencyId) : 1;
        const rateObj = await this.getExchangeRate(curId, data.date);
        const activeRate = rateObj?.rate || 1;
        const newVoucher: Voucher = { ...data, id: Date.now(), companyId, createdAt, isDeleted: false, exchangeRate: activeRate };
        MOCK_VOUCHERS.push(newVoucher);
        return { success: true, message: "Committed." };
      }

      if (m === 'warehouse') {
        const newTx: InventoryTransaction = { id: Date.now(), productId: parseInt(data.productId), quantity: parseFloat(data.quantity), type: data.type, companyId, createdAt };
        MOCK_INVENTORY_TRANSACTIONS.push(newTx);
        return { success: true, message: "Inventory updated." };
      }

      return { success: true, message: "OK" };
    } catch (err) {
      return simulatedErrorHandler(err);
    }
  },

  async deleteEntity(module: string, id: number): Promise<ApiResponse> {
    const m = module.toLowerCase();
    let list: any[] = [];
    if (m === 'accounts') list = MOCK_ACCOUNTS;
    if (m === 'customers') list = MOCK_CUSTOMERS;
    if (m === 'products') list = MOCK_PRODUCTS;
    if (m === 'journal') list = MOCK_VOUCHERS;
    if (m === 'fiscal_years') list = MOCK_FISCAL_YEARS;
    if (m === 'warehouse') list = MOCK_INVENTORY_BATCHES;

    const entity = list.find(item => item.id === id);
    if (entity) entity.isDeleted = true;
    return { success: true };
  },

  async restoreEntity(module: string, id: number): Promise<ApiResponse> {
    const m = module.toLowerCase();
    let list: any[] = [];
    if (m === 'accounts') list = MOCK_ACCOUNTS;
    if (m === 'customers') list = MOCK_CUSTOMERS;
    if (m === 'products') list = MOCK_PRODUCTS;
    if (m === 'journal') list = MOCK_VOUCHERS;
    if (m === 'fiscal_years') list = MOCK_FISCAL_YEARS;
    if (m === 'warehouse') list = MOCK_INVENTORY_BATCHES;

    const entity = list.find(item => item.id === id);
    if (entity) entity.isDeleted = false;
    return { success: true };
  },

  async reconcileInventory(productId: number): Promise<number> {
    return MOCK_INVENTORY_BATCHES.filter(b => b.productId === productId && !b.isDeleted).reduce((s, b) => s + b.remaining, 0);
  },

  async getLedgerSummary(): Promise<ApiResponse> {
    return { success: true, data: { totalAssets: 1254000, totalLiabilities: 420000, totalEquity: 834000 } };
  },

  async getTrialBalance(start: string, end: string): Promise<ApiResponse> {
    return { success: true, data: { rows: [], totalDebitAll: 0, totalCreditAll: 0, isBalanced: true } };
  },

  async getFinancialReport(type: string, end: string, start: string): Promise<ApiResponse> {
    return { success: true, data: { totalRevenue: 100, totalExpense: 50, profit: 50 } };
  }
};
