
import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, UserPlus, LogIn, Building, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    branchId: '1',
    roleId: '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isRegister) {
      const res = await register(formData);
      if (res.success) {
        setIsRegister(false);
        alert("ثبت‌نام موفقیت‌آمیز بود! لطفاً وارد شوید.");
      }
    } else {
      const res = await login(formData.username, formData.password);
      if (res.success) {
        onLogin();
      } else {
        alert("اطلاعات ورود نادرست است. لطفاً دوباره تلاش کنید.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-light/5 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(106,90,224,0.15)] border border-white p-12 md:p-16 relative">
          <div className="flex flex-col items-center mb-14">
            <div className="w-24 h-24 bg-brand rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-brand/30 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Zap className="text-white fill-white" size={48} />
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tighter leading-none">نکسوس</h1>
            <p className="text-slate-400 mt-3 text-sm font-bold uppercase tracking-[0.4em]">هوش مصنوعی ابری</p>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] mb-10 border border-slate-200">
            <button 
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-3.5 text-xs font-black rounded-[1.2rem] transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${!isRegister ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LogIn size={16} /> ورود
            </button>
            <button 
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-3.5 text-xs font-black rounded-[1.2rem] transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${isRegister ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <UserPlus size={16} /> ثبت‌نام
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">نام کاربری</label>
              <div className="relative group">
                <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-[1.5rem] py-5 pr-14 pl-6 outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:bg-white transition-all font-bold text-base placeholder:text-slate-300"
                  placeholder="operator_root"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رمز عبور</label>
              <div className="relative group">
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-[1.5rem] py-5 pr-14 pl-6 outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:bg-white transition-all font-bold text-base placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegister && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">نمایندگی اصلی</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-[1.5rem] py-5 px-6 outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand appearance-none text-sm font-bold"
                    value={formData.branchId}
                    onChange={(e) => setFormData({...formData, branchId: e.target.value})}
                  >
                    <option value="1">مرکز کابل</option>
                    <option value="2">زون غرب</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">سطح دسترسی</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-[1.5rem] py-5 px-6 outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand appearance-none text-sm font-bold"
                    value={formData.roleId}
                    onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                  >
                    <option value="1">ادمین</option>
                    <option value="2">بررسی کننده</option>
                    <option value="3">مدیر کل</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-black py-6 rounded-[1.5rem] transition-all shadow-2xl shadow-brand/30 active:scale-95 flex items-center justify-center gap-3 group mt-8 uppercase tracking-widest text-sm"
            >
              {loading ? (
                <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegister ? 'ایجاد حساب کاربری' : 'ورود به سیستم'}
                  <ArrowRight size={22} className="group-hover:-translate-x-2 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          <div className="mt-14 pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span>© ۲۰۲۵ نکسوس سیستمز</span>
            <span className="text-brand flex items-center gap-2">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
              رمزنگاری فعال است
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
