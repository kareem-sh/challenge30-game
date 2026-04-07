import { useEffect, useRef } from "react";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import { getRoundName } from "../app/roundUtils";
import useSound from "use-sound";
import Timer from "../components/Timer";
import useRealtimeGlobalTimer from "../app/useRealtimeGlobalTimer";
import PassMeter from "../components/PassMeter";

export default function Scoreboard() {
  const players = useGameStore((s) => s.players);
  const currentPlayer = useGameStore((s) => s.currentPlayer);
  const question = useGameStore((s) => s.question);
  const roundIndex = useGameStore((s) => s.roundIndex);
  const roundsOrder = useGameStore((s) => s.roundsOrder);
  const round1PassUsed = useGameStore((s) => s.round1PassUsed);
  const showAuction = useGameStore((s) => s.showAuction);
  const auctionValue = useGameStore((s) => s.auctionValue);
  const mistakeTrigger = useGameStore((s) => s.mistakeTrigger);
  const lastMistakePlayer = useGameStore((s) => s.lastMistakePlayer);
  const timeUpTrigger = useGameStore((s) => s.timeUpTrigger);
  const timeRunning = useGameStore((s) => s.timeRunning);
  const round2DeclaredValue = useGameStore((s) => s.round2DeclaredValue);
  const round2CorrectCount = useGameStore((s) => s.round2CorrectCount);
  const settings = useSettingsStore();
  const realtimeGlobalTimer = useRealtimeGlobalTimer();

  const currentRound = roundsOrder[roundIndex];
  const currentRoundName = getRoundName(settings, currentRound);
  const mistakeLimit = currentRound === 1 ? settings.round1.mistakes : 3;
  const round1PassLimit = Math.max(1, Number(settings.round1.passCount) || 1);
  const round1Progress = Math.min(
    100,
    (realtimeGlobalTimer / Math.max(settings.round1.time, 1)) * 100,
  );
  const round4BaseTime = Math.max(settings.round4.time, 1);
  const round4ActivePlayerExpired =
    currentRound === 4 &&
    players[currentPlayer] &&
    players[currentPlayer].time === 0;

  /** Single short segment only — full fail.mp3 has a second hit that felt delayed. */
  const MISTAKE_SPRITE_ID = "mistakeShort";
  const [playFail, { stop: stopFail }] = useSound("/sounds/fail.mp3", {
    volume: 0.75,
    interrupt: true,
    sprite: {
      [MISTAKE_SPRITE_ID]: [0, 520],
    },
  });

  const lastMistakeTrigger = useRef(mistakeTrigger);
  const lastTimeUpTrigger = useRef(timeUpTrigger);

  useEffect(() => {
    return () => {
      stopFail();
    };
  }, [stopFail]);

  useEffect(() => {
    if (mistakeTrigger > lastMistakeTrigger.current) {
      const affectedPlayer = players[lastMistakePlayer ?? currentPlayer];

      if (affectedPlayer) {
        playFail({ id: MISTAKE_SPRITE_ID });
      }

      lastMistakeTrigger.current = mistakeTrigger;
    }
  }, [
    currentPlayer,
    lastMistakePlayer,
    mistakeLimit,
    mistakeTrigger,
    playFail,
    players,
  ]);

  useEffect(() => {
    if (timeUpTrigger > lastTimeUpTrigger.current) {
      if (currentRound === 1) {
        playFail({ id: MISTAKE_SPRITE_ID });
      }
      lastTimeUpTrigger.current = timeUpTrigger;
    }
  }, [currentRound, playFail, timeUpTrigger]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col p-6 md:p-10 relative"
      dir="rtl"
    >
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px] animate-pulse pointer-events-none" />

      <div
        className={`transition-all duration-700 h-36 md:h-44 mb-10 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] flex items-center px-10 md:px-16 relative overflow-hidden ${
          currentRound === 1 || currentRound === 2
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none absolute"
        }`}
      >
        <div className="absolute top-0 right-0 h-1 w-full bg-white/5 overflow-hidden">
          <div
            className={`ml-auto h-full transition-[width] duration-300 ${
              currentRound === 1
                ? "bg-gradient-to-l from-purple-500 to-pink-500"
                : "bg-gradient-to-l from-yellow-500 to-orange-500"
            }`}
            style={{
              width:
                currentRound === 1
                  ? `${timeRunning ? round1Progress : round1Progress}%`
                  : "100%",
            }}
          />
        </div>
        <div className="flex flex-col items-start">
          <span
            className={`font-black text-[10px] md:text-xs mb-2 tracking-[0.2em] uppercase ${
              currentRound === 2 ? "text-yellow-400" : "text-purple-500"
            }`}
          >
            {currentRound === 2 ? "التحدي الحالي" : "السؤال الحالي"}
          </span>
          <span className="text-5xl md:text-8xl font-bold text-white tracking-tight leading-tight">
            {question || "بانتظار التحدي القادم..."}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-start mb-10 md:mb-16 relative z-10">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-4 mb-2">
            <span className="h-[2px] w-12 bg-purple-500 rounded-full" />
            <span className="text-purple-400 uppercase tracking-[0.2em] text-xs md:text-sm font-black italic">
              الجولة الحالية
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none uppercase">
            {currentRoundName}
          </h1>
        </div>

        {currentRound === 1 && (
          <div className="bg-white text-black px-20 py-8 rounded-[30px] shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            <div className="text-[7rem] md:text-[9rem] font-black italic tabular-nums leading-none">
              <Timer />
            </div>
          </div>
        )}

        {currentRound === 3 && (
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-6 md:px-10 py-5 md:py-7 rounded-[24px] md:rounded-[34px] min-w-[260px] md:min-w-[360px]">
            <div className="text-center">
              <div className="text-[10px] md:text-xs font-black tracking-[0.35em] text-rose-300 uppercase">
                اللاعب الحالي
              </div>
              <div className="mt-3 text-3xl md:text-5xl font-black leading-tight text-white">
                {players[currentPlayer]?.name || ""}
              </div>
              <div className="mt-4 text-lg md:text-2xl font-black text-rose-200">
                وضع السرعة
              </div>
            </div>
          </div>
        )}

        {currentRound === 4 && (
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-6 md:px-10 py-5 md:py-7 rounded-[24px] md:rounded-[34px] min-w-[260px] md:min-w-[360px]">
            <div className="text-center">
              <div className="text-[10px] md:text-xs font-black tracking-[0.35em] text-cyan-300 uppercase">
                اللاعب الحالي
              </div>
              <div className="mt-3 text-3xl md:text-5xl font-black leading-tight text-white">
                {players[currentPlayer]?.name || ""}
              </div>
              <div
                className={`mt-4 text-lg md:text-2xl font-black ${
                  round4ActivePlayerExpired ? "text-red-300" : "text-cyan-200"
                }`}
              >
                {round4ActivePlayerExpired ? "انتهى الوقت" : currentRoundName}
              </div>
            </div>
          </div>
        )}

        {currentRound !== 1 && (
          <div
            className={`bg-white/5 backdrop-blur-3xl border border-white/10 px-6 md:px-12 py-3 md:py-6 rounded-[20px] md:rounded-[30px] ${currentRound === 2 || currentRound === 3 || currentRound === 4 ? "hidden" : ""}`}
          >
            <span className="text-xl md:text-4xl font-black tracking-widest text-white italic uppercase">
              الجولة {currentRound}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 md:gap-16 relative z-10">
        {currentRound === 2 && round2DeclaredValue > 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div
              className={`bg-white/5 backdrop-blur-3xl border px-10 md:px-14 py-8 md:py-10 rounded-[24px] md:rounded-[34px] min-w-[350px] md:min-w-[450px] transition-all duration-500 ${
                round2CorrectCount === round2DeclaredValue
                  ? "border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.8)] animate-pulse scale-110"
                  : "border-white/10"
              }`}
            >
              <div className="text-center">
                <div className="text-xl md:text-2xl font-black text-yellow-200 mb-2">
                  {players[currentPlayer]?.name || ""}
                </div>
                <div className="text-sm md:text-base font-black tracking-[0.35em] text-yellow-300 uppercase">
                  الإجابات الصحيحة
                </div>
                <div className="mt-4 text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter text-white tabular-nums">
                  {round2CorrectCount}/{round2DeclaredValue}
                </div>
                <div className="mt-6 text-6xl md:text-8xl font-black italic tabular-nums text-yellow-200">
                  <Timer />
                </div>
              </div>
            </div>
          </div>
        )}

        {players.map((player, index) => (
          <div
            key={index}
            className={`relative rounded-[40px] md:rounded-[60px] p-8 md:p-16 transition-all duration-1000 flex flex-col items-center justify-between border shadow-2xl overflow-hidden ${
              currentPlayer === index
                ? "bg-white/10 border-purple-500/50 scale-[1.02] shadow-[0_0_100px_rgba(168,85,247,0.2)]"
                : "bg-white/[0.02] border-white/5 opacity-50 grayscale-[0.5]"
            }`}
          >
            {currentRound === 4 && (
              <div className="absolute inset-x-0 top-0 h-3 bg-white/5 overflow-hidden">
                <div
                  className={`h-full transition-[width,background] duration-300 ${
                    player.time === 0
                      ? "bg-gradient-to-l from-red-500 to-orange-300"
                      : currentPlayer === index
                        ? "bg-gradient-to-l from-cyan-400 to-blue-500"
                        : "bg-gradient-to-l from-slate-500 to-slate-300"
                  }`}
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, (player.time / round4BaseTime) * 100),
                    )}%`,
                  }}
                />
              </div>
            )}

            <div className="absolute -left-10 -bottom-10 text-[15rem] md:text-[25rem] font-black text-white/[0.03] select-none italic">
              {index + 1}
            </div>

            <div className="relative flex flex-col items-center">
              <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 tracking-tight uppercase">
                {player.name}
              </h2>

              <div className="flex flex-col items-center relative">
                <div className="text-slate-500 text-[10px] md:text-sm font-black tracking-[0.5em] mb-4 opacity-50 uppercase">
                  النقاط
                </div>
                <div className="text-[12rem] md:text-[20rem] leading-[0.8] font-black tabular-nums tracking-tighter">
                  {player.score}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-6 md:gap-10 mt-8 md:mt-12">
              {currentRound === 4 ? (
                <div
                  className={`text-[6rem] md:text-[9rem] leading-none font-black font-mono tracking-tighter ${
                    player.time < 30
                      ? "text-red-500 animate-pulse"
                      : "text-slate-300"
                  }`}
                >
                  {formatTime(player.time)}
                </div>
              ) : currentRound === 2 ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-slate-500 text-[10px] md:text-sm font-black tracking-[0.5em] opacity-50 uppercase">
                    {currentPlayer === index ? "الحالي" : "جاهز"}
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-lg md:text-2xl font-black text-yellow-200">
                    المزاد
                  </div>
                </div>
              ) : currentRound === 3 ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-slate-500 text-[10px] md:text-sm font-black tracking-[0.5em] opacity-50 uppercase">
                    {currentPlayer === index
                      ? "اللاعب الحالي"
                      : "بانتظار النقاط"}
                  </div>
                  <div
                    className={`rounded-full border px-8 py-3 text-lg md:text-2xl font-black ${
                      currentPlayer === index
                        ? "border-rose-300/30 bg-rose-400/10 text-rose-100"
                        : "border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    {currentPlayer === index ? "+1 / +2" : "Speed"}
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center gap-5">
                  <div className="flex gap-4 md:gap-6 flex-row-reverse">
                    {[...Array(mistakeLimit)].map((_, mistakeIndex) => (
                      <div
                        key={mistakeIndex}
                        className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-[4px] md:border-[6px] transition-all duration-700 ${
                          mistakeIndex < player.strikes
                            ? "bg-red-500 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.8)] scale-125"
                            : "bg-slate-900 border-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  {currentRound === 1 && (
                    <div className="w-full max-w-xs flex justify-center">
                      <PassMeter
                        usedCount={Number(round1PassUsed[index] || 0)}
                        totalCount={round1PassLimit}
                        variant="audience"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {currentPlayer === index && (
              <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-3">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-500 rounded-full animate-ping" />
                <span className="text-purple-400 font-black tracking-widest text-[10px] md:text-sm uppercase">
                  الدور الحالي
                </span>
              </div>
            )}
          </div>
        ))}

        {showAuction && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-[popup_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards] w-[80%] max-w-2xl text-center">
            <div className="bg-white p-12 md:p-24 rounded-[40px] md:rounded-[80px] shadow-[0_50px_150px_rgba(0,0,0,1)] border-[10px] border-yellow-500 flex flex-col items-center">
              <span className="text-yellow-600 text-xl md:text-3xl font-black mb-6 uppercase tracking-widest">
                المزايدة المعلنة
              </span>
              <div className="text-[10rem] md:text-[18rem] font-black text-black leading-none tracking-tighter tabular-nums">
                {auctionValue}
              </div>
              <div className="h-4 w-48 bg-slate-900 mt-8 rounded-full" />
            </div>
          </div>
        )}
      </div>

      <div
        className={`transition-all duration-700 mt-10 md:mt-16 h-24 md:h-36 bg-white/[0.03] backdrop-blur-3xl border-t border-white/5 rounded-[20px] md:rounded-[40px] flex items-center px-10 md:px-16 relative overflow-hidden ${
          currentRound === 1
            ? "opacity-0 translate-y-20 absolute"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="absolute top-0 right-0 h-1 w-full bg-white/5 overflow-hidden">
          <div
            className={`h-full ${
              currentRound === 3
                ? "bg-gradient-to-l from-rose-500 to-orange-300"
                : "bg-gradient-to-l from-purple-500 to-pink-500 animate-[progress_15s_linear_infinite]"
            }`}
            style={currentRound === 3 ? { width: "100%" } : undefined}
          />
        </div>
        <div className="flex flex-col items-start">
          <span
            className={`font-black text-[10px] md:text-xs mb-2 tracking-[0.2em] uppercase ${
              currentRound === 3
                ? "text-rose-400"
                : currentRound === 4
                  ? "text-cyan-400"
                  : "text-purple-500"
            }`}
          >
            {currentRound === 3
              ? "وضع السرعة"
              : currentRound === 4
                ? currentRoundName
                : currentRound === 2
                  ? "حالة التحدي"
                  : "التحدي الحالي"}
          </span>
          <span className="text-2xl md:text-5xl font-bold text-white tracking-tight">
            {currentRound === 3
              ? `الدور الآن: ${players[currentPlayer]?.name || ""}`
              : currentRound === 4
                ? round4ActivePlayerExpired
                  ? `انتهى وقت ${players[currentPlayer]?.name || ""}`
                  : `الوقت يعمل الآن لـ ${players[currentPlayer]?.name || ""}`
                : currentRound === 2
                  ? `اللاعب الحالي: ${players[currentPlayer]?.name || ""}`
                  : question || "بانتظار التحدي القادم..."}
          </span>
        </div>
      </div>

      {round4ActivePlayerExpired && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
          <div className="w-[84%] max-w-3xl rounded-[3rem] border border-red-400/30 bg-slate-950/94 p-8 text-center shadow-[0_40px_120px_rgba(0,0,0,0.8)] md:p-12">
            <div className="text-sm font-black tracking-[0.45em] text-red-300">
              تنبيه وقت
            </div>
            <div className="mt-5 text-[clamp(2rem,4vw,4.2rem)] font-black text-white">
              انتهى وقت {players[currentPlayer]?.name || ""}
            </div>
            <div className="mt-4 text-lg font-bold text-slate-300">
              انتقل للاعب الآخر أو أنهِ الجولة من شاشة التحكم.
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
            @keyframes popup { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
          `,
        }}
      />
    </div>
  );
}
