import { useEffect, useEffectEvent } from "react";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import { getRoundName } from "../app/roundUtils";
import RoundTimerDisplay from "../components/RoundTimerDisplay";
import OperatorHelpPanel from "../components/OperatorHelpPanel";

export default function Round2() {
  const players = useGameStore((s) => s.players);
  const current = useGameStore((s) => s.currentPlayer);
  const setCurrentPlayer = useGameStore((s) => s.setCurrentPlayer);
  const addScore = useGameStore((s) => s.addScore);
  const nextRound = useGameStore((s) => s.nextRound);
  const prevRound = useGameStore((s) => s.prevRound);
  const question = useGameStore((s) => s.question);
  const setQuestion = useGameStore((s) => s.setQuestion);
  const setAuction = useGameStore((s) => s.setAuction);
  const hideAuction = useGameStore((s) => s.hideAuction);
  const timeRunning = useGameStore((s) => s.timeRunning);
  const startTimer = useGameStore((s) => s.startTimer);
  const pauseTimer = useGameStore((s) => s.pauseTimer);
  const restartGlobalTimer = useGameStore((s) => s.restartGlobalTimer);
  const resetGlobalTimer = useGameStore((s) => s.resetGlobalTimer);
  const triggerMistakeSound = useGameStore((s) => s.triggerMistakeSound);
  const round2Phase = useGameStore((s) => s.round2Phase);
  const round2DeclaredValue = useGameStore((s) => s.round2DeclaredValue);
  const round2CorrectCount = useGameStore((s) => s.round2CorrectCount);
  const round2DeclaredByPlayer = useGameStore((s) => s.round2DeclaredByPlayer);
  const round2LastOutcome = useGameStore((s) => s.round2LastOutcome);
  const setRound2Phase = useGameStore((s) => s.setRound2Phase);
  const setRound2DeclaredValue = useGameStore((s) => s.setRound2DeclaredValue);
  const setRound2CorrectCount = useGameStore((s) => s.setRound2CorrectCount);
  const setRound2PlayerDeclaration = useGameStore((s) => s.setRound2PlayerDeclaration);
  const setRound2LastOutcome = useGameStore((s) => s.setRound2LastOutcome);
  const settings = useSettingsStore((s) => s.round2);
  const allSettings = useSettingsStore();

  const other = current === 0 ? 1 : 0;
  const isBiddingPhase = round2Phase === "bidding";
  const isQuestionReady = question.trim().length > 0;
  const roundTitle = getRoundName(allSettings, 2);
  const challengePoints = Math.floor(round2DeclaredValue / settings.namesForPoint);
  const successReady = round2DeclaredValue > 0 && round2CorrectCount >= round2DeclaredValue;
  const underHalfReached =
    round2DeclaredValue > 0 && round2CorrectCount < round2DeclaredValue / 2;

  const handleTimerToggle = () => {
    if (timeRunning) {
      pauseTimer();
      return;
    }

    startTimer();
  };

  const handleBackToBidding = () => {
    pauseTimer();
    resetGlobalTimer(settings.time);
    setRound2CorrectCount(0);
    setRound2Phase("bidding");
  };

  const resetChallengeControls = () => {
    pauseTimer();
    resetGlobalTimer(settings.time);
    setRound2CorrectCount(0);
    setRound2DeclaredValue(0);
    setRound2Phase("bidding");
  };

  const startChallenge = (playerIndex) => {
    if (!isQuestionReady || round2DeclaredValue <= 0) return;

    setCurrentPlayer(playerIndex);
    setRound2PlayerDeclaration(playerIndex, round2DeclaredValue);
    setRound2CorrectCount(0);
    setRound2Phase("challenge");
    setRound2LastOutcome(null);
    setAuction(round2DeclaredValue, playerIndex);
    restartGlobalTimer(settings.time);
    window.setTimeout(() => hideAuction(), 2200);
  };

  const handleSuccess = () => {
    pauseTimer();
    if (challengePoints > 0) {
      addScore(current, challengePoints);
    }

    setRound2LastOutcome({
      type: "success",
      player: current,
      awardedTo: current,
      points: challengePoints,
      declared: round2DeclaredValue,
      correct: round2CorrectCount,
    });
    resetChallengeControls();
  };

  const handleFailure = (type) => {
    pauseTimer();

    const points = type === "underHalf" ? settings.bonusPoint : settings.normalPoint;
    addScore(other, points);
    triggerMistakeSound(current);

    setRound2LastOutcome({
      type,
      player: current,
      awardedTo: other,
      points,
      declared: round2DeclaredValue,
      correct: round2CorrectCount,
    });
    resetChallengeControls();
  };

  const lastOutcomeLabel = (() => {
    if (!round2LastOutcome) {
      return "بانتظار أول تحدٍ في المزاد";
    }

    if (round2LastOutcome.type === "success") {
      return `${players[round2LastOutcome.player]?.name || ""} نجح وكسب ${round2LastOutcome.points} نقطة`;
    }

    if (round2LastOutcome.type === "underHalf") {
      return `${players[round2LastOutcome.awardedTo]?.name || ""} كسب ${round2LastOutcome.points} نقطة بسبب أقل من نصف العدد`;
    }

    return `${players[round2LastOutcome.awardedTo]?.name || ""} كسب ${round2LastOutcome.points} نقطة بسبب خطأ في الأسماء`;
  })();

  const onGlobalKeydown = useEffectEvent((event) => {
    const tagName = event.target?.tagName;

    if (tagName === "INPUT" || tagName === "TEXTAREA") {
      return;
    }

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      if (isBiddingPhase) {
        setRound2DeclaredValue(round2DeclaredValue + 1);
      } else {
        setRound2CorrectCount(round2CorrectCount + 1);
      }
    }

    if (event.key === "-") {
      event.preventDefault();
      if (isBiddingPhase) {
        setRound2DeclaredValue(round2DeclaredValue - 1);
      } else {
        setRound2CorrectCount(round2CorrectCount - 1);
      }
    }

    if (event.key === "1") {
      event.preventDefault();
      if (isBiddingPhase && isQuestionReady && round2DeclaredValue > 0) {
        startChallenge(0);
        return;
      }
      setCurrentPlayer(0);
    }

    if (event.key === "2") {
      event.preventDefault();
      if (isBiddingPhase && isQuestionReady && round2DeclaredValue > 0) {
        startChallenge(1);
        return;
      }
      setCurrentPlayer(1);
    }

    if (event.key === " ") {
      event.preventDefault();
      handleTimerToggle();
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (isBiddingPhase) {
        startChallenge(current);
        return;
      }

      if (successReady) {
        handleSuccess();
      }
    }

    if (!isBiddingPhase && event.key.toLowerCase() === "m") {
      event.preventDefault();
      handleFailure("mistake");
    }

    if (!isBiddingPhase && event.key.toLowerCase() === "h") {
      event.preventDefault();
      handleFailure("underHalf");
    }

    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      handleBackToBidding();
    }
  });

  useEffect(() => {
    const handleKeydown = (event) => onGlobalKeydown(event);

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div
      className="relative mx-auto min-h-[calc(100svh-7rem)] w-full max-w-[1800px] overflow-hidden px-4 py-6 md:px-8 md:py-8 xl:px-10"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-12%] h-[28rem] w-[28rem] rounded-full bg-yellow-400/12 blur-[130px]" />
        <div className="absolute bottom-[-18%] right-[-6%] h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.08),_transparent_35%),linear-gradient(135deg,rgba(2,6,23,0.96),rgba(24,24,27,0.9))]" />
      </div>

      <div className="relative z-10 space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4 text-right">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className="rounded-full border border-yellow-300/20 bg-yellow-400/10 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.35em] text-yellow-200">
                  الجولة 2
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
                  {isBiddingPhase ? "مرحلة إعلان العدد" : `التحدي الآن: ${players[current].name}`}
                </span>
              </div>
              <div>
                <h1 className="text-[clamp(2.2rem,4vw,4.8rem)] font-black tracking-tight text-white">
                  {roundTitle}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  شاشة تشغيل واضحة لإدارة الإعلان، تثبيت اللاعب الذي قبل التحدي،
                  وضبط النتيجة النهائية بسرعة وبدقة.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-right sm:grid-cols-3 xl:min-w-[560px]">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  زمن التحدي
                </div>
                <div className="mt-3 text-3xl font-black text-white">{settings.time} ث</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  التسعير
                </div>
                <div className="mt-3 text-lg font-black text-white">
                  نقطة لكل {settings.namesForPoint}
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-500">
                  الفشل
                </div>
                <div className="mt-3 text-lg font-black text-white">
                  {settings.normalPoint} / {settings.bonusPoint}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.9fr)]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
              <div className="mb-5 text-right">
                <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                  موضوع المزاد
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  اكتب التصنيف الذي سيتنافس اللاعبان على أسمائه.
                </div>
              </div>

              <textarea
                className="min-h-[150px] w-full rounded-[1.75rem] border border-white/10 bg-slate-900/80 px-5 py-5 text-right text-[clamp(1.4rem,2.2vw,2.3rem)] font-black leading-relaxed text-white outline-none transition focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/10"
                placeholder="مثال: لاعبون فازوا بدوري الأبطال أو الكرة الذهبية"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
            </section>

            {isBiddingPhase ? (
              <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="text-right">
                    <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                      مرحلة إعلان العدد
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      ثبّت العدد أولاً ثم اختر اللاعب الذي سيلتزم به ليظهر الـ popup
                      مباشرة للجمهور.
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-yellow-300/20 bg-yellow-400/10 px-5 py-4 text-right">
                    <div className="text-xs font-black uppercase tracking-[0.28em] text-yellow-200/70">
                      العدد الحالي
                    </div>
                    <div className="mt-2 text-5xl font-black text-white tabular-nums">
                      {round2DeclaredValue}
                    </div>
                  </div>
                </div>

                <div className="mb-10 flex items-center justify-center gap-5">
                  <button
                    onClick={() => setRound2DeclaredValue(round2DeclaredValue - 1)}
                    className="h-20 w-20 rounded-full border border-white/10 bg-white/5 text-4xl font-black text-white transition hover:bg-white/10"
                  >
                    -
                  </button>
                  <div className="min-w-[220px] rounded-[2rem] border border-yellow-300/20 bg-white/5 px-8 py-6 text-center">
                    <div className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">
                      الإعلان
                    </div>
                    <div className="mt-4 text-[clamp(4rem,9vw,8rem)] font-black leading-none tracking-[-0.06em] text-yellow-300 tabular-nums">
                      {round2DeclaredValue}
                    </div>
                  </div>
                  <button
                    onClick={() => setRound2DeclaredValue(round2DeclaredValue + 1)}
                    className="h-20 w-20 rounded-full border border-white/10 bg-white/5 text-4xl font-black text-white transition hover:bg-white/10"
                  >
                    +
                  </button>
                </div>

                <div className="mb-8 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <div className="mb-4 text-right text-xs font-black uppercase tracking-[0.35em] text-slate-500">
                    اللاعب الحالي في الإعلان
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {players.map((player, index) => (
                      <button
                        key={`bid-turn-${index}`}
                        onClick={() => setCurrentPlayer(index)}
                        className={`rounded-[1.3rem] px-4 py-4 text-right text-base font-black transition ${
                          current === index
                            ? "border border-yellow-300/30 bg-yellow-400/12 text-white"
                            : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        {player.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {players.map((player, index) => (
                    <button
                      key={index}
                      onClick={() => startChallenge(index)}
                      disabled={!isQuestionReady || round2DeclaredValue <= 0}
                      className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-right transition hover:border-yellow-300/35 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                            بدء التحدي لهذا اللاعب
                          </div>
                          <div className="mt-3 text-3xl font-black text-white">
                            {player.name}
                          </div>
                        </div>

                        <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/60 px-4 py-3 text-center">
                          <div className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-slate-500">
                            آخر إعلان
                          </div>
                          <div className="mt-2 text-3xl font-black text-yellow-300 tabular-nums">
                            {round2DeclaredByPlayer[index]}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="text-right">
                    <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                      التحدي الجاري
                    </div>
                    <div className="mt-3 text-[clamp(1.8rem,2.6vw,3rem)] font-black text-white">
                      {players[current].name}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.3rem] border border-yellow-300/20 bg-yellow-400/10 px-5 py-4 text-center">
                      <div className="text-xs font-black uppercase tracking-[0.3em] text-yellow-100/70">
                        العدد المعلن
                      </div>
                      <div className="mt-2 text-4xl font-black text-white tabular-nums">
                        {round2DeclaredValue}
                      </div>
                    </div>
                    <div className="rounded-[1.3rem] border border-emerald-300/20 bg-emerald-400/10 px-5 py-4 text-center">
                      <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-100/70">
                        المتوقع
                      </div>
                      <div className="mt-2 text-4xl font-black text-white tabular-nums">
                        {challengePoints}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
                  <div className="mb-4 text-center text-xs font-black uppercase tracking-[0.35em] text-slate-500">
                    العدد الصحيح المحقق
                  </div>
                  <div className="mb-6 flex items-center justify-center gap-6">
                    <button
                      onClick={() => setRound2CorrectCount(round2CorrectCount - 1)}
                      className="h-20 w-20 rounded-full border border-white/10 bg-white/5 text-4xl font-black text-white transition hover:bg-white/10"
                    >
                      -
                    </button>
                    <div className="min-w-[220px] text-center">
                      <div className="text-[clamp(4rem,9vw,8rem)] font-black leading-none tracking-[-0.06em] text-white tabular-nums">
                        {round2CorrectCount}
                      </div>
                    </div>
                    <button
                      onClick={() => setRound2CorrectCount(round2CorrectCount + 1)}
                      className="h-20 w-20 rounded-full border border-white/10 bg-white/5 text-4xl font-black text-white transition hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>

                  <div className="mb-6 rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4 text-right">
                    <div className="text-sm font-bold text-slate-400">مؤشر الحسم</div>
                    <div className="mt-2 text-lg font-black text-white">
                      {successReady
                        ? "العدد المحقق يطابق العدد المعلن ويمكن اعتماد النجاح"
                        : underHalfReached
                          ? "العدد المحقق أقل من النصف ويمكن اعتماد +2 للاعب الآخر"
                          : "إذا وُجد خطأ بالأسماء اعتمد زر الخطأ، أو أكمل العد الصحيح"}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <button
                      onClick={handleSuccess}
                      disabled={!successReady}
                      className="rounded-[1.5rem] bg-emerald-500 px-5 py-5 text-right text-lg font-black text-white shadow-[0_18px_40px_rgba(16,185,129,0.28)] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/30 disabled:text-white/55 disabled:shadow-none"
                    >
                      نجح بالتحدي
                      <div className="mt-2 text-sm font-semibold text-white/80">
                      {challengePoints > 0
                          ? `${challengePoints} نقطة`
                          : "لا توجد نقاط إذا كان العدد أقل من 10"}
                      </div>
                    </button>

                    <button
                      onClick={() => handleFailure("mistake")}
                      className="rounded-[1.5rem] border border-rose-300/20 bg-rose-500/12 px-5 py-5 text-right text-lg font-black text-rose-100 transition hover:bg-rose-500/18"
                    >
                      أخطأ في الأسماء
                      <div className="mt-2 text-sm font-semibold text-rose-100/80">
                        {players[other].name} +{settings.normalPoint}
                      </div>
                    </button>

                    <button
                      onClick={() => handleFailure("underHalf")}
                      className="rounded-[1.5rem] border border-orange-300/20 bg-orange-500/12 px-5 py-5 text-right text-lg font-black text-orange-100 transition hover:bg-orange-500/18"
                    >
                      أقل من نصف العدد
                      <div className="mt-2 text-sm font-semibold text-orange-100/80">
                        {players[other].name} +{settings.bonusPoint}
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={handleBackToBidding}
                    className="mt-4 w-full rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4 text-right text-base font-black text-slate-200 transition hover:bg-white/10"
                  >
                    العودة للمزايدة وتعديل الإعلان
                  </button>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <RoundTimerDisplay
              totalSeconds={settings.time}
              label={isBiddingPhase ? "مؤقت إعلان العدد" : "مؤقت التحدي"}
              onFinish={pauseTimer}
            />

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
              <div className="mb-5 text-right">
                <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                  تحكم المؤقت
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  استخدمه أثناء الإعلان أو أثناء تنفيذ التحدي بحسب سير المزاد.
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  onClick={handleTimerToggle}
                  className="rounded-[1.3rem] bg-emerald-500 px-4 py-4 text-center text-base font-black text-white shadow-[0_18px_40px_rgba(16,185,129,0.28)] transition hover:bg-emerald-400"
                >
                  {timeRunning ? "إيقاف أو متابعة" : "تشغيل"}
                </button>
                <button
                  onClick={pauseTimer}
                  className="rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-4 text-center text-base font-black text-white transition hover:bg-white/10"
                >
                  إيقاف مؤقت
                </button>
                <button
                  onClick={() => resetGlobalTimer(settings.time)}
                  className="rounded-[1.3rem] border border-yellow-300/20 bg-yellow-400/10 px-4 py-4 text-center text-base font-black text-yellow-100 transition hover:bg-yellow-400/15"
                >
                  إعادة 30 ثانية
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
              <div className="mb-5 text-right">
                <div className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-slate-400">
                  بطاقات اللاعبين
                </div>
              </div>

              <div className="grid gap-4">
                {players.map((player, index) => (
                  <article
                    key={index}
                    className={`rounded-[1.6rem] border p-5 ${
                      current === index
                        ? "border-yellow-300/30 bg-yellow-400/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-right">
                        <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                          {current === index
                            ? isBiddingPhase
                              ? "الدور الحالي في الإعلان"
                              : "في التحدي"
                            : "جاهز"}
                        </div>
                        <div className="mt-3 text-2xl font-black text-white">
                          {player.name}
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                          النقاط
                        </div>
                        <div className="mt-2 text-3xl font-black text-white tabular-nums">
                          {player.score}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="rounded-[1.1rem] border border-white/10 bg-slate-950/60 px-4 py-3 text-right">
                        <div className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                          آخر إعلان
                        </div>
                        <div className="mt-2 text-3xl font-black text-yellow-300 tabular-nums">
                          {round2DeclaredByPlayer[index]}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
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
                  <div className="text-sm font-bold text-slate-400">الوضع الحالي</div>
                  <div className="mt-2 text-xl font-black text-white">
                    {isBiddingPhase ? "بانتظار تثبيت المزاد" : `التحدي مع ${players[current].name}`}
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold text-slate-400">آخر نتيجة</div>
                  <div className="mt-2 text-base font-bold text-white">
                    {lastOutcomeLabel}
                  </div>
                </div>
              </div>

            </section>
          </aside>
        </div>

        <OperatorHelpPanel
          accent="yellow"
          shortcuts={[
            { keys: "+ / -", label: "رفع أو خفض العدد الحالي" },
            { keys: "1 / 2", label: "تحديد اللاعب أو بدء التحدي له" },
            { keys: "Space", label: "تشغيل أو إيقاف المؤقت" },
            { keys: "Enter", label: "بدء التحدي أو اعتماد النجاح" },
            { keys: "M / H / R", label: "خطأ / أقل من النصف / عودة للمزايدة" },
          ]}
          tips={[
            "الاختصارات تتوقف تلقائياً أثناء الكتابة داخل موضوع المزاد.",
            "ثبّت العدد أولاً ثم اختر اللاعب الصحيح ليظهر الـ popup مباشرة.",
            "راجع مؤشر الحسم قبل اعتماد النتيجة لتقليل أخطاء المشغّل.",
          ]}
          onPrev={prevRound}
          onNext={nextRound}
        />
      </div>
    </div>
  );
}
