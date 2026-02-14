
import React from 'react';
import { 
  LayoutDashboard, 
  User,
  Users, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  BookOpen, 
  Warehouse, 
  Coins, 
  MapPin, 
  Receipt, 
  Briefcase,
  BarChart3,
  CalendarDays,
  ShieldAlert,
  Zap,
  CheckCircle
} from 'lucide-react';
import { ModuleType, NavItem } from './types';

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: ModuleType.DASHBOARD, label: 'داشبورد مدیریتی', icon: 'LayoutDashboard' },
  { id: ModuleType.USERS, label: 'مدیریت کاربران', icon: 'User' },
  { id: ModuleType.APPROVALS, label: 'تاییدات و صلاحیت‌ها', icon: 'CheckCircle' },
  { id: ModuleType.CUSTOMERS, label: 'مشتریان و CRM', icon: 'Users' },
  { id: ModuleType.PRODUCTS, label: 'کاتالوگ محصولات', icon: 'Package' },
  { id: ModuleType.SALES, label: 'فروشات و فکتورها', icon: 'TrendingUp' },
  { id: ModuleType.PURCHASES, label: 'سفارشات خرید', icon: 'ShoppingCart' },
  { id: ModuleType.JOURNAL, label: 'روزنامچه مالی', icon: 'BookOpen' },
  { id: ModuleType.WAREHOUSE, label: 'گودام و موجودی کالا', icon: 'Warehouse' },
  { id: ModuleType.REPORTS, label: 'راپورهای تحلیلی', icon: 'BarChart3' },
  { id: ModuleType.FISCAL_YEARS, label: 'دوره‌های مالی', icon: 'CalendarDays' },
  { id: ModuleType.AUDIT_LOGS, label: 'بررسی امنیت و لاگ‌ها', icon: 'ShieldAlert' },
  { id: ModuleType.SUBSCRIPTIONS, label: 'اشتراک‌های سیستم', icon: 'Zap' },
  { id: ModuleType.CURRENCY, label: 'تبادل اسعار', icon: 'Coins' },
  { id: ModuleType.BRANCHES, label: 'مدیریت نمایندگی‌ها', icon: 'MapPin' },
  { id: ModuleType.EXPENSES, label: 'مدیریت مصارف', icon: 'Receipt' },
  { id: ModuleType.ASSETS, label: 'دارایی‌های ثابت', icon: 'Briefcase' },
];

export const getIcon = (iconName: string, size = 20, className = "") => {
  const icons: Record<string, any> = {
    LayoutDashboard,
    User,
    Users,
    Package,
    TrendingUp,
    ShoppingCart,
    BookOpen,
    Warehouse,
    Coins,
    MapPin,
    Receipt,
    Briefcase,
    BarChart3,
    CalendarDays,
    ShieldAlert,
    Zap,
    CheckCircle
  };
  const IconComponent = icons[iconName] || LayoutDashboard;
  return <IconComponent size={size} className={className} />;
};
