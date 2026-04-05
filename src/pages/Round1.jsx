import { useEffect, useEffectEvent, useState } from "react";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import { getRoundName } from "../app/roundUtils";
import { eventMatchesShortcut, formatShortcutLabel } from "../app/shortcutUtils";
import RoundTimerDisplay from "../components/RoundTimerDisplay";
import StrikeMeter from "../components/StrikeMeter";
import PassMeter from "../components/PassMeter";
import OperatorHelpPanel from "../components/OperatorHelpPanel";

export default function Round1() {
  const players = useGameStore((s) => s.players);
  const current = useGameStore((s) => s.currentPlayer);
  const addStrike = useGameStore((s) => s.addStrike);
  const setPlayerStrikes = useGameStore((s) => s.setPlayerStrikes);
  const switchPlayer = useGameStore((s) => s.switchPlayer);
  const resetStrikes = useGameStore((s) => s.resetStrikes);
  const addScore = useGameStore((s) => s.addScore);
  const resetScores = useGameStore((s) => s.resetScores);
  const nextRound = useGameStore((s) => s.nextRound);
  const prevRound = useGameStore((s) => s.prevRound);
  const question = useGameStore((s) => s.question);
  const setQuestion = useGameStore((s) => s.setQuestion);
  const resetQuestion = useGameStore((s) => s.resetQuestion);
  const setCurrentPlayer = useGameStore((s) => s.setCurrentPlayer);
  const round1QuestionIndex = useGameStore((s) => s.round1QuestionIndex);
  const round1PassUsed = useGameStore((s) => s.round1PassUsed);
  const setRound1QuestionIndex = useGameStore((s) => s.setRound1QuestionIndex);
  const markRound1PassUsed = useGameStore((s) => s.markRound1PassUsed);
  const setRound1PlayerPassUsed = useGameStore((s) => s.setRound1PlayerPassUsed);
  const resetRound1Passes = useGameStore((s) => s.resetRound1Passes);
  const globalTimer = useGameStore((s) => s.globalTimer);
  const setGlobalTimer = useGameStore((s) => s.setGlobalTimer);
  const timeRunning = useGameStore((s) => s.timeRunning);
  const startTimer = useGameStore((s) => s.startTimer);
  const restartGlobalTimer = useGameStore((s) => s.restartGlobalTimer);
  const resetGlobalTimer = useGameStore((s) => s.resetGlobalTimer);
  const pauseTimer = useGameStore((s) => s.pauseTimer);
  const triggerMistakeSound = useGameStore((s) => s.triggerMistakeSound);
  const settings = useSettingsStore((s) => s.round1);
  const allSettings = useSettingsStore();

  const other = current === 0 ? 1 : 0;
  const isQuestionReady = question.trim().length > 0;
  const questionResolved = players.some(
    (player) => player.strikes >= settings.mistakes,
  );
  const resolvedPlayerIndex = players.findIndex(
    (player) => player.strikes >= settings.mistakes,
  );
  const winnerIndex =
    resolvedPlayerIndex === -1 ? -1 : resolvedPlayerIndex === 0 ? 1 : 0;
  const passLimit = Math.max(1, Number(settings.passCount) || 1);
  const roundTitle = getRoundName(allSettings, 1);
  const shortcuts = settings.shortcuts;
  const globalShortcuts = allSettings.globalShortcuts;
  const currentPlayerPassUsed = Number(round1PassUsed[current] || 0);
  const currentPlayerHasPass = currentPlayerPassUsed < passLimit;
  const [timeExpired, setTimeExpired] = useState(false);
  const round1QuestionBank = (allSettings.questionBank?.round1 || []).filter(
    (bankQuestion) => bankQuestion.trim().length > 0,
  );
  const selectedBankQuestion = round1QuestionBank.includes(question) ? question : "";

  const prepareTimer = () => {
    resetGlobalTimer(settings.time);
  };

  const handleStartOrResume = () => {
    if (!isQuestionReady || questionResolved || timeExpired) return;

    if (globalTimer <= 0 || globalTimer > settings.time) {
      prepareTimer();
    }

    setTimeExpired(false);
    startTimer();
  };

  const handleToggleTimer = () => {
    if (timeRunning) {
      pauseTimer();
      return;
    }

    handleStartOrResume();
  };

  const handleSwitch = () => {
    if (!isQuestionReady || questionResolved || timeExpired) return;

    switchPlayer();
    restartGlobalTimer(settings.time);
  };

  const handleStrike = () => {
    if (!isQuestionReady || questionResolved) return;

    setTimeExpired(false);
    addStrike(current);
    triggerMistakeSound(current);

    const state = useGameStore.getState();
    const updatedPlayers = state.players;

    if (updatedPlayers[current].strikes >= settings.mistakes) {
      const points =
        updatedPlayers[other].strikes === 0
          ? settings.perfectPoint
          : settings.normalPoint;

      addScore(other, points);
      setCurrentPlayer(other);
      restartGlobalTimer(settings.time);
      return;
    }

    switchPlayer();
    restartGlobalTimer(settings.time);
  };

  const handlePassTurn = () => {
    if (
      !isQuestionReady ||
      questionResolved ||
      timeExpired ||
      !currentPlayerHasPass
    )
      return;

    markRound1PassUsed(current);
    switchPlayer();
    restartGlobalTimer(settings.time);
  };

  const handleManualStrikeChange = (playerIndex, delta) => {
    const player = players[playerIndex];

    if (!player || delta === 0) return;

    const nextStrikes = Math.max(
      0,
      Math.min(settings.mistakes, Number(player.strikes || 0) + delta),
    );

    if (nextStrikes === player.strikes) return;

    setPlayerStrikes(playerIndex, nextStrikes);
  };

  const handleManualPassChange = (playerIndex, delta) => {
    const usedCount = Number(round1PassUsed[playerIndex] || 0);

    if (delta === 0) return;

    const nextUsedCount = Math.max(0, Math.min(passLimit, usedCount + delta));

    if (nextUsedCount === usedCount) return;

    setRound1PlayerPassUsed(playerIndex, nextUsedCount);
  };

  const finishCurrentQuestion = () => {
    pauseTimer();
    setTimeExpired(false);
    resetQuestion(settings.time);

    if (round1QuestionIndex < settings.questionsCount) {
      setRound1QuestionIndex(round1QuestionIndex + 1);
    }
  };

  const handleResetTimer = () => {
    pauseTimer();
    resetGlobalTimer(settings.time);
  };

  useEffect(() => {
    if (globalTimer > settings.time) {
      setGlobalTimer(settings.time);
    }
  }, [globalTimer, setGlobalTimer, settings.time]);

  useEffect(() => {
    if (!isQuestionReady || questionResolved) {
      setTimeExpired(false);
    }
  }, [isQuestionReady, questionResolved]);

  const onGlobalKeydown = useEffectEvent((event) => {
    if (shouldIgnoreShortcutEvent(event)) {
      return;
    }

    if (eventMatchesShortcut(event, globalShortcuts.markMistake)) {
      event.preventDefault();
      handleStrike();
      return;
    }

    if (eventMatchesShortcut(event, shortcuts.switchPlayer)) {
      event.preventDefault();
      handleSwitch();
      return;
    }

    if (eventMatchesShortcut(event, shortcuts.passTurn)) {
      event.preventDefault();
      handlePassTurn();
      return;
    }

    if (eventMatchesShortcut(event, globalShortcuts.timerToggle)) {
      event.preventDefault();
      handleToggleTimer();
      return;
    }

    if (eventMatchesShortcut(event, globalShortcuts.confirmAction)) {
      event.preventDefault();
      finishCurrentQuestion();
    }
  });

  useEffect(() => {
    const handleKeydown = (event) => onGlobalKeydown(event);

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (!questionResolved) return;
    pauseTimer();
  }, [pauseTimer, questionResolved]);

  const statusMessage = questionResolved
    ? `تم حسم السؤال لصالح ${players[winnerIndex]?.name || ""}`
    : timeExpired
      ? `انتهى وقت ${players[current].name}. اضغط خطأ لبدء الوقت تلقائياً للاعب الآخر.`
      : timeRunning
        ? `الدور الآن على ${players[current].name}`
        : isQuestionReady
          ? "السؤال جاهز ويمكنك بدء العدّاد"
          : "أدخل موضوع السؤال أولاً";

  return (
    <div
      className="relative mx-auto min-h-[calc(100svh-7rem)] w-full max-w-[1800px] overflow-hidden px-4 py-6 md:px-8 md:py-8 xl:px-10"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] h-[26rem] w-[26rem] rounded-full bg-cyan-500/12 blur-[120px]" />
        <div className="absolute bottom-[-18%] left-[-8%] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.55),_transparent_40%),linear-gradient(135deg,rgba(2,6,23,0.96),rgba(15,23,42,0.84))]" />
      </div>

      <div className="relative z-10 space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4 text-right">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.35em] text-cyan-200">
                  الجولة 1
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
                  السؤال {round1QuestionIndex} من {settings.questionsCount}
                </span>
              </div>
              <div>
                <h1 className="text-[clamp(2.2rem,4vw,4.8rem)] font-black tracking-tight text-white">
                  {roundTitle}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  واجهة تشغيل سريعة وواضحة للتقني، مع عرض حيّ للدور الحالي،
                  الأخطاء، المؤقت، وحسم النقاط وفق إعدادات الجولة.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-right sm:grid-cols-3 xl:min-w-[560px]">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  زمن المحاولة
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  {settings.time} ث
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  حد الأخطاء
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  {settings.mistakes}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  منح النقاط
                </div>
                <div className="mt-3 text-lg font-black text-white">
                  {settings.normalPoint} / {settings.perfectPoint}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:col-span-3 xl:col-span-1">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  عدد التمريرات
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  {settings.passCount}
                </div>
                <div className="mt-1 text-xs font-bold text-slate-400">
                  لكل لاعب في السؤال
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.9fr)]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="text-right">
                  <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                    موضوع السؤال الحالي
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    اختر السؤال من بنك الأسئلة أو اكتب عنوان التحدي يدوياً ليظهر
                    فوراً على شاشة الجمهور.
                  </div>
                </div>
                <div
                  className={[
                    "rounded-full px-4 py-2 text-sm font-bold",
                    questionResolved
                      ? "bg-emerald-500/15 text-emerald-300"
                      : timeRunning
                        ? "bg-cyan-500/15 text-cyan-200"
                        : "bg-white/5 text-slate-300",
                  ].join(" ")}
                >
                  {statusMessage}
                </div>
              </div>

              <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="space-y-2 text-right">
                  <div className="text-[0.68rem] font-black uppercase tracking-[0.32em] text-slate-500">
                    بنك الأسئلة
                  </div>
                  <select
                    value={selectedBankQuestion}
                    onChange={(event) => setQuestion(event.target.value)}
                    className="w-full rounded-[1.2rem] border border-white/10 bg-slate-900/80 px-4 py-4 text-base font-black text-white outline-none transition focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
                  >
                    <option value="">اختر سؤالاً محفوظاً أو اكتب يدوياً</option>
                    {round1QuestionBank.map((bankQuestion, index) => (
                      <option
                        key={`${bankQuestion}-${index}`}
                        value={bankQuestion}
                      >
                        {index + 1}. {bankQuestion}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setQuestion("")}
                  className="rounded-[1.2rem] border border-white/10 bg-white/5 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10 lg:self-end"
                >
                  تفريغ الحقل
                </button>
              </div>

              <textarea
                className="min-h-[170px] w-full rounded-[1.75rem] border border-white/10 bg-slate-900/80 px-5 py-5 text-right text-[clamp(1.4rem,2.2vw,2.3rem)] font-black leading-relaxed text-white outline-none transition focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
                placeholder="مثال: رفاق ميسي الذين فازوا بدوري أبطال أوروبا معه"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />

              <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                <button
                  onClick={handleStartOrResume}
                  disabled={!isQuestionReady || questionResolved}
                  className="flex-1 rounded-[1.5rem] bg-gradient-to-l from-cyan-400 to-sky-300 px-6 py-5 text-xl font-black text-slate-950 shadow-[0_18px_40px_rgba(34,211,238,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {timeRunning ? "العدّاد يعمل الآن" : "بدء السؤال"}
                </button>
                <button
                  onClick={() => {
                    pauseTimer();
                    resetGlobalTimer(settings.time);
                    resetStrikes();
                    resetRound1Passes();
                  }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-5 text-lg font-black text-white transition hover:bg-white/10"
                >
                  تصفير الوقت والأخطاء والتمرير
                </button>
              </div>
            </section>

            <section className="grid gap-6 2xl:grid-cols-2">
              {players.map((player, index) => {
                const isActive = current === index;
                const isWinner = questionResolved && winnerIndex === index;

                return (
                  <article
                    key={index}
                    className={[
                      "rounded-[2rem] border p-5 shadow-[0_24px_70px_rgba(15,23,42,0.32)] backdrop-blur-xl transition duration-500 md:p-7",
                      isWinner
                        ? "border-emerald-400/40 bg-emerald-500/10"
                        : isActive
                          ? "border-cyan-400/35 bg-cyan-500/10"
                          : "border-white/10 bg-slate-950/70",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-right">
                        <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-500">
                          {isWinner
                            ? "حسم السؤال"
                            : isActive
                              ? "الدور الحالي"
                              : "بانتظار الدور"}
                        </div>
                        <h2 className="mt-3 text-[clamp(1.8rem,2.5vw,3rem)] font-black text-white">
                          {player.name}
                        </h2>
                      </div>

                      <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4 text-center">
                        <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                          النقاط
                        </div>
                        <div className="mt-2 text-4xl font-black text-white tabular-nums">
                          {player.score}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="mb-3 text-sm font-bold text-slate-400">
                        الأخطاء
                      </div>
                      <StrikeMeter
                        strikes={player.strikes}
                        maxStrikes={settings.mistakes}
                      />

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-xs font-bold text-slate-500">
                          تعديل يدوي بدون تبديل الدور
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleManualStrikeChange(index, -1)}
                            disabled={player.strikes <= 0}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`تقليل أخطاء ${player.name}`}
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleManualStrikeChange(index, 1)}
                            disabled={player.strikes >= settings.mistakes}
                            className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-black text-cyan-100 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`زيادة أخطاء ${player.name}`}
                          >
                            +1
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <div className="w-full">
                        <PassMeter
                          usedCount={Number(round1PassUsed[index] || 0)}
                          totalCount={passLimit}
                        />

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="text-xs font-bold text-slate-500">
                            تعديل يدوي للتمرير بدون تبديل الدور
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleManualPassChange(index, 1)}
                              disabled={Number(round1PassUsed[index] || 0) >= passLimit}
                              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`استهلاك تمرير من ${player.name}`}
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleManualPassChange(index, -1)}
                              disabled={Number(round1PassUsed[index] || 0) <= 0}
                              className="rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-sm font-black text-violet-100 transition hover:bg-violet-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`إرجاع تمرير إلى ${player.name}`}
                            >
                              +1
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-black/20 px-5 py-4 text-sm text-slate-300">
                      {isWinner
                        ? `حصل على ${players[index].score} نقطة إجمالية بعد هذا السؤال.`
                        : player.strikes === 0
                          ? `بدون أخطاء. استُخدم ${Number(round1PassUsed[index] || 0)} من ${passLimit} تمريرات.`
                          : `سجّل ${player.strikes} من ${settings.mistakes} أخطاء، واستُخدم ${Number(round1PassUsed[index] || 0)} من ${passLimit} تمريرات.`}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>

          <aside className="space-y-6">
            <RoundTimerDisplay
              totalSeconds={settings.time}
              onFinish={() => {
                if (!questionResolved && isQuestionReady) {
                  pauseTimer();
                  setTimeExpired(true);
                }
              }}
              label="مؤقت الدور الحالي"
            />

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
              <div className="mb-5 text-right">
                <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                  لوحة التحكم السريعة
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  أزرار كبيرة لتقليل الخطأ أثناء البث المباشر.
                </div>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={handleStrike}
                  disabled={!isQuestionReady || questionResolved}
                  className="rounded-[1.7rem] bg-gradient-to-l from-rose-600 to-orange-400 px-6 py-6 text-right text-2xl font-black text-white shadow-[0_24px_50px_rgba(244,63,94,0.3)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  خطأ على {players[current].name}
                  <div className="mt-2 text-sm font-semibold text-white/80">
                    الاختصار {formatShortcutLabel(globalShortcuts.markMistake)}
                  </div>
                </button>

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={handleSwitch}
                    disabled={
                      !isQuestionReady || questionResolved || timeExpired
                    }
                    className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 px-5 py-5 text-right text-lg font-black text-cyan-100 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    تبديل إلى {players[other].name}
                    <div className="mt-2 text-xs font-semibold text-cyan-200/80">
                      {formatShortcutLabel(shortcuts.switchPlayer)}
                    </div>
                  </button>

                  <button
                    onClick={handlePassTurn}
                    disabled={
                      !isQuestionReady ||
                      questionResolved ||
                      timeExpired ||
                      !currentPlayerHasPass
                    }
                    className="rounded-[1.5rem] border border-violet-300/20 bg-violet-400/10 px-5 py-5 text-right text-lg font-black text-violet-100 transition hover:bg-violet-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    تمرير الدور إلى {players[other].name}
                    <div className="mt-2 text-xs font-semibold text-violet-100/80">
                      {currentPlayerHasPass
                        ? `${formatShortcutLabel(shortcuts.passTurn)} - متبقي ${passLimit - currentPlayerPassUsed}`
                        : "استُنفدت التمريرات"}
                    </div>
                  </button>

                  <button
                    onClick={handleToggleTimer}
                    disabled={!isQuestionReady || questionResolved}
                    className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 px-5 py-5 text-right text-lg font-black text-amber-100 transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40 md:col-span-2"
                  >
                    {timeRunning ? "إيقاف مؤقت" : "تشغيل أو استئناف"}
                    <div className="mt-2 text-xs font-semibold text-amber-100/80">
                      {formatShortcutLabel(globalShortcuts.timerToggle)}
                    </div>
                  </button>

                  <button
                    onClick={handleResetTimer}
                    className="rounded-[1.5rem] border border-sky-300/20 bg-sky-400/10 px-5 py-5 text-right text-lg font-black text-sky-100 transition hover:bg-sky-400/15 md:col-span-2"
                  >
                    تصفير المؤقت فقط
                    <div className="mt-2 text-xs font-semibold text-sky-100/80">
                      إعادة إلى {settings.time} ثانية
                    </div>
                  </button>
                </div>

                <button
                  onClick={finishCurrentQuestion}
                  className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-400/10 px-5 py-5 text-right text-lg font-black text-emerald-100 transition hover:bg-emerald-400/15"
                >
                  إنهاء السؤال الحالي والانتقال لرقم{" "}
                  {Math.min(round1QuestionIndex + 1, settings.questionsCount)}
                  <div className="mt-2 text-xs font-semibold text-emerald-100/80">
                    {formatShortcutLabel(globalShortcuts.confirmAction)}
                  </div>
                </button>

                <button
                  onClick={resetRound1Passes}
                  className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 px-5 py-5 text-right text-lg font-black text-yellow-100 transition hover:bg-yellow-400/15"
                >
                  إعادة تفعيل التمرير للاعبين
                  <div className="mt-2 text-xs font-semibold text-yellow-100/80">
                    Reset Pass
                  </div>
                </button>

                <button
                  onClick={resetScores}
                  disabled={scoresAlreadyReset}
                  className="rounded-[1.5rem] border border-rose-300/20 bg-rose-500/12 px-5 py-5 text-right text-lg font-black text-rose-100 transition hover:bg-rose-500/18 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  تصفير النقاط
                  <div className="mt-2 text-xs font-semibold text-rose-100/80">
                    يعيد نقاط اللاعبين إلى صفر
                  </div>
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
              <div className="mb-5 text-right">
                <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                  حالة الجولة
                </div>
              </div>

              <div className="grid gap-4 text-right">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold text-slate-400">
                    اللاعب الحالي
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">
                    {players[current].name}
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold text-slate-400">
                    السؤال التالي
                  </div>
                  <div className="mt-2 text-base font-bold text-white">
                    {round1QuestionIndex < settings.questionsCount
                      ? `متبقي ${settings.questionsCount - round1QuestionIndex} سؤال بعد الحالي`
                      : "هذا هو السؤال الأخير في الجولة"}
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold text-slate-400">
                    حالة الحسم
                  </div>
                  <div className="mt-2 text-base font-bold text-white">
                    {questionResolved
                      ? `${players[winnerIndex]?.name || "أحد اللاعبين"} كسب السؤال`
                      : "السؤال ما زال مفتوحاً"}
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <OperatorHelpPanel
          accent="cyan"
          shortcuts={[
            {
              keys: formatShortcutLabel(globalShortcuts.markMistake),
              label: "تسجيل خطأ على اللاعب الحالي",
            },
            {
              keys: formatShortcutLabel(shortcuts.switchPlayer),
              label: "تبديل اللاعب",
            },
            {
              keys: formatShortcutLabel(shortcuts.passTurn),
              label: `تمرير الدور حتى ${passLimit} مرة`,
            },
            {
              keys: formatShortcutLabel(globalShortcuts.timerToggle),
              label: "تشغيل أو إيقاف المؤقت",
            },
            {
              keys: formatShortcutLabel(globalShortcuts.confirmAction),
              label: "إنهاء السؤال الحالي",
            },
          ]}
          tips={[
            "ابدأ المؤقت فقط بعد كتابة السؤال حتى يظهر فوراً على شاشة الجمهور.",
            "استخدم التمرير عند الحاجة فقط لأنه محدود لكل سؤال.",
            "عند وصول لاعب لحد الأخطاء تُحسم النقاط تلقائياً حسب الإعدادات.",
          ]}
          onPrev={prevRound}
          onNext={nextRound}
        />
      </div>
    </div>
  );
}
