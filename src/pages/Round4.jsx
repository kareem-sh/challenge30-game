import React, { useEffect } from "react";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";

export default function Round4() {
  const players = useGameStore((s) => s.players);
  const current = useGameStore((s) => s.currentPlayer);
  const switchPlayer = useGameStore((s) => s.switchPlayer);
  const startTimer = useGameStore((s) => s.startTimer);
  const pauseTimer = useGameStore((s) => s.pauseTimer);
  const tick = useGameStore((s) => s.tick);
  const resetTimes = useGameStore((s) => s.resetTimes);
  const nextRound = useGameStore((s) => s.nextRound);
  const running = useGameStore((s) => s.timeRunning);
  const settings = useSettingsStore((s) => s.round4);

  useEffect(() => {
    const i = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(i);
  }, [tick]);

  const format = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Operator Console</h2>
          <h1 className="text-4xl font-black text-slate-900">ROUND 4: CHESS TIMER</h1>
        </div>
        <button onClick={nextRound} className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-red-700 shadow-lg active:scale-95 transition-all">
          FINISH GAME 🏆
        </button>
      </div>

      {/* Main Chess Clock Visual */}
      <div className="grid grid-cols-2 gap-10">
        {players.map((p, idx) => (
          <div 
            key={idx}
            className={`p-12 rounded-[60px] border-4 transition-all flex flex-col items-center justify-center relative overflow-hidden ${
              current === idx 
                ? "bg-slate-900 border-purple-500 shadow-[0_30px_60px_-15px_rgba(168,85,247,0.3)]" 
                : "bg-white border-slate-100 opacity-60 scale-95"
            }`}
          >
            {current === idx && running && (
              <div className="absolute top-0 left-0 w-full h-2 bg-purple-500 animate-[pulse_2s_infinite]" />
            )}
            
            <span className={`text-xl font-black uppercase tracking-[0.3em] mb-4 ${current === idx ? "text-purple-400" : "text-slate-400"}`}>
              {p.name}
            </span>
            
            <div className={`text-[10rem] font-black tabular-nums leading-none mb-12 ${
              current === idx 
                ? p.time < 30 ? "text-red-500 animate-pulse" : "text-white"
                : "text-slate-300"
            }`}>
              {format(p.time)}
            </div>

            {current === idx && (
              <div className="absolute -top-6 bg-purple-500 text-white px-8 py-2 rounded-full font-black text-xs uppercase tracking-widest">
                Active Timer
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-6">
        <button 
          onClick={running ? pauseTimer : startTimer}
          className={`py-12 rounded-[40px] font-black text-4xl shadow-xl transition-all flex items-center justify-center gap-4 ${
            running 
              ? "bg-amber-100 text-amber-700 border-b-[12px] border-amber-300 active:translate-y-2 active:border-b-0" 
              : "bg-emerald-500 text-white border-b-[12px] border-emerald-700 active:translate-y-2 active:border-b-0"
          }`}
        >
          {running ? "⏸ PAUSE" : "▶ START"}
        </button>

        <button 
          onClick={switchPlayer}
          className="bg-slate-900 text-white py-12 rounded-[40px] font-black text-4xl shadow-xl border-b-[12px] border-slate-700 hover:bg-slate-800 active:translate-y-2 active:border-b-0 transition-all flex items-center justify-center gap-4"
        >
          🔄 SWITCH (Space)
        </button>

        <button 
          onClick={() => { pauseTimer(); resetTimes(settings.time); }}
          className="bg-slate-100 text-slate-500 py-12 rounded-[40px] font-black text-4xl shadow-md border-b-[12px] border-slate-200 hover:bg-slate-200 active:translate-y-2 active:border-b-0 transition-all"
        >
          🧹 RESET
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 text-center">
         <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">
           Pro Tip: Use <span className="bg-white px-2 py-1 rounded border text-slate-900">Spacebar</span> to quickly switch between players during the round
         </p>
      </div>
    </div>
  );
}
