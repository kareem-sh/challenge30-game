import { useEffect, useState } from "react";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import { getRoundName } from "../app/roundUtils";
import {
  eventMatchesShortcut,
  formatShortcutLabel,
  shouldIgnoreShortcutEvent,
} from "../app/shortcutUtils";
import OperatorHelpPanel from "../components/OperatorHelpPanel";

export default function Round4() {
  const players = useGameStore((s) => s.players);
  const current = useGameStore((s) => s.currentPlayer);
  const switchPlayer = useGameStore((s) => s.switchPlayer);
  const resetScores = useGameStore((s) => s.resetScores);
  const startTimer = useGameStore((s) => s.startTimer);
  const pauseTimer = useGameStore((s) => s.pauseTimer);
  const tick = useGameStore((s) => s.tick);
  const resetTimes = useGameStore((s) => s.resetTimes);
  const setPlayerTime = useGameStore((s) => s.setPlayerTime);
  const addScore = useGameStore((s) => s.addScore);
  const nextRound = useGameStore((s) => s.nextRound);
  const prevRound = useGameStore((s) => s.prevRound);
  const running = useGameStore((s) => s.timeRunning);
  const settings = useSettingsStore((s) => s.round4);
  const allSettings = useSettingsStore();
  const shortcuts = settings.shortcuts;
  const defaultPoint = settings.defaultPoint ?? 2;
  const scoresAlreadyReset = players.every(
    (player) => Number(player.score || 0) === 0,
  );

  const [timeInputs, setTimeInputs] = useState([
    players[0]?.time || 0,
    players[1]?.time || 0,
  ]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [tick]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (shouldIgnoreShortcutEvent(event)) return;

      if (eventMatchesShortcut(event, shortcuts.switchPlayer)) {
        event.preventDefault();
        switchPlayer();
        return;
      }

      if (eventMatchesShortcut(event, shortcuts.pauseTimer)) {
        event.preventDefault();
        pauseTimer();
        return;
      }

      if (eventMatchesShortcut(event, shortcuts.startTimer)) {
        event.preventDefault();
        startTimer();
        return;
      }

      if (eventMatchesShortcut(event, shortcuts.resetTimer)) {
        event.preventDefault();
        pauseTimer();
        resetTimes(settings.time);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    pauseTimer,
    resetTimes,
    settings.time,
    startTimer,
    switchPlayer,
    shortcuts.switchPlayer,
    shortcuts.pauseTimer,
    shortcuts.startTimer,
    shortcuts.resetTimer,
  ]);

  const format = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const activePlayer = players[current];
  const activePlayerExpired = activePlayer?.time === 0;
  const roundTitle = getRoundName(allSettings, 4);

  return (
    <div
      className="relative mx-auto min-h-[calc(100svh-7rem)] w-full max-w-[1800px] overflow-hidden px-4 py-6 md:px-8 md:py-8 xl:px-10"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-14%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/12 blur-[130px]" />
        <div className="absolute bottom-[-18%] right-[-8%] h-[34rem] w-[34rem] rounded-full bg-red-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.09),_transparent_32%),linear-gradient(135deg,rgba(2,6,23,0.96),rgba(15,23,42,0.92))]" />
      </div>

      <div className="relative z-10 space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4 text-right">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.35em] text-cyan-200">
                  الجولة 4
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
                  {roundTitle}
                </span>
              </div>
              <div>
                <h1 className="text-[clamp(2.2rem,4vw,4.8rem)] font-black tracking-tight text-white">
                  {roundTitle}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  نفس الواجهة الأساسية، لكن مع توضيح أقوى للاعب الحالي، تقدّم
                  الوقت، وتنبيهات انتهاء أوضح حتى تكون إدارة الجولة أسرع وأقل
                  عرضة للخطأ.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-right sm:grid-cols-2 xl:grid-cols-4 xl:min-w-[620px]">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  اللاعب الحالي
                </div>
                <div className="mt-3 text-2xl font-black text-white">
                  {activePlayer?.name}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  الوقت الأساسي
                </div>
                <div className="mt-3 text-2xl font-black text-white">
                  {format(settings.time)}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  النقطة الافتراضية
                </div>
                <div className="mt-3 text-2xl font-black text-white">
                  +{defaultPoint}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  حالة المؤقت
                </div>
                <div
                  className={`mt-3 text-2xl font-black ${
                    activePlayerExpired
                      ? "text-red-400"
                      : running
                        ? "text-emerald-300"
                        : "text-amber-300"
                  }`}
                >
                  {activePlayerExpired
                    ? "انتهى الوقت"
                    : running
                      ? "يعمل الآن"
                      : "متوقف"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {players.map((player, index) => {
            const isActive = current === index;
            const isExpired = player.time === 0;
            const progress = Math.max(
              0,
              Math.min(100, (player.time / Math.max(settings.time, 1)) * 100),
            );

            return (
              <section
                key={index}
                className={`relative overflow-hidden rounded-[3rem] border-4 p-8 transition-all md:p-10 ${
                  isActive
                    ? "border-cyan-400/60 bg-slate-900 shadow-[0_30px_60px_-15px_rgba(34,211,238,0.3)]"
                    : "border-white/10 bg-white/5 opacity-90"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-3 bg-white/5">
                  <div
                    className={`h-full transition-[width,background] duration-300 ${
                      isExpired
                        ? "bg-gradient-to-l from-red-500 to-orange-300"
                        : isActive
                          ? "bg-gradient-to-l from-cyan-400 to-blue-500"
                          : "bg-gradient-to-l from-slate-500 to-slate-300"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {isActive && running && (
                  <div className="absolute top-0 left-0 h-2 w-full bg-cyan-400 animate-[pulse_2s_infinite]" />
                )}

                {isActive && (
                  <div className="absolute -top-6 right-8 rounded-full bg-cyan-400 px-8 py-2 text-xs font-black uppercase tracking-widest text-slate-950">
                    اللاعب الحالي
                  </div>
                )}

                <div className="text-right">
                  <div
                    className={`text-xl font-black uppercase tracking-[0.3em] ${
                      isActive ? "text-cyan-300" : "text-slate-400"
                    }`}
                  >
                    {player.name}
                  </div>
                  <div className="mt-4 text-sm font-bold text-slate-500">
                    {isExpired
                      ? "انتهى الوقت لهذا اللاعب"
                      : `النقاط: ${player.score}`}
                  </div>
                </div>

                <div
                  className={`mt-10 text-center text-[clamp(5rem,12vw,10rem)] font-black leading-none tabular-nums ${
                    isActive
                      ? isExpired
                        ? "text-red-500 animate-pulse"
                        : player.time < 30
                          ? "text-amber-300 animate-pulse"
                          : "text-white"
                      : isExpired
                        ? "text-red-400"
                        : "text-slate-300"
                  }`}
                >
                  {format(player.time)}
                </div>

                <div className="mt-6 flex flex-col items-center gap-3 rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                  <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-400">
                    تحديث الوقت
                  </div>
                  <div className="flex w-full flex-col gap-3">
                    <div>
                      <div className="mb-2 text-xs font-bold text-slate-400">
                        الوقت الحالي
                      </div>
                      <div className="w-full rounded-lg border border-white/20 bg-slate-900/50 px-3 py-2 text-center font-black text-cyan-300">
                        {player.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={timeInputs[index]}
                        onChange={(e) => {
                          const newInputs = [...timeInputs];
                          newInputs[index] = e.target.value;
                          setTimeInputs(newInputs);
                        }}
                        className="flex-1 rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-center font-black text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                        placeholder="أدخل الوقت الجديد"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const timeValue = Number(timeInputs[index]) || 0;
                          setPlayerTime(index, timeValue);
                        }}
                        className="rounded-lg border border-cyan-400/30 bg-cyan-500/20 px-4 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-500/30"
                      >
                        تحديث
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm font-black text-slate-300">
                    {Math.round(progress)}%
                  </div>
                  <div
                    className={`rounded-full px-5 py-3 text-sm font-black ${
                      isExpired
                        ? "bg-red-500/15 text-red-200"
                        : isActive
                          ? "bg-cyan-400/15 text-cyan-100"
                          : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {isExpired
                      ? "توقف تلقائياً"
                      : isActive
                        ? "الوقت ينقص الآن"
                        : "بانتظار الدور"}
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => addScore(index, defaultPoint)}
                    className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    +{defaultPoint} نقطة
                  </button>
                  <button
                    type="button"
                    onClick={() => addScore(index, -1)}
                    className="rounded-[2rem] border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-red-100 transition hover:bg-red-500/20"
                  >
                    -1 نقطة
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <button
            onClick={running ? pauseTimer : startTimer}
            className={`rounded-[2.2rem] px-6 py-10 text-center font-black text-white shadow-xl transition-all active:scale-[0.98] ${
              running
                ? "border-b-[12px] border-amber-300 bg-amber-100 text-amber-700"
                : "border-b-[12px] border-emerald-700 bg-emerald-500"
            }`}
          >
            <div className="text-[clamp(2rem,4vw,3.6rem)] leading-none">
              {running ? "إيقاف مؤقت" : "تشغيل"}
            </div>
            <div className="mt-3 text-sm font-bold opacity-80">
              {running
                ? `تجميد الوقت الحالي - ${formatShortcutLabel(shortcuts.pauseTimer)}`
                : `بدء العداد للاعب الحالي - ${formatShortcutLabel(shortcuts.startTimer)}`}
            </div>
          </button>

          <button
            onClick={switchPlayer}
            className="rounded-[2.2rem] border-b-[12px] border-slate-700 bg-slate-900 px-6 py-10 text-center font-black text-white shadow-xl transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            <div className="text-[clamp(2rem,4vw,3.6rem)] leading-none">
              تبديل اللاعب
            </div>
            <div className="mt-3 text-sm font-bold text-slate-300">
              {formatShortcutLabel(shortcuts.switchPlayer)}
            </div>
          </button>

          <button
            onClick={() => {
              pauseTimer();
              resetTimes(settings.time);
            }}
            className="rounded-[2.2rem] border-b-[12px] border-slate-200 bg-slate-100 px-6 py-10 text-center font-black text-slate-600 shadow-md transition-all hover:bg-slate-200 active:scale-[0.98]"
          >
            <div className="text-[clamp(2rem,4vw,3.6rem)] leading-none">
              إعادة الضبط
            </div>
            <div className="mt-3 text-sm font-bold text-slate-500">
              إعادة إلى {format(settings.time)} -{" "}
              {formatShortcutLabel(shortcuts.resetTimer)}
            </div>
          </button>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
          <div className="mb-5 text-right">
            <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
              تحكم النقاط
            </div>
            <div className="mt-2 text-sm text-slate-500">
              التصفير هنا لا يغيّر أزمنة اللاعبين، فقط يعيد النتيجة إلى الصفر.
            </div>
          </div>

          <button
            onClick={resetScores}
            disabled={scoresAlreadyReset}
            className="w-full rounded-[1.6rem] border border-rose-300/20 bg-rose-500/12 px-6 py-5 text-right text-lg font-black text-rose-100 transition hover:bg-rose-500/18 disabled:cursor-not-allowed disabled:opacity-40"
          >
            تصفير النقاط
            <div className="mt-2 text-sm font-semibold text-rose-100/80">
              يعيد نقاط اللاعبين إلى صفر
            </div>
          </button>
        </section>

        <OperatorHelpPanel
          accent="cyan"
          shortcuts={[
            {
              keys: formatShortcutLabel(shortcuts.switchPlayer),
              label: "تبديل اللاعب مباشرة",
            },
            {
              keys: formatShortcutLabel(shortcuts.startTimer),
              label: "تشغيل المؤقت",
            },
            {
              keys: formatShortcutLabel(shortcuts.pauseTimer),
              label: "إيقاف مؤقت",
            },
            {
              keys: formatShortcutLabel(shortcuts.resetTimer),
              label: "إعادة ضبط الوقت",
            },
          ]}
          tips={[
            "الوقت ينقص فقط للاعب الحالي، لذلك بدّل اللاعب فور انتهاء دوره.",
            "إذا انتهى الوقت سيظهر تنبيه واضح على الشاشتين قبل متابعة الجولة.",
            "إعادة الضبط تعيد وقت الإعدادات لكلا اللاعبين وتحافظ على النقاط.",
          ]}
          onPrev={prevRound}
          onNext={nextRound}
          nextLabel="إنهاء اللعبة"
        />

        {activePlayerExpired && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
            <div className="w-[92%] max-w-2xl rounded-[2.5rem] border border-red-400/30 bg-slate-950/92 p-8 text-center shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
              <div className="text-sm font-black tracking-[0.45em] text-red-300">
                تنبيه وقت
              </div>
              <div className="mt-5 text-[clamp(2rem,5vw,4rem)] font-black text-white">
                انتهى وقت {activePlayer?.name}
              </div>
              <div className="mt-4 text-lg font-bold text-slate-300">
                أوقف الجولة أو أعد ضبط الوقت قبل المتابعة.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
