import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isScoreboard = location.pathname === "/scoreboard";

  if (isScoreboard) return <Outlet />;

  return (
    <div className="min-h-screen bg-[#0a0b0c] font-sans text-slate-100 flex flex-col" dir="rtl">
      {/* Premium Navigation */}
      {!isHome && (
        <nav className="bg-[#111315]/80 backdrop-blur-xl border-b border-white/5 px-10 py-5 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
          <Link to="/" className="text-3xl font-black italic tracking-tighter hover:opacity-80 transition-all flex items-center gap-2">
            CHALLENGE<span className="text-purple-500">30</span>
            <span className="mr-2 text-[10px] font-black tracking-widest text-slate-500 py-1 px-3 bg-white/5 rounded-full border border-white/5">
              شاشة التحكم
            </span>
          </Link>
          
          <div className="flex gap-10 items-center">
             <Link to="/settings" className="text-xs font-black text-slate-400 hover:text-white transition-colors tracking-[0.2em]">الإعدادات</Link>
             <Link to="/questions" className="text-xs font-black text-slate-400 hover:text-white transition-colors tracking-[0.2em]">بنك الأسئلة</Link>
             <Link to="/scoreboard" target="_blank" className="group flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-2xl font-black text-xs tracking-widest hover:bg-purple-100 transition-all">
                شاشة العرض 📺
             </Link>
          </div>
        </nav>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Operator Footer Status */}
      {!isHome && location.pathname !== "/settings" && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0f1113] border-t border-white/5 px-10 py-3 flex justify-between items-center text-[10px] font-black tracking-[0.2em] text-slate-500 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
           <div className="flex items-center gap-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              النظام يعمل الآن
           </div>
           <div className="flex items-center gap-8">
              <span className="text-slate-400">نقاط اللاعب 1 متزامنة</span>
              <span className="text-slate-400">نقاط اللاعب 2 متزامنة</span>
              <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-md border border-purple-500/20">الاختصارات مفعلة</span>
           </div>
        </div>
      )}
    </div>
  );
}
