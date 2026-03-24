import Timer from "./Timer";
import { useGameStore } from "../app/gameStore";
import useRealtimeGlobalTimer from "../app/useRealtimeGlobalTimer";

export default function RoundTimerDisplay({
  totalSeconds,
  onFinish,
  compact = false,
  label = "الوقت المتبقي",
}) {
  const timeRunning = useGameStore((s) => s.timeRunning);
  const currentTime = useRealtimeGlobalTimer();

  const clampedTotal = Math.max(totalSeconds || 1, 1);
  const progress = Math.min((currentTime / clampedTotal) * 100, 100);
  const urgency = currentTime <= Math.max(Math.ceil(clampedTotal * 0.35), 3);

  return (
    <div
      className={[
        "rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur-xl",
        compact ? "p-5 md:p-6" : "p-6 md:p-8",
      ].join(" ")}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="text-right">
          <div className="text-[0.65rem] font-black uppercase tracking-[0.35em] text-slate-400">
            {label}
          </div>
          <div className="mt-2 text-sm font-medium text-slate-500">
            {timeRunning ? "العدّاد يعمل الآن" : "موقوف مؤقتاً"}
          </div>
        </div>

        <div
          className={[
            "rounded-full px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.3em]",
            timeRunning
              ? urgency
                ? "bg-rose-500/15 text-rose-300"
                : "bg-emerald-500/15 text-emerald-300"
              : "bg-white/5 text-slate-400",
          ].join(" ")}
        >
          {timeRunning ? "LIVE" : "PAUSE"}
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="text-right">
          <Timer
            onFinish={onFinish}
            warningThreshold={Math.max(Math.ceil(clampedTotal * 0.35), 3)}
            className={[
              "block tabular-nums font-black tracking-[-0.05em] leading-none",
              compact ? "text-[clamp(2.8rem,7vw,5rem)]" : "text-[clamp(4rem,10vw,8rem)]",
            ].join(" ")}
          />
        </div>

        <div className="w-full max-w-xl lg:w-[52%]">
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{currentTime} ث</span>
            <span>{clampedTotal} ث</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <div
              className={[
                "ml-auto h-full rounded-full transition-[width,background] duration-700",
                urgency
                  ? "bg-gradient-to-l from-rose-400 via-amber-300 to-yellow-200"
                  : "bg-gradient-to-l from-cyan-400 via-sky-300 to-emerald-300",
              ].join(" ")}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
