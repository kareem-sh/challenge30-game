import { useEffect, useState } from "react";
import { useGameStore } from "./gameStore";
import { getCurrentGlobalTimerValue } from "./timerUtils";

export default function useRealtimeGlobalTimer() {
  const globalTimer = useGameStore((s) => s.globalTimer);
  const globalTimerStartedAt = useGameStore((s) => s.globalTimerStartedAt);
  const timeRunning = useGameStore((s) => s.timeRunning);
  const roundIndex = useGameStore((s) => s.roundIndex);
  const roundsOrder = useGameStore((s) => s.roundsOrder);

  const currentRound = roundsOrder[roundIndex];
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (currentRound === 4 || !timeRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [currentRound, globalTimerStartedAt, timeRunning]);

  return getCurrentGlobalTimerValue({
    globalTimer,
    globalTimerStartedAt,
    timeRunning,
    now,
  });
}
