import { useEffect } from "react";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import { getRoundName } from "../app/roundUtils";
import {
  eventMatchesShortcut,
  formatShortcutLabel,
  shouldIgnoreShortcutEvent,
} from "../app/shortcutUtils";
import OperatorHelpPanel from "../components/OperatorHelpPanel";

export default function Round3() {
  const players = useGameStore((s) => s.players);
  const current = useGameStore((s) => s.currentPlayer);
  const setCurrentPlayer = useGameStore((s) => s.setCurrentPlayer);
  const addScore = useGameStore((s) => s.addScore);
  const nextRound = useGameStore((s) => s.nextRound);
  const prevRound = useGameStore((s) => s.prevRound);
  const settings = useSettingsStore((s) => s.round3);
  const allSettings = useSettingsStore();
  const roundTitle = getRoundName(allSettings, 3);
  const shortcuts = settings.shortcuts;
  const globalShortcuts = allSettings.globalShortcuts;

  const awardPoints = (playerIndex, points) => {
    setCurrentPlayer(playerIndex);
    addScore(playerIndex, points);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (shouldIgnoreShortcutEvent(event)) return;

      if (eventMatchesShortcut(event, shortcuts.playerOneSingle)) {
        event.preventDefault();
        setCurrentPlayer(0);
        addScore(0, settings.singlePoint);
        return;
      }
      if (eventMatchesShortcut(event, shortcuts.playerOneDouble)) {
        event.preventDefault();
        setCurrentPlayer(0);
        addScore(0, settings.doublePoint);
        return;
      }
      if (eventMatchesShortcut(event, shortcuts.playerTwoSingle)) {
        event.preventDefault();
        setCurrentPlayer(1);
        addScore(1, settings.singlePoint);
        return;
      }
      if (eventMatchesShortcut(event, shortcuts.playerTwoDouble)) {
        event.preventDefault();
        setCurrentPlayer(1);
        addScore(1, settings.doublePoint);
        return;
      }
      if (eventMatchesShortcut(event, globalShortcuts.playerOne)) {
        event.preventDefault();
        setCurrentPlayer(0);
        return;
      }
      if (eventMatchesShortcut(event, globalShortcuts.playerTwo)) {
        event.preventDefault();
        setCurrentPlayer(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    addScore,
    setCurrentPlayer,
    settings.doublePoint,
    settings.singlePoint,
    shortcuts.playerOneSingle,
    shortcuts.playerOneDouble,
    shortcuts.playerTwoSingle,
    shortcuts.playerTwoDouble,
    globalShortcuts.playerOne,
    globalShortcuts.playerTwo,
  ]);

  return (
    <div
      className="relative mx-auto min-h-[calc(100svh-7rem)] w-full max-w-[1800px] overflow-hidden px-4 py-6 md:px-8 md:py-8 xl:px-10"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-14%] h-[30rem] w-[30rem] rounded-full bg-rose-400/14 blur-[130px]" />
        <div className="absolute bottom-[-18%] right-[-10%] h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.08),_transparent_34%),linear-gradient(135deg,rgba(2,6,23,0.97),rgba(17,24,39,0.92))]" />
      </div>

      <div className="relative z-10 space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4 text-right">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className="rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.35em] text-rose-200">
                  الجولة 3
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
                  بدون أسئلة - نقاط مباشرة
                </span>
              </div>
              <div>
                <h1 className="text-[clamp(2.2rem,4vw,4.8rem)] font-black tracking-tight text-white">
                  {roundTitle}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  اضغط على زر اللاعب مباشرة لإضافة النقاط أو تصحيحها.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-right sm:grid-cols-2 xl:min-w-[520px]">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  اللاعب الحالي
                </div>
                <div className="mt-3 text-2xl font-black text-white">
                  {players[current]?.name}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  الأزرار الأساسية
                </div>
                <div className="mt-3 text-lg font-black text-white">
                  +{settings.singlePoint} أو +{settings.doublePoint}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
          <div className="mb-5 text-right">
            <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
              تحديد اللاعب الحالي
            </div>
            <div className="mt-2 text-sm text-slate-500">
              يمكنك تغييره من هنا إذا احتجت.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {players.map((player, index) => (
              <button
                key={`active-${index}`}
                onClick={() => setCurrentPlayer(index)}
                className={`rounded-[1.8rem] border px-6 py-6 text-right transition ${
                  current === index
                    ? "border-rose-300/35 bg-rose-400/10 shadow-[0_20px_45px_rgba(244,63,94,0.18)]"
                    : "border-white/10 bg-white/5 hover:bg-white/[0.08]"
                }`}
              >
                <div className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                  {current === index ? "نشط الآن" : "تفعيل اللاعب"}
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  {player.name}
                </div>
              </button>
            ))}
          </div>

        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {players.map((player, index) => {
            const isActive = current === index;

            return (
              <article
                key={index}
                className={`rounded-[2.2rem] border p-6 shadow-[0_28px_80px_rgba(15,23,42,0.36)] backdrop-blur-xl md:p-8 ${
                  isActive
                    ? "border-rose-300/30 bg-rose-400/10"
                    : "border-white/10 bg-slate-950/75"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-right">
                    <div className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                      {isActive ? "اللاعب الحالي" : "جاهز للنقاط"}
                    </div>
                    <h2 className="mt-4 text-[clamp(2.4rem,4vw,4.6rem)] font-black tracking-tight text-white">
                      {player.name}
                    </h2>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-black/20 px-5 py-4 text-center">
                    <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                      النقاط
                    </div>
                    <div className="mt-3 text-[clamp(3.6rem,7vw,6rem)] font-black leading-none text-white tabular-nums">
                      {player.score}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <button
                    onClick={() => awardPoints(index, -1)}
                    className="rounded-[1.9rem] bg-rose-600 px-6 py-10 text-center text-[clamp(2rem,4vw,3.4rem)] font-black text-white shadow-[0_22px_50px_rgba(244,63,94,0.28)] transition hover:bg-rose-500 active:scale-[0.98]"
                  >
                    -1
                    <div className="mt-3 text-sm font-bold text-white/80">
                      خصم نقطة
                    </div>
                  </button>

                  <button
                    onClick={() => awardPoints(index, settings.singlePoint)}
                    className="rounded-[1.9rem] bg-emerald-500 px-6 py-10 text-center text-[clamp(2rem,4vw,3.4rem)] font-black text-white shadow-[0_22px_50px_rgba(16,185,129,0.28)] transition hover:bg-emerald-400 active:scale-[0.98]"
                  >
                    +{settings.singlePoint}
                    <div className="mt-3 text-sm font-bold text-white/80">
                      إضافة بسيطة
                    </div>
                  </button>

                  <button
                    onClick={() => awardPoints(index, settings.doublePoint)}
                    className="rounded-[1.9rem] bg-fuchsia-600 px-6 py-10 text-center text-[clamp(2rem,4vw,3.4rem)] font-black text-white shadow-[0_22px_50px_rgba(192,38,211,0.28)] transition hover:bg-fuchsia-500 active:scale-[0.98]"
                  >
                    +{settings.doublePoint}
                    <div className="mt-3 text-sm font-bold text-white/80">
                      إضافة كبيرة
                    </div>
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <OperatorHelpPanel
          accent="rose"
          shortcuts={[
            {
              keys: `${formatShortcutLabel(shortcuts.playerOneSingle)} / ${formatShortcutLabel(shortcuts.playerOneDouble)}`,
              label: `إضافة نقاط للاعب 1`,
            },
            {
              keys: `${formatShortcutLabel(shortcuts.playerTwoSingle)} / ${formatShortcutLabel(shortcuts.playerTwoDouble)}`,
              label: `إضافة نقاط للاعب 2`,
            },
            {
              keys: `${formatShortcutLabel(globalShortcuts.playerOne)} / ${formatShortcutLabel(globalShortcuts.playerTwo)}`,
              label: "تحديد اللاعب الحالي",
            },
          ]}
          tips={[
            "اضغط على بطاقة اللاعب نفسه لإضافة النقاط بسرعة.",
            "استخدم -1 فقط عند الحاجة لتصحيح النتيجة.",
            "يمكنك تحديد اللاعب الحالي يدوياً إذا أردت إبراز اسمه على الشاشة.",
          ]}
          onPrev={prevRound}
          onNext={nextRound}
        />
      </div>
    </div>
  );
}
