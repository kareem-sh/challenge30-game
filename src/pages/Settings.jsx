import { useNavigate } from "react-router-dom";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";

export default function Settings() {
  const nav = useNavigate();
  const players = useGameStore((s) => s.players);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setOrder = useGameStore((s) => s.setRoundsOrder);
  const currentOrder = useGameStore((s) => s.roundsOrder);
  const settings = useSettingsStore();
  const updateRound = useSettingsStore((s) => s.updateRound);

  const presets = [
    { label: "الافتراضي (1-2-3-4)", order: [1, 2, 3, 4] },
    { label: "المزاد أولاً (2-1-3-4)", order: [2, 1, 3, 4] },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12 text-right" dir="rtl">
      <div className="flex justify-between items-center border-b pb-8 flex-row-reverse">
        <div>
          <h1 className="text-4xl font-black text-white">إعدادات اللعبة</h1>
          <p className="text-slate-500 font-medium">قم بتخصيص تجربة اللعبة قبل البدء.</p>
        </div>
        <button 
          onClick={() => nav("/")}
          className="bg-white/5 text-slate-300 px-8 py-3 rounded-2xl font-black hover:bg-white/10 transition-all border border-white/10"
        >
          العودة للقائمة
        </button>
      </div>

      {/* Player Names Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center text-sm">01</span>
          أسماء المتسابقين
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {players.map((p, idx) => (
            <div key={idx} className="bg-[#111315] p-6 rounded-3xl border border-white/5 space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">اسم المتسابق {idx + 1}</label>
               <input 
                 type="text" 
                 value={p.name} 
                 onChange={(e) => setPlayerName(idx, e.target.value)}
                 className="w-full bg-[#0a0b0c] border border-white/5 rounded-xl p-4 font-black text-xl text-white outline-none focus:border-emerald-500/50 transition-all"
               />
            </div>
          ))}
        </div>
      </section>

      {/* Rounds Order */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center text-sm">02</span>
          ترتيب الجولات
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setOrder(p.order)}
              className={`p-6 rounded-3xl border-2 text-right transition-all ${
                JSON.stringify(currentOrder) === JSON.stringify(p.order)
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/5 bg-[#111315] hover:border-white/10"
              }`}
            >
              <div className="text-lg font-black text-white mb-2">{p.label}</div>
              <div className="flex gap-2 flex-row-reverse">
                {p.order.map((r, i) => (
                   <span key={i} className="bg-white/5 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">{r}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Round 1 Fine-tuning */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center text-sm">03</span>
          إعدادات الجولة الأولى
        </h2>
        <div className="grid grid-cols-2 gap-6 text-right">
          <div className="bg-[#111315] p-6 rounded-3xl border border-white/5 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الوقت (ثواني)</label>
            <input 
              type="number" 
              value={settings.round1.time} 
              onChange={(e) => updateRound("round1", { time: Number(e.target.value) })}
              className="w-full bg-[#0a0b0c] border border-white/5 rounded-xl p-4 font-black text-xl text-white outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="bg-[#111315] p-6 rounded-3xl border border-white/5 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">حد الأخطاء</label>
            <input 
              type="number" 
              value={settings.round1.mistakes} 
              onChange={(e) => updateRound("round1", { mistakes: Number(e.target.value) })}
              className="w-full bg-[#0a0b0c] border border-white/5 rounded-xl p-4 font-black text-xl text-white outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="bg-[#111315] p-6 rounded-3xl border border-white/5 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">عدد الأسئلة</label>
            <input 
              type="number" 
              value={settings.round1.questionsCount} 
              onChange={(e) => updateRound("round1", { questionsCount: Number(e.target.value) })}
              className="w-full bg-[#0a0b0c] border border-white/5 rounded-xl p-4 font-black text-xl text-white outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-br from-purple-900/40 to-black rounded-[40px] p-12 text-center text-white space-y-6 shadow-2xl border border-white/5">
         <h3 className="text-3xl font-black italic tracking-tighter">جاهز للانطلاق؟</h3>
         <p className="text-slate-400 font-medium italic">يتم حفظ جميع التعديلات تلقائياً في المتصفح.</p>
         <button 
           onClick={() => nav("/")}
           className="w-full max-w-sm bg-white text-black py-5 rounded-[24px] font-black text-2xl hover:scale-105 transition-all shadow-xl uppercase italic"
         >
           حفظ وإغلاق
         </button>
      </div>
    </div>
  );
}
