
import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, Menu, Sparkles, LogOut, ChevronDown, Loader2, Building2 } from 'lucide-react';
import { processCommand } from '../services/geminiService';
import { ModuleType, Company } from '../types';
import { apiService } from '../services/apiService';

interface HeaderProps {
  toggleSidebar: () => void;
  activeLabel: string;
  onNavigate: (module: ModuleType) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, activeLabel, onNavigate, onLogout }) => {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState<{ module: string, intent: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    apiService.getCurrentCompany().then(res => {
      if (res.success && res.data) setCompany(res.data);
    });
  }, []);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsProcessing(true);
    const result = await processCommand(command);
    if (result && result.targetModule) {
      onNavigate(result.targetModule as ModuleType);
      setShowResult({ module: result.targetModule, intent: result.intent });
      setTimeout(() => setShowResult(null), 5000);
      setCommand('');
    }
    setIsProcessing(false);
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
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
          {showResult && (
            <span className="text-[10px] font-bold text-blue-600 animate-pulse mt-1">
              در حال هدایت به: {showResult.module}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <form 
          onSubmit={handleCommand}
          className="hidden lg:flex items-center bg-slate-100/50 px-3 py-1.5 rounded-2xl border border-slate-200 focus-within:ring-4 focus-within:ring-blue-100 focus-within:bg-white transition-all w-[400px] relative group"
        >
          {isProcessing ? (
            <Loader2 size={18} className="text-blue-600 animate-spin" />
          ) : (
            <Sparkles size={18} className="text-blue-500 group-focus-within:rotate-12 transition-transform" />
          )}
          <input 
            type="text" 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="مثلاً: 'برو به بخش فروشات' یا 'چک کردن گودام'..." 
            className="bg-transparent border-none outline-none px-3 text-sm flex-1 font-medium placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-lg shadow-sm ml-2">
            Enter
          </kbd>
        </form>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-1"></div>
          
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className={`flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl transition-all ${showProfile ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
            >
              <div className="h-8 w-8 bg-slate-900 text-white flex items-center justify-center rounded-lg font-bold text-xs shadow-md">
                مدیر
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            {showProfile && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs font-bold text-slate-700">کاربر سیستم</p>
                  <p className="text-[10px] text-slate-400 font-medium">admin@nexus.cloud</p>
                </div>
                <button className="w-full text-right px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <Settings size={14} /> تنظیمات حساب
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full text-right px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut size={14} /> خروج از سیستم
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
