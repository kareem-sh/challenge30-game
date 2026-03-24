export default function StrikeMeter({
  strikes = 0,
  maxStrikes = 3,
  variant = "operator",
}) {
  const isAudience = variant === "audience";

  return (
    <div className="flex items-center gap-3 flex-row-reverse">
      {Array.from({ length: maxStrikes }).map((_, index) => {
        const active = index < strikes;

        return (
          <div
            key={index}
            className={[
              "relative overflow-hidden transition-all duration-500",
              isAudience
                ? "h-5 w-14 rounded-full border-2 md:h-6 md:w-20"
                : "h-4 flex-1 rounded-full border",
              active
                ? "border-rose-300 bg-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.55)]"
                : "border-white/10 bg-white/5",
            ].join(" ")}
          >
            <div
              className={[
                "absolute inset-y-0 right-0 rounded-full bg-gradient-to-l transition-all duration-500",
                active
                  ? "from-rose-200/90 via-rose-300/60 to-transparent"
                  : "from-transparent to-transparent",
                isAudience ? "w-1/2" : "w-2/3",
              ].join(" ")}
            />
          </div>
        );
      })}
    </div>
  );
}
