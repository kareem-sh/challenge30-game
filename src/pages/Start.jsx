import { useNavigate } from "react-router-dom";
import { useGameStore } from "../app/gameStore";

export default function Start() {
  const nav = useNavigate();
  const resetGame = useGameStore((s) => s.resetGame);

  const handleStart = () => {
    resetGame();
    nav("/round");
  };

  return (
    <div className="min-h-screen bg-[#08090a] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        <div className="mb-4">
          <span className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-purple-400 text-xs font-black tracking-[0.4em] uppercase">
            Official Production Suite
          </span>
        </div>

        <h1 className="text-[12rem] font-black leading-none tracking-tighter italic mb-8 relative">
          <span className="text-white">CHALLENGE</span>
          <span className="bg-gradient-to-br from-purple-400 to-pink-600 bg-clip-text text-transparent">30</span>
          {/* Decorative lines */}
          <div className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </h1>

        <p className="text-slate-400 text-2xl font-medium mb-16 text-center max-w-2xl leading-relaxed">
          The most advanced, high-fidelity gaming controller for your live events. 
          Ready to broadcast?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <button 
            onClick={handleStart}
            className="group relative bg-white text-black p-8 rounded-[40px] font-black text-3xl transition-all hover:scale-[1.05] active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-4">
               START SESSION <span className="text-4xl">→</span>
            </span>
          </button>
          
          <button 
            onClick={() => nav("/scoreboard")}
            className="group relative bg-[#1a1c1e] text-white p-8 rounded-[40px] font-black text-3xl transition-all hover:scale-[1.05] active:scale-95 border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors" />
            <span className="relative flex items-center justify-center gap-4 text-slate-300">
               TV BROADCAST <span className="opacity-50 italic">VIEW</span>
            </span>
          </button>
        </div>

        <div className="mt-20 flex items-center gap-12">
          <button onClick={() => nav("/settings")} className="text-slate-500 hover:text-white font-black text-sm uppercase tracking-widest transition-colors flex items-center gap-3">
             <span className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center group-hover:border-white transition-colors text-lg">⚙</span>
             Configure Logic
          </button>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="text-slate-600 font-bold text-xs uppercase tracking-widest">
            V4.0 ENGINE
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-700 font-black text-[10px] tracking-[1em] uppercase">
        Designed for High Performance Environments
      </div>
    </div>
  );
}
