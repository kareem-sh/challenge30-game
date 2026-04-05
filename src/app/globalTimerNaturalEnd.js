import { useGameStore } from "./gameStore";
import { useSettingsStore } from "./settingsStore";

/**
 * Called when the wall-clock deadline for the global timer is reached (setTimeout).
 * Does not check remaining seconds — the timeout is the source of truth.
 */
export function forceGlobalTimerNaturalEndFromDeadline() {
  const game = useGameStore.getState();
  if (!game.timeRunning) return;

  const roundNum = game.roundsOrder[game.roundIndex];
  if (roundNum === 4) return;

  game.pauseTimer();

  const latest = useGameStore.getState();
  if (roundNum === 1) {
    const mistakes = useSettingsStore.getState().round1.mistakes;
    const resolved = latest.players.some((p) => p.strikes >= mistakes);
    if (!resolved && latest.question.trim().length > 0) {
      latest.triggerTimeUpSound();
    }
  }

  latest.bumpGlobalTimerNaturalEnd();
}

/**
 * Fallback when timers are throttled (background tab): remaining hits 0 by wall clock.
 */
export function fireGlobalTimerNaturalEndIfNeeded() {
  const game = useGameStore.getState();
  if (!game.timeRunning) return;
  if (game.roundsOrder[game.roundIndex] === 4) return;
  if (game.getCurrentGlobalTimer() > 0) return;

  forceGlobalTimerNaturalEndFromDeadline();
}
