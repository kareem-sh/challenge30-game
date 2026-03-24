import React, { useState, useEffect } from "react";
import Timer from "../components/Timer";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";

export default function Round1() {
  const players = useGameStore((s) => s.players);
  const current = useGameStore((s) => s.currentPlayer);
  const addStrike = useGameStore((s) => s.addStrike);
  const switchPlayer = useGameStore((s) => s.switchPlayer);
  const resetStrikes = useGameStore((s) => s.resetStrikes);
  const addScore = useGameStore((s) => s.addScore);
  const nextRound = useGameStore((s) => s.nextRound);
  const prevRound = useGameStore((s) => s.prevRound);
  const question = useGameStore((s) => s.question);
  const setQuestion = useGameStore((s) => s.setQuestion);
  const resetQuestion = useGameStore((s) => s.resetQuestion);
  const settings = useSettingsStore((s) => s.round1);
  
  const timeRunning = useGameStore((s) => s.timeRunning);
  const startTimer = useGameStore((s) => s.startTimer);
  const pauseTimer = useGameStore((s) => s.pauseTimer);
  const triggerMistakeSound = useGameStore((s) => s.triggerMistakeSound);

  const [timerKey, setTimerKey] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  
  const other = current === 0 ? 1 : 0;

  const handleStrike = () => {
    addStrike(current);
    triggerMistakeSound();
    
    const p = useGameStore.getState().players;
    if (p[current].strikes >= settings.mistakes) {
      if (p[other].strikes === 0) {
        addScore(other, settings.perfectPoint);
      } else {
        addScore(other, settings.normalPoint);
      }
      handleSwitch();
    } else {
      handleSwitch();
    }
  };

  const handleSwitch = () => {
    switchPlayer();
    setTimerKey((k) => k + 1);
    startTimer();
  };

  const finishCurrentQuestion = () => {
    resetQuestion();
    setTimerKey((k) => k + 1);
    if (currentQuestionIndex < settings.questionsCount) {
        setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8 md:space-y-12 animate-in fade-in duration-700 text-right" dir="rtl">
      {/* Header with Round Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2 text-center md:text-right">
          <div className="flex items-center gap-3 justify-center md:justify-start">
             <span className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-black text-xs italic text-white">01</span>
             <h2 className="text-slate-500 font-black tracking-widest uppercase text-xs">تحكم الجولة الأولى</h2>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">لعبة الأسماء <span className="text-purple-500 text-xl md:text-3xl font-medium tracking-normal not-italic mr-4 opacity-50 uppercase">السؤال {currentQuestionIndex} من {settings.questionsCount}</span></h1>
        </div>
        
        <div className="flex gap-4">
           <button onClick={prevRound} className="bg-white/5 text-white px-6 py-4 rounded-[24px] font-black text-sm uppercase border border-white/10 hover:bg-white/10 transition-all">
             السابقة ↞
           </button>
           <button onClick={nextRound} className="bg-white text-black px-10 py-4 rounded-[24px] font-black text-sm uppercase hover:bg-purple-100 transition-all shadow-2xl">
             الجولة التالية ↠
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-[#111315] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-inner text-right">
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-6 tracking-[0.5em]">موضوع السؤال الحالي</label>
            <div className="flex flex-col md:flex-row gap-4">
              <textarea
                className="flex-1 text-2xl md:text-4xl font-black bg-[#0a0b0c] border border-white/5 rounded-[30px] p-6 md:p-8 focus:border-purple-500/50 transition-all outline-none min-h-[120px] text-white placeholder-slate-800 text-right"
                placeholder="اكتب الموضوع هنا..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              {!timeRunning && question && (
                <button 
                  onClick={() => { startTimer(); setTimerKey(k => k+1); }}
                  className="bg-purple-600 text-white px-12 py-6 rounded-[30px] font-black text-2xl shadow-xl hover:bg-purple-700 transition-all"
                >
                  بدء السؤال ▶
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {players.map((p, idx) => (
              <div 
                key={idx}
                className={`relative p-8 md:p-10 rounded-[40px] md:rounded-[50px] border-2 transition-all duration-500 ${
                  current === idx 
                    ? "bg-[#1a1c1e] border-purple-500/50 shadow-[0_25px_60px_-15px_rgba(168,85,247,0.3)] scale-[1.02]" 
                    : "bg-[#111315] border-white/5 opacity-40 scale-[0.98]"
                }`}
              >
                <div className="flex justify-between items-start mb-8 flex-row-reverse">
                  <div className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${current === idx ? "bg-purple-500 text-white" : "bg-white/5 text-slate-500"}`}>
                    {current === idx ? "في اللعب" : "انتظار"}
                  </div>
                  <div className="text-3xl md:text-4xl font-black italic text-white">{p.score} <span className="text-xs text-slate-600 not-italic uppercase tracking-widest ml-1">نقطة</span></div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight uppercase italic text-right">{p.name}</h3>
                
                <div className="flex gap-3 md:gap-4 mb-10 flex-row-reverse">
                  {[...Array(settings.mistakes)].map((_, mIdx) => (
                    <div 
                      key={mIdx}
                      className={`h-4 flex-1 rounded-full transition-all duration-700 shadow-sm ${
                        mIdx < p.strikes ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-slate-800/50 border border-white/5"
                      }`}
                    />
                  ))}
                </div>

                {current === idx && timeRunning && (
                   <button 
                     onClick={handleStrike}
                     className="w-full bg-red-600 text-white py-6 md:py-8 rounded-[30px] font-black text-xl md:text-2xl hover:bg-red-700 transition-all shadow-[0_15px_30px_rgba(220,38,38,0.3)] active:translate-y-2 active:shadow-none italic"
                   >
                     إنذار / خطأ! (M)
                   </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 md:space-y-10">
          <div className="bg-white text-black rounded-[40px] md:rounded-[50px] p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] shadow-2xl relative overflow-hidden">
            <span className="relative text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mb-6">عداد الجولة</span>
            <div className="relative text-[8rem] md:text-[10rem] font-black italic tracking-tighter tabular-nums leading-none">
              <Timer key={timerKey} seconds={settings.time} onFinish={handleStrike} />
            </div>
            
            <div className="mt-8 flex gap-4 w-full relative z-10">
               <button 
                 onClick={timeRunning ? pauseTimer : startTimer}
                 className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase transition-all ${
                   timeRunning ? "bg-amber-100 text-amber-700" : "bg-emerald-500 text-white shadow-lg"
                 }`}
               >
                 {timeRunning ? "إيقاف مؤقت" : "استئناف"}
               </button>
               <button 
                 onClick={() => { setTimerKey(k => k+1); }}
                 className="bg-slate-100 px-6 py-4 rounded-2xl font-black text-sm text-slate-400"
               >
                 إعادة
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <button 
              onClick={handleSwitch}
              className="bg-[#1a1c1e] border border-white/10 text-white py-6 rounded-[30px] font-black text-xl hover:bg-[#25282a] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 italic"
            >
              🔄 تبديل الدور (S)
            </button>
            <button 
              onClick={finishCurrentQuestion}
              className="bg-emerald-600 text-white py-6 rounded-[30px] font-black text-xl hover:bg-emerald-700 transition-all shadow-[0_15px_30px_rgba(5,150,105,0.3)] active:translate-y-2 italic"
            >
              ✅ إنهاء السؤال وتصفير الإنذارات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
