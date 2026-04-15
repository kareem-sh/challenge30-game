import { useEffect, useEffectEvent } from "react";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import { getRoundName } from "../app/roundUtils";
import {
  eventMatchesShortcut,
  formatShortcutLabel,
  shouldIgnoreShortcutEvent,
} from "../app/shortcutUtils";
// import RoundTimerDisplay from "../components/RoundTimerDisplay"; // COMMENTED: Timer disabled for manual Round 1
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
  // COMMENTED: Not used since roundIndexStore and roundsOrderStore are commented
  // const roundIndexStore = useGameStore((s) => s.roundIndex);
  // const roundsOrderStore = useGameStore((s) => s.roundsOrder);
  const resetQuestion = useGameStore((s) => s.resetQuestion);
  const setCurrentPlayer = useGameStore((s) => s.setCurrentPlayer);
  const round1QuestionIndex = useGameStore((s) => s.round1QuestionIndex);
  const round1PassUsed = useGameStore((s) => s.round1PassUsed);
  const setRound1QuestionIndex = useGameStore((s) => s.setRound1QuestionIndex);
  const markRound1PassUsed = useGameStore((s) => s.markRound1PassUsed);
  const setRound1PlayerPassUsed = useGameStore(
    (s) => s.setRound1PlayerPassUsed,
  );
  const resetRound1Passes = useGameStore((s) => s.resetRound1Passes);
  // COMMENTED: Timer functionality disabled for manual Round 1
  // const globalTimer = useGameStore((s) => s.globalTimer);
  // const setGlobalTimer = useGameStore((s) => s.setGlobalTimer);
  // const timeRunning = useGameStore((s) => s.timeRunning);
  // const startTimer = useGameStore((s) => s.startTimer);
  // const restartGlobalTimer = useGameStore((s) => s.restartGlobalTimer);
  // const resetGlobalTimer = useGameStore((s) => s.resetGlobalTimer);
  // const pauseTimer = useGameStore((s) => s.pauseTimer);
  const triggerMistakeSound = useGameStore((s) => s.triggerMistakeSound);
  // const globalTimerNaturalEndToken = useGameStore(
  //   (s) => s.globalTimerNaturalEndToken,
  // );
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
  const currentPlayerPassRemaining = Math.max(
    0,
    passLimit - currentPlayerPassUsed,
  );
  // COMMENTED: Timer functionality disabled for manual Round 1
  // const [timeExpired, setTimeExpired] = useState(false);
  // const prevNaturalEndToken = useRef(globalTimerNaturalEndToken);

  // COMMENTED: Timer functionality disabled for manual Round 1
  // useEffect(() => {
  //   if (globalTimerNaturalEndToken === prevNaturalEndToken.current) {
  //     return;
  //   }
  //   prevNaturalEndToken.current = globalTimerNaturalEndToken;
  //
  //   if (roundsOrderStore[roundIndexStore] !== 1) return;
  //   if (questionResolved || !isQuestionReady) return;
  //
  //   queueMicrotask(() => {
  //     setTimeExpired(true);
  //   });
  // }, [
  //   globalTimerNaturalEndToken,
  //   isQuestionReady,
  //   questionResolved,
  //   roundIndexStore,
  //   roundsOrderStore,
  // ]);
  const scoresAlreadyReset = players.every(
    (player) => Number(player.score || 0) === 0,
  );
  const round1QuestionBank = (allSettings.questionBank?.round1 || []).filter(
    (bankQuestion) => bankQuestion.trim().length > 0,
  );
  const selectedBankQuestion = round1QuestionBank.includes(question)
    ? question
    : "";

  // COMMENTED: Timer functionality disabled for manual Round 1
  // const prepareTimer = () => {
  //   // Reset the global timer to the Round 1 time setting
  //   resetGlobalTimer(settings.time);
  // };
  //
  // // Start or resume the timer if question is ready and not expired
  // const handleStartOrResume = () => {
  //   if (!isQuestionReady || questionResolved || timeExpired) return;
  //
  //   // Initialize or restart timer if it's at 0 or has been reset
  //   if (globalTimer <= 0 || globalTimer > settings.time) {
  //     prepareTimer();
  //   }
  //
  //   setTimeExpired(false);
  //   // Begin the countdown
  //   startTimer();
  // };
  //
  // // Toggle timer between running and paused states
  // const handleToggleTimer = () => {
  //   if (timeRunning) {
  //     // Pause the countdown timer
  //     pauseTimer();
  //     return;
  //   }
  //
  //   // Resume or start the timer
  //   handleStartOrResume();
  // };

  // Switch to the other player
  const handleSwitch = () => {
    if (!isQuestionReady || questionResolved) return;

    // COMMENTED: Timer functionality disabled for manual Round 1
    // setTimeExpired(false);
    switchPlayer();
    // // Restart the timer back to full time for the new player
    // restartGlobalTimer(settings.time);
  };

  // Record a strike/mistake for the current player - MANUAL STRIKES, AUTO-POINTS SYSTEM
  // AUTO-POINTS RULE: When one player reaches 3 strikes, the other player automatically gets points
  // Perfect win (0 strikes): 2 points | Normal win (1+ strikes): 1 point
  const handleStrike = () => {
    if (!isQuestionReady || questionResolved) return;

    addStrike(current);
    triggerMistakeSound(current);

    const state = useGameStore.getState();
    const updatedPlayers = state.players;

    // AUTO-POINTS: Check if current player reached 3 strikes (mistake limit)
    // If so, award points to the other player automatically based on their strike count
    if (updatedPlayers[current].strikes >= settings.mistakes) {
      // Award perfect points (2) if winner has 0 strikes, normal points (1) otherwise
      const pointsToAward =
        updatedPlayers[other].strikes === 0
          ? settings.perfectPoint
          : settings.normalPoint;
      addScore(other, pointsToAward);
      setCurrentPlayer(other);
      return;
    }

    // Switch to other player (strikes are manual, no timer)
    switchPlayer();
  };

  // Pass the turn to the other player without using a strike
  const handlePassTurn = () => {
    if (!isQuestionReady || questionResolved || !currentPlayerHasPass) return;

    // COMMENTED: Timer functionality disabled for manual Round 1
    // setTimeExpired(false);
    markRound1PassUsed(current);
    switchPlayer();
    // // Restart the timer for the other player
    // restartGlobalTimer(settings.time);
  };

  const handleManualStrikeChange = (playerIndex, delta) => {
    const player = players[playerIndex];

    if (!player || delta === 0) return;

    const nextStrikes = Math.max(
      0,
      Math.min(settings.mistakes, Number(player.strikes || 0) + delta),
    );

    if (nextStrikes === player.strikes) return;

    // Update the strikes
    setPlayerStrikes(playerIndex, nextStrikes);

    // Check if the player who gained strikes reached the mistake limit
    if (
      nextStrikes >= settings.mistakes &&
      Number(player.strikes || 0) < settings.mistakes
    ) {
      // This player just reached 3 strikes - award points to the other player
      const opponentIndex = playerIndex === 0 ? 1 : 0;
      const state = useGameStore.getState();
      const opponentStrikes = state.players[opponentIndex].strikes;

      // Award perfect points (2) if opponent has 0 strikes, normal points (1) otherwise
      const pointsToAward =
        opponentStrikes === 0 ? settings.perfectPoint : settings.normalPoint;
      addScore(opponentIndex, pointsToAward);
    }
  };

  const handleManualScoreChange = (playerIndex, delta) => {
    if (delta === 0) return;
    const score = Number(players[playerIndex]?.score || 0);
    if (delta < 0 && score <= 0) return;
    addScore(playerIndex, delta);
  };

  const handleManualPassChange = (playerIndex, delta) => {
    const usedCount = Number(round1PassUsed[playerIndex] || 0);

    if (delta === 0) return;

    const nextUsedCount = Math.max(0, Math.min(passLimit, usedCount + delta));

    if (nextUsedCount === usedCount) return;

    setRound1PlayerPassUsed(playerIndex, nextUsedCount);
  };

  const finishCurrentQuestion = () => {
    // COMMENTED: Timer functionality disabled for manual Round 1
    // pauseTimer();
    // setTimeExpired(false);
    resetQuestion(settings.time);

    if (round1QuestionIndex < settings.questionsCount) {
      setRound1QuestionIndex(round1QuestionIndex + 1);
    }
  };

  // COMMENTED: Timer functionality disabled for manual Round 1
  // const handleResetTimer = () => {
  //   pauseTimer();
  //   resetGlobalTimer(settings.time);
  // };
  //
  // useEffect(() => {
  //   if (globalTimer > settings.time) {
  //     setGlobalTimer(settings.time);
  //   }
  // }, [globalTimer, setGlobalTimer, settings.time]);

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

    // COMMENTED: Timer toggle disabled for manual Round 1
    // if (eventMatchesShortcut(event, globalShortcuts.timerToggle)) {
    //   event.preventDefault();
    //   handleToggleTimer();
    //   return;
    // }

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

  // COMMENTED: Timer functionality disabled for manual Round 1
  // useEffect(() => {
  //   if (!questionResolved) return;
  //   pauseTimer();
  // }, [pauseTimer, questionResolved]);

  const statusMessage = questionResolved
    ? `حُسم السؤال لـ ${players[winnerIndex]?.name || ""}`
    : isQuestionReady
      ? "السؤال جاهز"
      : "اكتب السؤال أولاً";

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
        <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/80 p-4 shadow-[0_24px_60px_rgba(2,6,23,0.4)] backdrop-blur-xl md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3 text-right">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.32em] text-cyan-200">
                  الجولة 1
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">
                  السؤال {round1QuestionIndex} من {settings.questionsCount}
                </span>
              </div>
              <div>
                <h1 className="text-[clamp(1.7rem,3vw,3rem)] font-black tracking-tight text-white">
                  {roundTitle}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  عرض مختصر للدور الحالي والنقاط وإعدادات السؤال.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-right sm:grid-cols-4 xl:min-w-[520px]">
              <div className="rounded-[1rem] border border-white/10 bg-white/5 p-2.5">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  السؤال الحالي
                </div>
                <div className="mt-1.5 text-xl font-black text-white">
                  {settings.time} ث
                </div>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-white/5 p-2.5">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  الدور الآن
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  {players[current]?.name}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  الأخطاء المسموحة
                </div>
                <div className="mt-1.5 text-xl font-black text-white">
                  {settings.mistakes}
                </div>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-white/5 p-2.5">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  منح النقاط
                </div>
                <div className="mt-1.5 text-sm font-black text-white">
                  {settings.normalPoint} / {settings.perfectPoint}
                </div>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-white/5 p-2.5">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  عدد التمريرات
                </div>
                <div className="mt-1.5 text-xl font-black text-white">
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
                    السؤال
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    اختره من القائمة أو اكتبه مباشرة.
                  </div>
                </div>
                <div
                  className={[
                    "rounded-full px-4 py-2 text-sm font-bold",
                    questionResolved
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-white/5 text-slate-300", // COMMENTED: Timer state removed for manual Round 1
                  ].join(" ")}
                >
                  {statusMessage}
                </div>
              </div>

              <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="space-y-2 text-right">
                  <div className="text-[0.68rem] font-black uppercase tracking-[0.32em] text-slate-500">
                    أسئلة محفوظة
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
                  مسح
                </button>
              </div>

              <textarea
                className="min-h-[170px] w-full rounded-[1.75rem] border border-white/10 bg-slate-900/80 px-5 py-5 text-right text-[clamp(1.4rem,2.2vw,2.3rem)] font-black leading-relaxed text-white outline-none transition focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
                placeholder="مثال: رفاق ميسي الذين فازوا بدوري أبطال أوروبا معه"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />

              <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                {/* COMMENTED: Timer functionality disabled for manual Round 1 */}
                {/* <button
                  onClick={handleStartOrResume}
                  disabled={!isQuestionReady || questionResolved}
                  className="flex-1 rounded-[1.5rem] bg-gradient-to-l from-cyan-400 to-sky-300 px-6 py-5 text-xl font-black text-slate-950 shadow-[0_18px_40px_rgba(34,211,238,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {timeRunning ? "العدّاد يعمل الآن" : "بدء السؤال"}
                </button> */}
                <button
                  onClick={() => {
                    // COMMENTED: Timer reset disabled for manual Round 1 (pauseTimer, resetGlobalTimer)
                    resetStrikes();
                    resetRound1Passes();
                  }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-5 text-lg font-black text-white transition hover:bg-white/10"
                >
                  تصفير الأخطاء والتمرير
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
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleManualScoreChange(index, -1)}
                            disabled={Number(player.score || 0) <= 0}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`نقطة أقل لـ ${player.name}`}
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleManualScoreChange(index, 1)}
                            className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100 transition hover:bg-emerald-400/15"
                            aria-label={`نقطة إضافية لـ ${player.name}`}
                          >
                            +1
                          </button>
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
                              disabled={
                                Number(round1PassUsed[index] || 0) >= passLimit
                              }
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
                      أخطاء {player.strikes} من {settings.mistakes} • تمرير
                      مستخدم {Number(round1PassUsed[index] || 0)} من {passLimit}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>

          <aside className="space-y-6">
            {/* COMMENTED: Timer functionality disabled for manual Round 1 */}
            {/* <RoundTimerDisplay
              totalSeconds={settings.time}
              label="مؤقت الدور الحالي"
            /> */}

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
              <div className="mb-5 text-right">
                <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                  لوحة التحكم السريعة
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  استخدم هذه الأزرار أثناء اللعب.
                </div>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={handleStrike}
                  disabled={!isQuestionReady || questionResolved}
                  className="rounded-[1.7rem] bg-gradient-to-l from-rose-600 to-orange-400 px-6 py-6 text-right text-2xl font-black text-white shadow-[0_24px_50px_rgba(244,63,94,0.3)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  خطأ على {players[current].name}
                </button>

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={handleSwitch}
                    disabled={!isQuestionReady || questionResolved}
                    className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 px-5 py-5 text-right text-lg font-black text-cyan-100 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    تبديل إلى {players[other].name}
                  </button>

                  <button
                    onClick={handlePassTurn}
                    disabled={
                      !isQuestionReady ||
                      questionResolved ||
                      !currentPlayerHasPass
                    }
                    className="rounded-[1.5rem] border border-violet-300/20 bg-violet-400/10 px-5 py-5 text-right text-lg font-black text-violet-100 transition hover:bg-violet-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    تمرير الدور إلى {players[other].name}
                    <div className="mt-2 text-xs font-semibold text-violet-100/80">
                      {currentPlayerHasPass
                        ? `متبقي ${currentPlayerPassRemaining}`
                        : "استُنفدت التمريرات"}
                    </div>
                  </button>

                  {/* COMMENTED: Timer functionality disabled for manual Round 1 */}
                  {/* <button
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
                  </button> */}
                </div>

                <button
                  onClick={finishCurrentQuestion}
                  className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-400/10 px-5 py-5 text-right text-lg font-black text-emerald-100 transition hover:bg-emerald-400/15"
                >
                  إنهاء السؤال الحالي والانتقال لرقم{" "}
                  {Math.min(round1QuestionIndex + 1, settings.questionsCount)}
                </button>

                <button
                  onClick={resetRound1Passes}
                  className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 px-5 py-5 text-right text-lg font-black text-yellow-100 transition hover:bg-yellow-400/15"
                >
                  إعادة التمرير للجميع
                  <div className="mt-2 text-xs font-semibold text-yellow-100/80">
                    يعيد عدد التمريرات في هذا السؤال
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

          </aside>
        </div>

        <OperatorHelpPanel
          accent="cyan"
          shortcuts={[
            {
              keys: formatShortcutLabel(globalShortcuts.markMistake),
              label: "خطأ على اللاعب الحالي",
            },
            {
              keys: formatShortcutLabel(shortcuts.switchPlayer),
              label: "تبديل اللاعب",
            },
            {
              keys: formatShortcutLabel(shortcuts.passTurn),
              label: "تمرير الدور",
            },
            {
              keys: formatShortcutLabel(globalShortcuts.confirmAction),
              label: "إنهاء السؤال الحالي",
            },
          ]}
          tips={[
            "ابدأ بكتابة السؤال أو اختياره من القائمة.",
            "استخدم التمرير فقط عند الحاجة لأنه محدود لكل لاعب.",
            "عند وصول لاعب لحد الأخطاء تُحسب النقطة تلقائياً للطرف الآخر.",
          ]}
          onPrev={prevRound}
          onNext={nextRound}
        />
      </div>
    </div>
  );
}
