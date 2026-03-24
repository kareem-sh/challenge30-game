export default function PassMeter({
  used = false,
  variant = "operator",
}) {
  const isAudience = variant === "audience";

  return (
    <div className="flex items-center gap-3 flex-row-reverse">
      <div
        className={[
          "transition-all duration-500 rounded-full",
          isAudience
            ? "w-10 h-10 md:w-14 md:h-14 border-[4px] md:border-[6px]"
            : "w-10 h-10 border-[4px]",
          used
            ? "bg-slate-900 border-amber-300/40 opacity-60"
            : "bg-yellow-400 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.65)] scale-110",
        ].join(" ")}
      />
    </div>
  );
}
