const ACCENT_STYLES = {
  cyan: {
    badge: "text-cyan-200/80",
    card: "border-cyan-300/15 bg-cyan-400/10 shadow-[0_20px_60px_rgba(34,211,238,0.12)]",
    key: "border-cyan-300/20 bg-cyan-400/12 text-cyan-100",
    note: "border-cyan-300/15 bg-white/5 text-slate-200",
    next: "hover:bg-cyan-100",
  },
  yellow: {
    badge: "text-yellow-200/80",
    card: "border-yellow-300/15 bg-yellow-400/10 shadow-[0_20px_60px_rgba(250,204,21,0.1)]",
    key: "border-yellow-300/20 bg-yellow-400/12 text-yellow-100",
    note: "border-yellow-300/15 bg-white/5 text-slate-200",
    next: "hover:bg-yellow-100",
  },
  rose: {
    badge: "text-rose-200/80",
    card: "border-rose-300/15 bg-rose-400/10 shadow-[0_20px_60px_rgba(244,63,94,0.12)]",
    key: "border-rose-300/20 bg-rose-400/12 text-rose-100",
    note: "border-rose-300/15 bg-white/5 text-slate-200",
    next: "hover:bg-rose-100",
  },
};

export default function OperatorHelpPanel({
  accent = "cyan",
  shortcuts = [],
  tips = [],
  onPrev,
  onNext,
  nextLabel = "الجولة التالية",
}) {
  const tone = ACCENT_STYLES[accent] || ACCENT_STYLES.cyan;

  return (
    <section
      className={`rounded-[2rem] border p-5 backdrop-blur-xl md:p-7 ${tone.card}`}
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1 text-right">
          <div className={`text-[0.7rem] font-black uppercase tracking-[0.35em] ${tone.badge}`}>
            اختصارات وتلميحات
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shortcuts.map((shortcut) => (
              <div
                key={`${shortcut.keys}-${shortcut.label}`}
                className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-right"
              >
                <div
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.25em] ${tone.key}`}
                >
                  {shortcut.keys}
                </div>
                <div className="mt-3 text-base font-black text-white">{shortcut.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-xl space-y-4">
          <div className="text-right text-sm font-black text-white">نصائح تشغيل</div>
          <div className="grid gap-3">
            {tips.map((tip) => (
              <div
                key={tip}
                className={`rounded-[1.3rem] border px-4 py-4 text-right text-sm font-bold ${tone.note}`}
              >
                {tip}
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={onPrev}
              className="rounded-[1.3rem] border border-white/10 bg-white/5 px-5 py-4 text-lg font-black text-white transition hover:bg-white/10"
            >
              الجولة السابقة
            </button>
            <button
              onClick={onNext}
              className={`rounded-[1.3rem] bg-white px-5 py-4 text-lg font-black text-slate-950 transition ${tone.next}`}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
