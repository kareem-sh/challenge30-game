import React from "react";
import { useGameStore } from "../app/gameStore";

export default function Round3() {
  const players = useGameStore((s) => s.players);
  const addScore = useGameStore((s) => s.addScore);
  const nextRound = useGameStore((s) => s.nextRound);
  const question = useGameStore((s) => s.question);
  const setQuestion = useGameStore((s) => s.setQuestion);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Operator Console</h2>
          <h1 className="text-4xl font-black text-slate-900">ROUND 3: SPEED ROUND</h1>
        </div>
        <button onClick={nextRound} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-all">
          Go to Final Round →
        </button>
      </div>

      <div className="bg-white border rounded-3xl p-8 shadow-sm">
        <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Active Speed Question</label>
        <input
          className="w-full text-3xl font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 focus:border-pink-500 outline-none transition-all"
          placeholder="Type speed question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {players.map((p, idx) => (
          <div key={idx} className="bg-white border-2 border-slate-100 rounded-[40px] p-10 flex flex-col items-center shadow-lg hover:shadow-2xl transition-all border-b-[12px] border-b-slate-200">
            <h3 className="text-3xl font-black text-slate-900 mb-2">{p.name}</h3>
            <div className="text-7xl font-black text-pink-600 mb-8 tabular-nums">{p.score}</div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <button 
                onClick={() => addScore(idx, 1)}
                className="bg-emerald-500 text-white py-8 rounded-3xl font-black text-3xl hover:bg-emerald-600 shadow-[0_12px_0_rgb(5,150,105)] active:shadow-none active:translate-y-[12px] transition-all"
              >
                +1
              </button>
              <button 
                onClick={() => addScore(idx, 2)}
                className="bg-purple-600 text-white py-8 rounded-3xl font-black text-3xl hover:bg-purple-700 shadow-[0_12px_0_rgb(107,33,168)] active:shadow-none active:translate-y-[12px] transition-all"
              >
                +2
              </button>
              <button 
                onClick={() => addScore(idx, -1)}
                className="col-span-2 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-xl hover:bg-red-50 hover:text-red-500 transition-all"
              >
                CORRECT (-1)
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-pink-50 p-8 rounded-3xl border border-pink-100 flex items-center justify-between">
         <div className="flex items-center gap-4 text-pink-700">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl animate-pulse">⚡</div>
            <div>
               <p className="font-black uppercase tracking-widest text-sm">Speed Mode Active</p>
               <p className="font-medium opacity-80">Points are added instantly to the scoreboard. No timers here.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <span className="bg-white px-4 py-2 rounded-lg text-xs font-bold border border-pink-200 text-pink-600">SHORTCUTS: [1, 2] for Player 1 | [8, 9] for Player 2</span>
         </div>
      </div>
    </div>
  );
}
