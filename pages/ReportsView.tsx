
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Line, Area
} from 'recharts';
import { 
  FileText, TrendingUp, ShieldCheck, Download, Calendar, 
  Database, Loader2, PieChart, Calculator, BookOpen, Layers
} from 'lucide-react';
import { apiService } from '../services/apiService';

const trendData = [
  { month: 'حمل', revenue: 12000, expense: 8000 },
  { month: 'ثور', revenue: 15000, expense: 9200 },
  { month: 'جوزا', revenue: 13500, expense: 9800 },
  { month: 'سرطان', revenue: 18000, expense: 11000 },
  { month: 'اسد', revenue: 22000, expense: 12500 },
  { month: 'سنبله', revenue: 21000, expense: 13000 },
];

const ReportsView: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'P&L' | 'BALANCE_SHEET' | 'TRIAL_BALANCE'>('P&L');
  const [reportData, setReportData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ 
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    let res;
    if (activeReport === 'TRIAL_BALANCE') {
      res = await apiService.getTrialBalance(dateRange.start, dateRange.end);
    } else {
      res = await apiService.getFinancialReport(activeReport, dateRange.end, dateRange.start);
    }
    if (res.success) setReportData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [activeReport, dateRange]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-right" dir="rtl">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
        <div>
          <div className="flex items-center justify-end gap-3 mb-3">
             <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
                <Layers size={14} /> منبع داده: دیتابیس مرکزی
             </div>
             <div className="px-4 py-1.5 bg-brand/10 text-brand rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-brand/20">واحد راپوردگی</div>
          </div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">راپورهای تحلیلی</h2>
          <p className="text-slate-400 text-lg mt-4 font-medium max-w-2xl">مشاهده گزارشات مالی و ترازنامه‌های سیستمی بر اساس استانداردهای محاسباتی.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-xl flex gap-1">
            <div className="flex items-center gap-4 px-8 py-4 bg-slate-50 rounded-[2rem] border border-slate-100">
              <Calendar size={18} className="text-brand" />
              <input 
                type="date" 
                value={dateRange.start} 
                onChange={e => setDateRange({...dateRange, start: e.target.value})}
                className="bg-transparent text-xs font-black uppercase outline-none text-slate-600"
              />
              <span className="text-slate-300 font-bold text-[10px]">الی</span>
              <input 
                type="date" 
                value={dateRange.end} 
                onChange={e => setDateRange({...dateRange, end: e.target.value})}
                className="bg-transparent text-xs font-black uppercase outline-none text-slate-600"
              />
            </div>
          </div>
          <button className="p-6 bg-slate-900 text-white rounded-[2.5rem] hover:bg-brand transition-all shadow-2xl active:scale-95 group">
            <Download size={28} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex p-2 bg-white/50 backdrop-blur-md rounded-[3rem] border border-slate-100 shadow-sm w-fit mr-0 ml-auto">
        {[
          { id: 'P&L', label: 'صورت سود و ضرر' },
          { id: 'BALANCE_SHEET', label: 'ترازنامه' },
          { id: 'TRIAL_BALANCE', label: 'تراز آزمایشی' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveReport(tab.id as any)}
            className={`px-12 py-5 rounded-[2.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeReport === tab.id ? 'bg-brand text-white shadow-2xl shadow-brand/30' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm overflow-hidden relative min-h-[500px]">
          {loading ? (
            <div className="py-48 flex flex-col items-center justify-center gap-8">
              <Loader2 className="animate-spin text-brand" size={64} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">در حال بارگذاری گزارش...</p>
            </div>
          ) : (
            <div className="space-y-12">
               <h3 className="text-3xl font-black text-slate-900">گزارش {activeReport === 'P&L' ? 'سود و ضرر' : activeReport === 'BALANCE_SHEET' ? 'ترازنامه' : 'تراز آزمایشی'}</h3>
               {activeReport === 'P&L' && reportData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <div className="bg-emerald-50/50 p-10 rounded-[3rem] border border-emerald-100 flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">مجموع عایدات</p>
                        <p className="text-5xl font-black text-emerald-700 tracking-tighter">${reportData.totalRevenue.toLocaleString()}</p>
                     </div>
                     <div className="bg-rose-50/50 p-10 rounded-[3rem] border border-rose-100 flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-2">مجموع مصارف</p>
                        <p className="text-5xl font-black text-rose-700 tracking-tighter">${reportData.totalExpense.toLocaleString()}</p>
                     </div>
                     <div className="bg-brand/5 p-10 rounded-[3rem] border border-brand/10 flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-2">سود خالص</p>
                        <p className="text-5xl font-black text-brand tracking-tighter">${reportData.profit.toLocaleString()}</p>
                     </div>
                  </div>
               )}
               <div className="h-[400px] mt-12">
                 <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={trendData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 35px 70px -15px rgb(106 90 224 / 0.15)', textAlign: 'right' }} />
                     <Area type="monotone" dataKey="revenue" fill="#6A5AE0" fillOpacity={0.05} stroke="none" />
                     <Bar dataKey="revenue" name="عاید" fill="#6A5AE0" radius={[12, 12, 0, 0]} barSize={40} />
                     <Line type="monotone" dataKey="expense" name="مصرف" stroke="#F43F5E" strokeWidth={5} dot={{ r: 7, fill: '#F43F5E', strokeWidth: 2, stroke: '#FFF' }} />
                   </ComposedChart>
                 </ResponsiveContainer>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
