
import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, Menu, LogOut, ChevronDown, Building2 } from 'lucide-react';
import { ModuleType, Company } from '../types';
import { apiService } from '../services/apiService';

interface HeaderProps {
  toggleSidebar: () => void;
  activeLabel: string;
  onNavigate: (module: ModuleType) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, activeLabel, onNavigate, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    apiService.getCurrentCompany().then(res => {
      if (res.success && res.data) setCompany(res.data);
    });
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm" dir="rtl">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 leading-none">{activeLabel}</h1>
            {company && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-black text-brand uppercase tracking-widest bg-brand/5 px-2 py-0.5 rounded-md border border-brand/10">
                <Building2 size={10} /> {company.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center bg-slate-100/50 px-3 py-1.5 rounded-2xl border border-slate-200 w-[300px]">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="جستجو در سیستم..." 
            className="bg-transparent border-none outline-none px-3 text-sm flex-1 font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-1"></div>
          
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className={`flex items-center gap-2 p-1 pr-1.5 pl-2 rounded-xl transition-all ${showProfile ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
            >
              <div className="h-8 w-8 bg-slate-900 text-white flex items-center justify-center rounded-lg font-bold text-xs shadow-md">
                مدیر
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-50 mb-1 text-right">
                  <p className="text-xs font-bold text-slate-700">کاربر ادمین</p>
                  <p className="text-[10px] text-slate-400 font-medium">admin@nexus.cloud</p>
                </div>
                <button className="w-full text-right px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-end gap-2">
                   تنظیمات <Settings size={14} />
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full text-right px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center justify-end gap-2"
                >
                  خروج <LogOut size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
