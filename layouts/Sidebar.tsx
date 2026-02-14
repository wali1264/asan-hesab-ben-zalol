
import React, { useState, useEffect } from 'react';
import { NAVIGATION_ITEMS, getIcon } from '../constants';
import { ModuleType, Company } from '../types';
import { apiService } from '../services/apiService';

interface SidebarProps {
  activeModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onSelectModule, isCollapsed }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [allowedModules, setAllowedModules] = useState<ModuleType[]>([]);

  useEffect(() => {
    apiService.getCurrentCompany().then(res => {
      if (res.success && res.data) setCompany(res.data);
    });

    const checkAllAuth = async () => {
      const results = await Promise.all(NAVIGATION_ITEMS.map(async item => {
        let perm = 'VIEW_DASHBOARD';
        if (item.id === ModuleType.SALES) perm = 'CREATE_SALE';
        if (item.id === ModuleType.REPORTS) perm = 'VIEW_REPORTS';
        if (item.id === ModuleType.JOURNAL) perm = 'CREATE_JOURNAL';
        if (item.id === ModuleType.FISCAL_YEARS) perm = 'MANAGE_FISCAL';
        if (item.id === ModuleType.USERS) perm = 'VIEW_USERS';
        if (item.id === ModuleType.APPROVALS) perm = 'MANAGE_APPROVALS';
        
        const ok = await apiService.checkPermission(perm);
        return ok ? item.id : null;
      }));
      setAllowedModules(results.filter(r => r !== null) as ModuleType[]);
    };
    checkAllAuth();
  }, []);

  return (
    <div className={`bg-[#0F1117] text-slate-400 flex flex-col transition-all duration-500 ease-in-out border-l border-white/5 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      <div className="p-6 flex items-center gap-3 mb-4">
        <div className="bg-brand w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20 shrink-0">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-extrabold text-xl text-white tracking-tight leading-none uppercase truncate">نکسوس</span>
            <span className="text-[10px] font-black text-brand-light uppercase tracking-[0.2em] mt-1 truncate">
              {company ? company.name : 'سیستم مرکزی'}
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-1.5 scrollbar-hide">
        {NAVIGATION_ITEMS.filter(item => allowedModules.includes(item.id) || item.id === ModuleType.DASHBOARD).map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all duration-300 rounded-2xl group relative
                ${isActive ? 'bg-brand text-white shadow-xl shadow-brand/20' : 'hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-light'} transition-colors`}>
                {getIcon(item.icon, 20)}
              </span>
              {!isCollapsed && <span className="tracking-tight">{item.label}</span>}
              {isActive && !isCollapsed && <div className="absolute left-4 w-1.5 h-1.5 bg-white/40 rounded-full" />}
            </button>
          );
        })}
      </nav>

      <div className="p-6">
        {!isCollapsed && (
          <div className="bg-white/5 rounded-[2rem] p-5 border border-white/5">
             <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
               <span className="text-xs font-bold text-slate-300 truncate">وضعیت: آنلاین</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
