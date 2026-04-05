import { useEffect, useState } from "react";
import { useGameStore } from "../app/gameStore";
import { forceGlobalTimerNaturalEndFromDeadline } from "../app/globalTimerNaturalEnd";

/**
 * Schedules the global countdown end at an exact wall-clock instant (no polling delay).
 * Remounted on tab focus so deadlines stay correct after background throttling.
 */
export default function GlobalTimerDeadlineScheduler() {
  const timeRunning = useGameStore((s) => s.timeRunning);
  const globalTimerStartedAt = useGameStore((s) => s.globalTimerStartedAt);
  const globalTimer = useGameStore((s) => s.globalTimer);
  const roundIndex = useGameStore((s) => s.roundIndex);
  const roundsOrder = useGameStore((s) => s.roundsOrder);
  const [wakeSeq, setWakeSeq] = useState(0);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setWakeSeq((n) => n + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    const round = roundsOrder[roundIndex];
    if (round === 4 || !timeRunning || !globalTimerStartedAt || globalTimer <= 0) {
      return undefined;
    }

    const deadline = globalTimerStartedAt + globalTimer * 1000;
    const ms = deadline - Date.now();
    if (ms <= 0) {
      forceGlobalTimerNaturalEndFromDeadline();
      return undefined;
    }

    const id = window.setTimeout(forceGlobalTimerNaturalEndFromDeadline, ms);
    return () => window.clearTimeout(id);
  }, [
    globalTimer,
    globalTimerStartedAt,
    roundIndex,
    roundsOrder,
    timeRunning,
    wakeSeq,
  ]);

  return null;
}
