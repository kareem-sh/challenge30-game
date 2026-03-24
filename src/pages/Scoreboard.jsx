import React, { useEffect, useState, useRef } from "react";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import useSound from "use-sound";
import Timer from "../components/Timer";

export default function Scoreboard() {
  const players = useGameStore((s) => s.players);
  const currentPlayer = useGameStore((s) => s.currentPlayer);
  const question = useGameStore((s) => s.question);
  const roundIndex = useGameStore((s) => s.roundIndex);
  const roundsOrder = useGameStore((s) => s.roundsOrder);
  const showAuction = useGameStore((s) => s.showAuction);
  const auctionValue = useGameStore((s) => s.auctionValue);
  const mistakeTrigger = useGameStore((s) => s.mistakeTrigger);
  const timeRunning = useGameStore((s) => s.timeRunning);
  const settings = useSettingsStore();

  const currentRound = roundsOrder[roundIndex];

  const [playMistake] = useSound("https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3");
  const [playFail] = useSound("https://assets.mixkit.co/active_storage/sfx/1003/1003-preview.mp3");

  const lastMistakeTrigger = useRef(mistakeTrigger);

  useEffect(() => {
    const syncState = (e) => {
      if (e.key === "challenge30-game") {
        useGameStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", syncState);
    return () => window.removeEventListener("storage", syncState);
  }, []);

  useEffect(() => {
    if (mistakeTrigger > lastMistakeTrigger.current) {
      const p = players[currentPlayer];
      if (p.strikes >= 3) {
        playFail();
      } else {
        playMistake();
      }
      lastMistakeTrigger.current = mistakeTrigger;
    }
  }, [mistakeTrigger, players, currentPlayer, playMistake, playFail]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col p-6 md:p-10 relative" dir="rtl">
      {/* Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />

      {/* Top Question Bar (R1 Specific Placement) */}
      <div className={`transition-all duration-700 h-24 md:h-32 mb-10 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] flex items-center px-10 md:px-16 relative overflow-hidden ${currentRound === 1 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute"}`}>
         <div className="absolute top-0 right-0 h-1 w-full bg-white/5 overflow-hidden">
            <div className={`h-full bg-gradient-to-l from-purple-500 to-pink-500 ${timeRunning ? "animate-[progress_15s_linear_infinite]" : ""}`} />
         </div>
         <div className="flex flex-col items-start">
            <span className="text-purple-500 font-black text-[10px] md:text-xs mb-2 tracking-[0.2em] uppercase">التحدي الحالي</span>
            <span className="text-2xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {question || "بانتظار التحدي القادم..."}
            </span>
         </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-10 md:mb-16 relative z-10">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-4 mb-2">
            <span className="h-[2px] w-12 bg-purple-500 rounded-full"></span>
            <span className="text-purple-400 uppercase tracking-[0.2em] text-xs md:text-sm font-black italic">الجولة الحالية</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none uppercase">
            {currentRound === 1 && "لعبة الأسماء"}
            {currentRound === 2 && "المزاد"}
            {currentRound === 3 && "جولة السرعة"}
            {currentRound === 4 && "ساعة الشطرنج"}
          </h1>
        </div>
        
        {/* Round 1 Timer on Scoreboard */}
        {currentRound === 1 && (
            <div className="bg-white text-black px-12 py-4 rounded-[30px] shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                <div className="text-[4rem] md:text-[6rem] font-black italic tabular-nums leading-none">
                    <Timer seconds={settings.round1.time} onFinish={() => {}} />
                </div>
            </div>
        )}

        {currentRound !== 1 && (
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-6 md:px-12 py-3 md:py-6 rounded-[20px] md:rounded-[30px]">
              <span className="text-xl md:text-4xl font-black tracking-widest text-white italic uppercase">الجولة {currentRound}</span>
            </div>
        )}
      </div>

      {/* Players */}
      <div className="flex-1 grid grid-cols-2 gap-6 md:gap-16 relative z-10">
        {players.map((p, idx) => (
          <div 
            key={idx}
            className={`relative rounded-[40px] md:rounded-[60px] p-8 md:p-16 transition-all duration-1000 flex flex-col items-center justify-between border shadow-2xl overflow-hidden ${
              currentPlayer === idx 
                ? "bg-white/10 border-purple-500/50 scale-[1.02] shadow-[0_0_100px_rgba(168,85,247,0.2)]" 
                : "bg-white/[0.02] border-white/5 opacity-50 grayscale-[0.5]"
            }`}
          >
            <div className="absolute -left-10 -bottom-10 text-[15rem] md:text-[25rem] font-black text-white/[0.03] select-none italic">
              {idx + 1}
            </div>

            <div className="relative flex flex-col items-center">
              <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 tracking-tight uppercase">
                {p.name}
              </h2>

              <div className="flex flex-col items-center relative">
                 <div className="text-slate-500 text-[10px] md:text-sm font-black tracking-[0.5em] mb-4 opacity-50 uppercase">النقاط</div>
                 <div className="text-[12rem] md:text-[20rem] leading-[0.8] font-black tabular-nums tracking-tighter">
                   {p.score}
                 </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-6 md:gap-10 mt-8 md:mt-12">
              {currentRound === 4 ? (
                <div className={`text-[6rem] md:text-[9rem] leading-none font-black font-mono tracking-tighter ${p.time < 30 ? "text-red-500 animate-pulse" : "text-slate-300"}`}>
                  {formatTime(p.time)}
                </div>
              ) : (
                <div className="flex gap-4 md:gap-6 flex-row-reverse">
                  {[...Array(3)].map((_, mIdx) => (
                    <div 
                      key={mIdx}
                      className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-[4px] md:border-[6px] transition-all duration-700 ${
                        mIdx < p.strikes 
                          ? "bg-red-500 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.8)] scale-125" 
                          : "bg-slate-900 border-white/10"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {currentPlayer === idx && (
              <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-3">
                 <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-500 rounded-full animate-ping" />
                 <span className="text-purple-400 font-black tracking-widest text-[10px] md:text-sm uppercase">الدور الحالي</span>
              </div>
            )}
          </div>
        ))}

        {showAuction && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-[popup_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards] w-[80%] max-w-2xl text-center">
            <div className="bg-white p-12 md:p-24 rounded-[40px] md:rounded-[80px] shadow-[0_50px_150px_rgba(0,0,0,1)] border-[10px] border-yellow-500 flex flex-col items-center">
               <span className="text-yellow-600 text-xl md:text-3xl font-black mb-6 uppercase tracking-widest">المزايدة المعلنة</span>
               <div className="text-[10rem] md:text-[18rem] font-black text-black leading-none tracking-tighter tabular-nums">{auctionValue}</div>
               <div className="h-4 w-48 bg-slate-900 mt-8 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Footer (Question bar hidden in R1 because it's at top) */}
      <div className={`transition-all duration-700 mt-10 md:mt-16 h-24 md:h-36 bg-white/[0.03] backdrop-blur-3xl border-t border-white/5 rounded-[20px] md:rounded-[40px] flex items-center px-10 md:px-16 relative overflow-hidden ${currentRound === 1 ? "opacity-0 translate-y-20 absolute" : "opacity-100 translate-y-0"}`}>
         <div className="absolute top-0 right-0 h-1 w-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-to-l from-purple-500 to-pink-500 animate-[progress_15s_linear_infinite]" />
         </div>
         <div className="flex flex-col items-start">
            <span className="text-purple-500 font-black text-[10px] md:text-xs mb-2 tracking-[0.2em] uppercase">التحدي الحالي</span>
            <span className="text-2xl md:text-5xl font-bold text-white tracking-tight">
              {question || "بانتظار التحدي القادم..."}
            </span>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        @keyframes popup { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
      `}} />
    </div>
  );
}
