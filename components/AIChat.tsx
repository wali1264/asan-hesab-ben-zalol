
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, Bot, Loader2, ExternalLink, Zap } from 'lucide-react';
import { startERPConsultation } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'خوش آمدید. من دستیار هوشمند نکسوس هستم. چطور می‌توانم در مدیریت امور مالی یا گودام به شما کمک کنم؟' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const response = await startERPConsultation(history, userMsg);
    
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: response.text,
      sources: response.sources 
    }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 left-12 w-20 h-20 bg-[#0F1117] text-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,17,23,0.4)] flex items-center justify-center hover:scale-110 transition-all z-50 group border border-white/10"
      >
        <Sparkles size={32} className="group-hover:rotate-12 group-hover:text-brand-light transition-all duration-500" />
      </button>

      {isOpen && (
        <div className="fixed bottom-36 left-12 w-[450px] h-[650px] bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-12 duration-500 text-right">
          <div className="p-8 bg-[#0F1117] text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
                 <Zap size={20} fill="white" className="text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg block tracking-tight">هوش نکسوس</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mt-0.5">پشتیبانی خودکار</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/5 rounded-[1.2rem] transition-colors text-slate-400">
              <X size={24} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FDFDFF] scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[90%] p-6 rounded-[2rem] text-sm font-semibold leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand text-white rounded-tl-none shadow-xl shadow-brand/10' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tr-none shadow-lg shadow-slate-200/50'
                }`}>
                  <div className={`flex items-center gap-2 mb-3 opacity-60 ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} className="text-brand" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {msg.role === 'user' ? 'اپراتور' : 'نود هوشمند'}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <ExternalLink size={12} /> منابع تأیید شده
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, sIdx) => (
                          <a 
                            key={sIdx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] bg-brand/5 text-brand px-3 py-1.5 rounded-full hover:bg-brand/10 transition-colors font-bold max-w-full truncate inline-block"
                            title={source.title}
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-white border border-slate-100 p-5 rounded-[2rem] rounded-tr-none shadow-lg shadow-slate-200/50">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-duration:0.6s]"></div>
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:-0.2s]"></div>
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:-0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white border-t border-slate-100 flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="درخواست خود را اینجا بنویسید..."
              className="flex-1 bg-slate-50 rounded-[1.5rem] px-6 py-4 text-base outline-none focus:ring-4 focus:ring-brand/10 focus:bg-white transition-all font-bold placeholder:text-slate-300 border border-slate-100"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-brand text-white p-4 rounded-[1.5rem] hover:bg-brand-dark transition-all disabled:opacity-50 disabled:scale-95 shadow-2xl shadow-brand/20"
            >
              <Send size={24} className="rotate-180" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
