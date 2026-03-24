import Round1 from "./Round1";
import Round2 from "./Round2";
import Round3 from "./Round3";
import Round4 from "./Round4";

import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import { getRoundName } from "../app/roundUtils";

export default function RoundSwitcher() {
  const order = useGameStore((s) => s.roundsOrder);
  const index = useGameStore((s) => s.roundIndex);
  const isRoundActive = useGameStore((s) => s.isRoundActive);
  const startRound = useGameStore((s) => s.startRound);
  const settings = useSettingsStore();
  
  const r = order[index];

  if (!r) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 space-y-8 animate-in zoom-in duration-700 text-right" dir="rtl">
        <div className="text-9xl">🏆</div>
        <h1 className="text-6xl font-black text-white italic tracking-tighter">انتهى التحدي</h1>
        <p className="text-slate-500 font-medium text-xl max-w-md text-center">
          شكراً لجميع المتسابقين. يمكنك مراجعة لوحة النقاط لمعرفة الفائز النهائي!
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="bg-white text-black px-12 py-5 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition-all active:scale-95"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  // Round Intro Screen
  if (!isRoundActive) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 space-y-12 text-right animate-in fade-in duration-1000" dir="rtl">
        <div className="space-y-4 flex flex-col items-center">
          <span className="bg-purple-600/20 text-purple-400 px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase">جاهز للجولة؟</span>
          <h1 className="text-[10rem] font-black text-white italic tracking-tighter leading-none">الجولة {r}</h1>
          <h2 className="text-4xl font-bold text-slate-500">
            {getRoundName(settings, r)}
          </h2>
        </div>

        <button 
          onClick={startRound}
          className="bg-white text-black px-24 py-8 rounded-[40px] font-black text-5xl shadow-[0_30px_60px_-15px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all uppercase italic"
        >
          ابدأ الآن!
        </button>

        <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">تأكد من استعداد المتسابقين قبل الضغط</p>
      </div>
    );
  }

  if (r === 1) return <Round1 />;
  if (r === 2) return <Round2 />;
  if (r === 3) return <Round3 />;
  if (r === 4) return <Round4 />;

  return null;
}
