
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Line, Area, Cell
} from 'recharts';
import { 
  FileText, TrendingUp, ShieldCheck, Download, Calendar, 
  ChevronRight, Sparkles, Database, ArrowUpRight, ArrowDownRight,
  Loader2, Filter, PieChart, Info, Calculator, Terminal, Zap, BookOpen, Layers
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { getFinancialInsights } from '../services/geminiService';

const trendData = [
  { month: 'Jan', revenue: 12000, expense: 8000, target: 11000 },
  { month: 'Feb', revenue: 15000, expense: 9200, target: 11000 },
  { month: 'Mar', revenue: 13500, expense: 9800, target: 11000 },
  { month: 'Apr', revenue: 18000, expense: 11000, target: 14000 },
  { month: 'May', revenue: 22000, expense: 12500, target: 14000 },
  { month: 'Jun', revenue: 21000, expense: 13000, target: 14000 },
];

const ReportsView: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'P&L' | 'BALANCE_SHEET' | 'TRIAL_BALANCE'>('P&L');
  const [reportData, setReportData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ 
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    setAiInsight(null);
  };

  useEffect(() => {
    fetchReport();
  }, [activeReport, dateRange]);

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    const context = `Report: ${activeReport}. Period: ${dateRange.start} to ${dateRange.end}. Raw Financials: ${JSON.stringify(reportData)}. Data seeded via Prisma. Soft-delete enforcement enabled.`;
    const insight = await getFinancialInsights(context);
    setAiInsight(insight);
    setIsAnalyzing(false);
  };

  const renderBalanceSheet = () => {
    if (!reportData || !reportData.assets) return null;

    const totalAssets = reportData.assets.reduce((s: number, a: any) => s + a.balance, 0);
    const totalLiabilities = reportData.liabilities.reduce((s: number, a: any) => s + a.balance, 0);
    const totalEquity = reportData.equity.reduce((s: number, a: any) => s + a.balance, 0);
    const sumLAndE = totalLiabilities + totalEquity;

    const renderSection = (title: string, items: any[], sectionTotal: number, colorStyle: string) => (
      <div className="space-y-6 mb-12">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${colorStyle.split(' ')[0]}`}></div>
           {title}
        </h4>
        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
           <table className="w-full text-left">
             <tbody className="divide-y divide-slate-50">
               {items.map((item, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                   <td className="px-10 py-6 text-sm font-bold text-slate-600">{item.name}</td>
                   <td className="px-10 py-6 text-right font-black text-slate-900 tracking-tight">${item.balance.toLocaleString()}</td>
                 </tr>
               ))}
               <tr className="bg-slate-50/30">
                 <td className="px-10 py-8 text-xs font-black text-slate-900 uppercase tracking-widest text-opacity-50">Total {title}</td>
                 <td className={`px-10 py-8 text-right font-black text-2xl tracking-tighter ${colorStyle.replace('bg-', 'text-')}`}>
                   ${sectionTotal.toLocaleString()}
                 </td>
               </tr>
             </tbody>
           </table>
        </div>
      </div>
    );

    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <div>
            {renderSection("Assets", reportData.assets, totalAssets, "bg-emerald-500")}
          </div>
          <div className="flex flex-col">
            {renderSection("Liabilities", reportData.liabilities, totalLiabilities, "bg-rose-500")}
            {renderSection("Equity", reportData.equity, totalEquity, "bg-brand")}
            
            <div className="mt-auto p-12 rounded-[3.5rem] bg-slate-950 text-white shadow-3xl flex items-center justify-between border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors pointer-events-none"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Total Liabilities & Equity</p>
                <p className="text-5xl font-black tracking-tighter text-white">${sumLAndE.toLocaleString()}</p>
              </div>
              <div className="relative z-10 flex flex-col items-end">
                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest ${Math.abs(totalAssets - sumLAndE) < 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                   {Math.abs(totalAssets - sumLAndE) < 1 ? <ShieldCheck size={18} /> : <Info size={18} />}
                   {Math.abs(totalAssets - sumLAndE) < 1 ? 'Integrated Balanced' : 'System Discrepancy'}
                </div>
                <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase tracking-widest">Accounting Integrity Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrialBalance = () => {
    if (!reportData || !reportData.rows) return null;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Account Map</th>
              <th className="pb-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Debit ($)</th>
              <th className="pb-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Credit ($)</th>
              <th className="pb-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Net Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reportData.rows.map((row: any, i: number) => (
              <tr key={i} className="group hover:bg-slate-50 transition-colors">
                <td className="py-10">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-800 tracking-tight">{row.account}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">REGISTRY CODE: {row.code}</span>
                  </div>
                </td>
                <td className="py-10 text-right font-bold text-slate-600">
                  {row.debit > 0 ? `$${row.debit.toLocaleString()}` : '-'}
                </td>
                <td className="py-10 text-right font-bold text-slate-600">
                  {row.credit > 0 ? `$${row.credit.toLocaleString()}` : '-'}
                </td>
                <td className={`py-10 text-right font-black text-2xl tracking-tighter ${row.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ${Math.abs(row.balance).toLocaleString()} {row.balance < 0 ? 'CR' : 'DR'}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden">
              <td className="py-10 px-10 font-black uppercase text-[11px] tracking-widest">Consolidated Partition Total</td>
              <td className="py-10 text-right px-10 font-black text-xl">
                ${reportData.totalDebitAll.toLocaleString()}
              </td>
              <td className="py-10 text-right px-10 font-black text-xl">
                ${reportData.totalCreditAll.toLocaleString()}
              </td>
              <td className={`py-10 text-right px-10 font-black text-xl ${reportData.isBalanced ? 'text-brand-light' : 'text-rose-400'}`}>
                {reportData.isBalanced ? 'Balanced' : 'Unbalanced'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="px-4 py-1.5 bg-brand/10 text-brand rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-brand/20">SQL Analytics Node</div>
             <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
                <Layers size={14} /> Partition: Seeded PostgreSQL
             </div>
          </div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Intelligence Reports</h2>
          <p className="text-slate-400 text-lg mt-4 font-medium max-w-2xl">Visualizing atomic ledger data and relational summaries using Prisma Aggregate services.</p>
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
              <span className="text-slate-300 font-bold text-[10px]">TO</span>
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

      <div className="flex p-2 bg-white/50 backdrop-blur-md rounded-[3rem] border border-slate-100 shadow-sm w-fit">
        {[
          { id: 'P&L', label: 'Profit & Loss' },
          { id: 'BALANCE_SHEET', label: 'Balance Sheet' },
          { id: 'TRIAL_BALANCE', label: 'Trial Balance' }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm overflow-hidden relative min-h-[600px]">
            <div className="flex items-center justify-between mb-14">
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">View: {activeReport.replace('_', ' ')}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
                  <Database size={12} /> Root Partition: SQL_AGGR_NODE
                </p>
              </div>
              <div className="p-5 bg-brand/5 text-brand rounded-[2rem] border border-brand/10">
                 <Zap size={24} className="animate-pulse fill-brand" />
              </div>
            </div>

            {loading ? (
              <div className="py-48 flex flex-col items-center justify-center gap-8">
                <Loader2 className="animate-spin text-brand" size={64} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Aggregating Service Results...</p>
              </div>
            ) : activeReport === 'BALANCE_SHEET' ? (
              renderBalanceSheet()
            ) : activeReport === 'TRIAL_BALANCE' ? (
              renderTrialBalance()
            ) : (
              <div className="space-y-12">
                 {activeReport === 'P&L' && reportData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-emerald-50/50 p-10 rounded-[3rem] border border-emerald-100 flex flex-col justify-between group hover:bg-emerald-50 transition-colors">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Aggregate Revenue</p>
                          <p className="text-5xl font-black text-emerald-700 tracking-tighter">${reportData.totalRevenue.toLocaleString()}</p>
                       </div>
                       <div className="bg-rose-50/50 p-10 rounded-[3rem] border border-rose-100 flex flex-col justify-between group hover:bg-rose-50 transition-colors">
                          <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-2">Operating Expenses</p>
                          <p className="text-5xl font-black text-rose-700 tracking-tighter">${reportData.totalExpense.toLocaleString()}</p>
                       </div>
                       <div className="md:col-span-2 bg-brand/5 p-12 rounded-[3.5rem] border border-brand/10 flex items-center justify-between shadow-inner">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-2">Net Period Profit</p>
                            <p className={`text-6xl font-black tracking-tighter ${reportData.profit >= 0 ? 'text-brand' : 'text-rose-600'}`}>
                              ${reportData.profit.toLocaleString()}
                            </p>
                          </div>
                          <div className="p-6 bg-white rounded-3xl shadow-xl shadow-brand/10 group hover:rotate-6 transition-transform">
                             <TrendingUp size={48} className="text-brand" />
                          </div>
                       </div>
                    </div>
                 )}
                 <div className="h-[350px] mt-12">
                   <ResponsiveContainer width="100%" height="100%">
                     <ComposedChart data={trendData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                       <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 35px 70px -15px rgb(106 90 224 / 0.15)' }} />
                       <Area type="monotone" dataKey="revenue" fill="#6A5AE0" fillOpacity={0.05} stroke="none" />
                       <Bar dataKey="revenue" fill="#6A5AE0" radius={[12, 12, 0, 0]} barSize={40} />
                       <Line type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={5} dot={{ r: 7, fill: '#F43F5E', strokeWidth: 2, stroke: '#FFF' }} />
                     </ComposedChart>
                   </ResponsiveContainer>
                 </div>
              </div>
            )}
          </div>
          
          <div className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
             <div className="flex items-center gap-5 mb-12">
                <div className="p-5 bg-slate-900 text-white rounded-[2rem] shadow-xl group-hover:rotate-3 transition-transform"><Terminal size={24} /></div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter">System Audit Log</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ORM Transaction Pipeline</p>
                </div>
             </div>
             <div className="font-mono text-xs text-slate-500 space-y-4 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
               <p className="text-brand font-bold flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-brand rounded-full"></div> 
                 PRISMA: Scanning indexed partitions (companyId_idx, accountId_idx)...
               </p>
               <p className="text-emerald-600 font-bold flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div> 
                 SQL: Aggregating Revenue (Acc: 4000) and Expenses (Acc: 5000)... OK
               </p>
               <p className="text-slate-500 italic">Snapshot timestamp: {dateRange.start} to {dateRange.end}</p>
               <div className="pt-6 mt-6 border-t border-slate-200">
                 <p className="text-emerald-500 font-bold tracking-tighter uppercase text-[10px]">Relational optimization enabled. Node performance: NOMINAL.</p>
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          <div className="bg-[#0F1117] p-14 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden flex flex-col h-full group">
             <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
               <Sparkles size={220} />
             </div>
             
             <div className="relative z-10 flex-1">
                <div className="flex items-center gap-8 mb-16">
                   <div className="p-6 bg-brand rounded-[2.5rem] shadow-2xl shadow-brand/40 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={36} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black tracking-tighter text-white">Strategic Auditor</h3>
                      <p className="text-[10px] text-brand-light font-black uppercase tracking-[0.4em] mt-3 leading-none">Context: SQL Aggregates</p>
                   </div>
                </div>

                <div className="space-y-10">
                   <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 relative backdrop-blur-sm">
                      {!aiInsight ? (
                        <div className="space-y-8">
                           <p className="text-slate-400 text-base leading-relaxed font-bold italic opacity-70">Nexus AI is ready to audit your relational financial snapshots.</p>
                           <button 
                             onClick={runAiAnalysis}
                             disabled={isAnalyzing}
                             className="flex items-center gap-4 text-brand-light font-black uppercase text-[11px] tracking-widest hover:text-white transition-all group/btn"
                           >
                             {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                             <span className="border-b border-brand-light/20 group-hover/btn:border-white transition-all">Audit Relational Data</span>
                           </button>
                        </div>
                      ) : (
                        <div className="animate-in fade-in slide-in-from-top-6 duration-700">
                           <div className="flex items-center justify-between mb-8">
                              <span className="text-[11px] font-black text-brand-light uppercase tracking-widest">Audit Insights</span>
                              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                           </div>
                           <p className="text-slate-200 text-lg leading-relaxed font-semibold italic">
                             {aiInsight}
                           </p>
                           <button 
                             onClick={() => setAiInsight(null)}
                             className="mt-10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                           >
                             Clear Analysis
                           </button>
                        </div>
                      )}
                   </div>
                   
                   <div className="p-10 bg-brand/10 border border-brand/20 rounded-[3.5rem] flex items-center gap-8 group hover:bg-brand/20 transition-all cursor-default relative overflow-hidden">
                      <div className="p-5 bg-white/10 rounded-[2rem] text-brand-light group-hover:rotate-12 transition-transform"><Calculator size={32} /></div>
                      <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Integrity Score</p>
                        <p className="text-4xl font-black text-white tracking-tighter">9.9/10</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="relative z-10 mt-16 pt-16 border-t border-white/5">
                <button className="w-full bg-brand text-white font-black py-8 rounded-[2.5rem] text-xs uppercase tracking-[0.4em] hover:bg-brand-dark transition-all shadow-3xl shadow-brand/30 active:scale-95 flex items-center justify-center gap-4 group">
                  <BookOpen size={20} className="group-hover:rotate-6 transition-transform" /> Set Audit Baseline
                </button>
             </div>
          </div>

          <div className="bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-sm flex flex-col group relative overflow-hidden h-[450px]">
             <div className="flex items-center gap-5 mb-10">
                <div className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-lg"><PieChart size={24} /></div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sector Allocation</span>
             </div>
             <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData.slice(-4)}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6A5AE0" />
                        <stop offset="100%" stopColor="#9B8CFF" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                    <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="revenue" fill="url(#barGrad)" radius={[12, 12, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center justify-between gap-3 text-brand">
                   <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 bg-brand rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Velocity</span>
                   </div>
                </div>
                <div className="text-emerald-500 font-black text-lg tracking-tight">+14.2%</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
