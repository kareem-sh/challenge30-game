import React, { useState } from "react";
import Timer from "../components/Timer";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";

export default function Round2() {
  const players = useGameStore((s) => s.players);
  const current = useGameStore((s) => s.currentPlayer);
  const setCurrentPlayer = useGameStore((s) => s.setCurrentPlayer);
  const addScore = useGameStore((s) => s.addScore);
  const nextRound = useGameStore((s) => s.nextRound);
  const prevRound = useGameStore((s) => s.prevRound);
  const question = useGameStore((s) => s.question);
  const setQuestion = useGameStore((s) => s.setQuestion);
  const settings = useSettingsStore((s) => s.round2);
  const setAuction = useGameStore((s) => s.setAuction);
  const hideAuction = useGameStore((s) => s.hideAuction);
  const timeRunning = useGameStore((s) => s.timeRunning);
  const startTimer = useGameStore((s) => s.startTimer);
  const pauseTimer = useGameStore((s) => s.pauseTimer);
  const triggerMistakeSound = useGameStore((s) => s.triggerMistakeSound);

  const [biddingPhase, setBiddingPhase] = useState(true);
  const [declared, setDeclared] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  
  const other = current === 0 ? 1 : 0;

  const startChallenge = (playerIdx) => {
    setCurrentPlayer(playerIdx);
    setBiddingPhase(false);
    setAuction(declared);
    setTimerKey(k => k + 1);
    setTimeout(() => hideAuction(), 5000);
  };

  const finish = () => {
    pauseTimer();
    if (correct >= declared && declared > 0) {
      const pts = Math.floor(declared / settings.namesForPoint);
      addScore(current, pts);
    } else {
      const pts = correct < declared / 2 ? settings.bonusPoint : settings.normalPoint;
      addScore(other, pts);
      triggerMistakeSound();
    }
    setDeclared(0);
    setCorrect(0);
    setBiddingPhase(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8 md:space-y-12 animate-in fade-in duration-700 text-right" dir="rtl">
      {/* Header with Round Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2 text-center md:text-right">
          <div className="flex items-center gap-3 justify-center md:justify-start">
             <span className="w-8 h-8 rounded-lg bg-yellow-600 flex items-center justify-center font-black text-xs italic text-white">02</span>
             <h2 className="text-slate-500 font-black tracking-widest uppercase text-xs">تحكم جولة المزاد</h2>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">المزاد العلني <span className="text-yellow-500 text-2xl md:text-3xl font-medium tracking-normal not-italic mr-4 opacity-50 uppercase tracking-widest">المشغل</span></h1>
        </div>
        
        <div className="flex gap-4">
           <button onClick={prevRound} className="bg-white/5 text-white px-6 py-4 rounded-[24px] font-black text-sm uppercase border border-white/10 hover:bg-white/10 transition-all">
             السابقة ↞
           </button>
           <button onClick={nextRound} className="bg-white text-black px-10 py-4 rounded-[24px] font-black text-sm uppercase hover:bg-yellow-100 transition-all shadow-2xl">
             الجولة التالية ↠
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 text-right">
        <div className="lg:col-span-2 space-y-8 md:space-y-10">
          <div className="bg-[#111315] border border-white/5 rounded-[30px] md:rounded-[40px] p-8 md:p-12">
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.5em]">موضوع المزايدة</label>
            <input
              className="w-full text-2xl md:text-4xl font-black bg-[#0a0b0c] border border-white/5 rounded-[20px] md:rounded-[30px] p-6 md:p-8 focus:border-yellow-500/50 transition-all outline-none text-white text-right"
              placeholder="مثال: عواصم الدول، لاعبي كرة قدم..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {biddingPhase ? (
            <div className="bg-[#111315] border border-white/5 rounded-[40px] p-12 text-center space-y-12 animate-in zoom-in-95 duration-500">
               <h3 className="text-3xl font-black text-white italic">مرحلة المزايدة</h3>
               <div className="flex items-center justify-center gap-8">
                  <button onClick={() => setDeclared(d => Math.max(0, d - 1))} className="w-20 h-20 rounded-full bg-white/5 text-4xl font-black border border-white/10 hover:bg-white/10 transition-all">-</button>
                  <div className="text-[12rem] font-black italic tracking-tighter text-yellow-500 leading-none tabular-nums drop-shadow-2xl">{declared}</div>
                  <button onClick={() => setDeclared(d => d + 1)} className="w-20 h-20 rounded-full bg-white/5 text-4xl font-black border border-white/10 hover:bg-white/10 transition-all">+</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {players.map((p, idx) => (
                    <button key={idx} onClick={() => startChallenge(idx)} className="group relative bg-[#1a1c1e] p-10 rounded-[40px] border border-white/10 hover:border-yellow-500/50 transition-all hover:scale-105 active:scale-95">
                      <span className="block text-slate-500 font-black text-[10px] uppercase mb-4 tracking-widest italic group-hover:text-yellow-500">اضغط لتعيين التحدي لـ</span>
                      <span className="text-4xl font-black text-white italic uppercase tracking-tighter">{p.name}</span>
                    </button>
                  ))}
               </div>
            </div>
          ) : (
            <div className="bg-[#111315] border border-white/5 rounded-[40px] p-12 space-y-12 animate-in slide-in-from-left-10 duration-500">
               <div className="flex justify-between items-center border-b border-white/5 pb-8 flex-row-reverse">
                  <h3 className="text-3xl font-black text-white italic">تحدي {players[current].name}</h3>
                  <div className="bg-yellow-500 text-black px-8 py-2 rounded-full font-black text-xl italic">المطلوب: {declared}</div>
               </div>
               <div className="flex flex-col items-center gap-8">
                  <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.5em]">العدد الصحيح المحقق</span>
                  <div className="flex items-center gap-10">
                    <button onClick={() => setCorrect(d => Math.max(0, d - 1))} className="w-24 h-24 rounded-full bg-white/5 text-5xl font-black border border-white/10 hover:bg-white/10 transition-all">-</button>
                    <div className="text-[15rem] font-black italic tracking-tighter text-white leading-none tabular-nums drop-shadow-2xl">{correct}</div>
                    <button onClick={() => setCorrect(d => d + 1)} className="w-24 h-24 rounded-full bg-white/5 text-5xl font-black border border-white/10 hover:bg-white/10 transition-all">+</button>
                  </div>
               </div>
               <button onClick={finish} className="w-full bg-emerald-600 text-white py-10 rounded-[40px] font-black text-4xl hover:bg-emerald-700 transition-all shadow-[0_20px_40px_rgba(5,150,105,0.3)] active:translate-y-2 active:shadow-none italic tracking-tighter uppercase">تثبيت النتيجة (نهاية التحدي)</button>
               <button onClick={() => setBiddingPhase(true)} className="w-full text-slate-600 font-black text-sm uppercase tracking-widest hover:text-slate-400">العودة للمزايدة (تعديل)</button>
            </div>
          )}
        </div>

        <div className="space-y-10">
          <div className="bg-white text-black rounded-[40px] md:rounded-[50px] p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] md:min-h-[360px] shadow-2xl relative overflow-hidden">
            <span className="relative text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mb-6">عداد التحدي المباشر</span>
            <div className="relative text-[8rem] md:text-[10rem] font-black italic tracking-tighter tabular-nums leading-none">
              <Timer key={timerKey} seconds={settings.time} onFinish={() => {}} />
            </div>
            <div className="mt-8 flex gap-4 w-full relative z-10">
               <button onClick={timeRunning ? pauseTimer : startTimer} className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase transition-all ${timeRunning ? "bg-amber-100 text-amber-700 border border-amber-200 shadow-inner" : "bg-emerald-500 text-white shadow-lg"}`}>{timeRunning ? "إيقاف مؤقت" : "ابدأ الوقت"}</button>
               <button onClick={() => { setTimerKey(k => k+1); pauseTimer(); }} className="bg-slate-100 px-6 py-4 rounded-2xl font-black text-sm text-slate-400 border border-slate-200">إعادة</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
