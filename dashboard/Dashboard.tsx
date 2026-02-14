
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { DollarSign, Users, Package, ShoppingCart, Sparkles, Database, Activity, Terminal, Cpu, ShieldCheck, CheckCircle2, Zap, Layers } from 'lucide-react';
import { getFinancialInsights } from '../services/geminiService';
import { apiService } from '../services/apiService';

const data = [
  { name: 'حمل', revenue: 4200, expenses: 2400 },
  { name: 'ثور', revenue: 3800, expenses: 2898 },
  { name: 'جوزا', revenue: 5100, expenses: 3200 },
  { name: 'سرطان', revenue: 4780, expenses: 2908 },
  { name: 'اسد', revenue: 6890, expenses: 3800 },
  { name: 'سنبله', revenue: 7390, expenses: 4800 },
  { name: 'میزان', revenue: 8490, expenses: 4300 },
];

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<string>('در حال تحلیل لایه داده‌ها...');
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [ledgerSummary, setLedgerSummary] = useState<any>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const summaryRes = await apiService.getLedgerSummary();
      if (summaryRes.success) setLedgerSummary(summaryRes.data);
      
      const res = await getFinancialInsights("سیستم فعال است. داده‌های سال جاری در حال بررسی هستند.");
      setInsights(res || "تحلیل هوش مصنوعی موقتاً در دسترس نیست.");
      setLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-brand text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand/20 flex items-center gap-2">
              <Database size={12} /> مرکز داده نکسوس
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              وضعیت سرور: عملیاتی
            </span>
          </div>
          <h2 className="text-5xl font-extrabold text-slate-900 tracking-tighter leading-none">نمای کلی تشبث</h2>
          <p className="text-slate-400 text-base mt-3 font-medium max-w-lg">مانیتورینگ هم‌زمان عواید، مصارف و موجودی کالا در تمام نمایندگی‌ها.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-right">
        {[
          { label: 'مجموع دارایی‌ها', value: `$${ledgerSummary?.totalAssets.toLocaleString() || '1,254,000'}`, trend: '+2.4%', color: 'brand', icon: DollarSign },
          { label: 'بدهی‌های جاری', value: `$${ledgerSummary?.totalLiabilities.toLocaleString() || '420,000'}`, trend: '-1.2%', color: 'rose', icon: Activity },
          { label: 'سرمایه خالص', value: `$${ledgerSummary?.totalEquity.toLocaleString() || '834,000'}`, trend: '+4.1%', color: 'indigo', icon: ShieldCheck },
          { label: 'تراکنش‌های امروز', value: '۱۴۲ مورد', trend: 'عادی', color: 'emerald', icon: Database },
        ].map((stat, i) => (
          <div key={i} className="group bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-brand/20 transition-all duration-500 cursor-default relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className={`p-5 rounded-[1.5rem] transition-all group-hover:scale-110 group-hover:rotate-3 ${
                  stat.color === 'brand' ? 'bg-brand/5 text-brand' : 
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  stat.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <stat.icon size={32} />
                </div>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl ${stat.trend === 'عادی' || stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</h3>
              <p className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-slate-200/60 shadow-sm relative overflow-hidden text-right">
          <div className="flex items-center justify-between mb-14">
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter leading-none">نمودار رشد مالی</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-3">تحلیل عواید و مصارف ماهوار</p>
            </div>
          </div>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6A5AE0" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6A5AE0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '32px', border: 'none', boxShadow: '0 35px 70px -15px rgb(106 90 224 / 0.15)', padding: '24px', textAlign: 'right' }}
                />
                <Area type="monotone" dataKey="revenue" name="عایدات" stroke="#6A5AE0" strokeWidth={6} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" name="مصارف" stroke="#cbd5e1" strokeWidth={4} fill="transparent" strokeDasharray="8 8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="bg-[#0F1117] p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden flex flex-col group h-full text-right">
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-6 mb-14">
                <div className="bg-brand p-5 rounded-[2rem] shadow-2xl shadow-brand/40 transform rotate-3 group-hover:rotate-0 transition-transform">
                  <CheckCircle2 size={32} fill="white" className="text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tighter leading-none text-white">دستیار هوشمند</h3>
                  <span className="text-[10px] text-brand-light font-black uppercase tracking-[0.4em] mt-3 block">تحلیل زنده توسط نکسوس AI</span>
                </div>
              </div>
              
              <div className="space-y-10">
                {loadingInsights ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-6 bg-white/5 rounded-full w-full"></div>
                    <div className="h-6 bg-white/5 rounded-full w-11/12"></div>
                  </div>
                ) : (
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">منبع: کلاستر هوش مصنوعی</span>
                      <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> آنلاین
                      </span>
                    </div>
                    <div className="text-slate-300 text-base leading-relaxed font-semibold italic">
                      {insights}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative z-10 pt-14">
               <button className="w-full bg-brand hover:bg-brand-dark text-white font-black py-7 rounded-[2rem] text-xs transition-all shadow-2xl shadow-brand/20 active:scale-95 uppercase tracking-[0.2em]">
                ایجاد راپور تفصیلی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
