export function getCurrentGlobalTimerValue({
  globalTimer,
  globalTimerStartedAt,
  timeRunning,
  now = Date.now(),
}) {
  if (!timeRunning || !globalTimerStartedAt) {
    return Math.max(0, globalTimer);
  }

  const elapsedSeconds = Math.floor((now - globalTimerStartedAt) / 1000);
  return Math.max(0, globalTimer - elapsedSeconds);
}
