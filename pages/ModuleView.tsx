
import React, { useState, useEffect, useCallback } from 'react';
import { ModuleType, Voucher, Account, AccountType, FiscalYear, InventoryTransaction, InventoryType, InventoryBatch, Approval } from '../types';
import { 
  Plus, ChevronRight, CheckCircle2, Zap, Layers, CalendarDays, Lock, Package, Loader2, ShieldAlert, Tag, Trash2, RotateCcw, Ghost, Users, Mail, Phone, ShoppingCart, BarChart3, Fingerprint, Activity
} from 'lucide-react';
import AddEntryModal from '../components/AddEntryModal';
import { apiService } from '../services/apiService';

interface ModuleViewProps {
  module: ModuleType;
}

const ModuleView: React.FC<ModuleViewProps> = ({ module }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleData, setModuleData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiService.get(module, showDeleted);
    if (res.success) {
      setModuleData(res.data);
    } else {
      setError(res.error || "برقراری ارتباط با سرور نکسوس ناموفق بود.");
    }
    setLoading(false);
  }, [module, showDeleted]);

  useEffect(() => {
    const checkAuth = async () => {
      const allowed = await apiService.checkPermission('CREATE_SALE');
      setCanCreate(allowed);
    };
    checkAuth();
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این ریکورد اطمینان دارید؟ (حذف نرم انجام می‌شود)")) return;
    await apiService.deleteEntity(module, id);
    fetchData();
  };

  const handleRestore = async (id: number) => {
    await apiService.restoreEntity(module, id);
    fetchData();
  };

  const renderTableWrapper = (headers: string[], children: React.ReactNode) => (
    <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm text-right">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {headers.map((h, i) => (
              <th key={i} className={`px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest ${i === headers.length - 1 ? 'text-left' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">{children}</tbody>
      </table>
    </div>
  );

  const renderGenericList = () => {
    if (!moduleData || !Array.isArray(moduleData)) return null;
    
    if (module === ModuleType.CUSTOMERS) {
      return renderTableWrapper(['نام و مشخصات', 'اطلاعات تماس', 'موجودی حساب', 'مدیریت'], 
        moduleData.map((c: any) => (
          <tr key={c.id} className={`hover:bg-slate-50/50 transition-colors ${c.isDeleted ? 'opacity-50 grayscale' : ''}`}>
            <td className="px-10 py-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                  {c.name.charAt(0)}
                </div>
                <span className="font-black text-slate-900 tracking-tight">{c.name}</span>
              </div>
            </td>
            <td className="px-10 py-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Mail size={12}/> {c.email}</div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><Phone size={12}/> {c.phone}</div>
              </div>
            </td>
            <td className="px-10 py-6">
               <span className="text-sm font-black text-slate-900">${c.balance.toLocaleString()}</span>
            </td>
            <td className="px-10 py-6 text-left">
              {c.isDeleted ? 
                <button onClick={() => handleRestore(c.id)} title="بازیابی" className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl"><RotateCcw size={18}/></button> :
                <button onClick={() => handleDelete(c.id)} title="حذف" className="p-3 text-slate-300 hover:text-rose-500 rounded-xl"><Trash2 size={18}/></button>
              }
            </td>
          </tr>
        ))
      );
    }

    if (module === ModuleType.PRODUCTS) {
      return renderTableWrapper(['نام کالا', 'کد SKU', 'قیمت واحد', 'موجودی فعلی', 'مدیریت'], 
        moduleData.map((p: any) => (
          <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors ${p.isDeleted ? 'opacity-50 grayscale' : ''}`}>
            <td className="px-10 py-6 font-black text-slate-900 tracking-tight">{p.name}</td>
            <td className="px-10 py-6 font-mono text-xs text-slate-400">{p.sku}</td>
            <td className="px-10 py-6 font-bold text-slate-600">${p.price}</td>
            <td className="px-10 py-6">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${p.stock < 30 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {p.stock} واحد
              </span>
            </td>
            <td className="px-10 py-6 text-left">
               {p.isDeleted ? 
                <button onClick={() => handleRestore(p.id)} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl"><RotateCcw size={18}/></button> :
                <button onClick={() => handleDelete(p.id)} className="p-3 text-slate-300 hover:text-rose-500 rounded-xl"><Trash2 size={18}/></button>
              }
            </td>
          </tr>
        ))
      );
    }

    return (
      <div className="p-20 text-center opacity-30 flex flex-col items-center">
        <Layers size={80} className="mb-6 text-brand" />
        <p className="text-xl font-black uppercase tracking-widest text-slate-400">دیتا سنتر: در حال بارگذاری ماژول {module}</p>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return (
      <div className="py-48 flex flex-col items-center gap-6">
        <Loader2 className="animate-spin text-brand" size={60} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">همگام‌سازی با نود مرکزی...</p>
      </div>
    );

    if (error) return (
      <div className="py-48 flex flex-col items-center text-center px-10">
        <ShieldAlert size={60} className="text-rose-500 mb-6" />
        <p className="text-xl font-black text-slate-900 mb-2">خطای سیستمی</p>
        <p className="text-slate-500 text-sm max-w-md">{error}</p>
        <button onClick={fetchData} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">تلاش دوباره</button>
      </div>
    );

    switch (module) {
      case ModuleType.JOURNAL:
      case ModuleType.PURCHASES:
        return renderTableWrapper(['مرجع و تاریخ', 'وضعیت تایید', 'بدهکار/طلبکار', 'عملیات'], 
          (moduleData as Voucher[] || []).map(v => (
            <React.Fragment key={v.id}>
              <tr className={`bg-slate-50/30 ${v.isDeleted ? 'opacity-50 grayscale' : ''}`}>
                <td className="px-10 py-4 font-black text-[10px] uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-3">
                    <Tag size={14} className="text-brand" /> {v.reference || 'بدون مرجع'} — {new Date(v.date).toLocaleDateString('fa-AF')}
                  </div>
                </td>
                <td className="px-10 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase">ثبت نهایی</span>
                </td>
                <td className="px-10 py-4 text-left"></td>
                <td className="px-10 py-4 text-left">
                  {v.isDeleted ? 
                    <button onClick={() => handleRestore(v.id)} className="p-2 text-emerald-500"><RotateCcw size={14}/></button> :
                    <button onClick={() => handleDelete(v.id)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={14}/></button>
                  }
                </td>
              </tr>
              {v.entries.map((e, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-10 py-4 text-sm font-bold text-slate-600 pr-20">{e.accountName}</td>
                  <td></td>
                  <td className="px-10 py-4 text-left text-emerald-600 font-black text-base tracking-tight">{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td>
                  <td className="px-10 py-4 text-left text-slate-900 font-black text-base tracking-tight">{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td>
                </tr>
              ))}
            </React.Fragment>
          ))
        );
      default:
        return renderGenericList();
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 text-right">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="px-4 py-1.5 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand/20">لایه عملیاتی</div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> ارتباط امن برقرار است
             </span>
          </div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter lowercase first-letter:uppercase">
            {showDeleted ? `آرشیف بخش ${module}` : `بخش ${module}`}
          </h2>
          <p className="text-slate-400 font-medium text-lg mt-2">مدیریت لایه دیتابیس برای ماژول <span className="text-brand font-black uppercase">{module}</span>.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowDeleted(!showDeleted)} 
             className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all border ${
               showDeleted ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-brand/50 shadow-sm'
             }`}
           >
              {showDeleted ? <Layers size={16} /> : <Ghost size={16} />}
              {showDeleted ? 'نمایش لیست زنده' : 'مشاهده آرشیف'}
           </button>

           {canCreate && !showDeleted && (
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-4 px-12 py-7 bg-slate-900 text-white rounded-[2.5rem] hover:bg-brand transition-all font-black shadow-xl uppercase text-xs tracking-widest active:scale-95 group">
              <Plus size={24} className="group-hover:rotate-90 transition-transform" />
              افزودن ریکورد جدید
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[500px]">
        {renderContent()}
      </div>

      {showAddModal && (
        <AddEntryModal module={module} onClose={() => { setShowAddModal(false); fetchData(); }} onSuccess={fetchData} />
      )}
    </div>
  );
};

export default ModuleView;
