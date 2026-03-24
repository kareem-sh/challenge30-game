import { useNavigate } from "react-router-dom";
import { useGameStore } from "../app/gameStore";
import { useSettingsStore } from "../app/settingsStore";
import { DEFAULT_ROUND_NAMES, ROUND_KEY_BY_NUMBER, getRoundName } from "../app/roundUtils";

const FIELD_ACCENTS = {
  emerald: "focus:border-emerald-500/50",
  cyan: "focus:border-cyan-500/50",
  yellow: "focus:border-yellow-500/50",
  rose: "focus:border-rose-500/50",
  sky: "focus:border-sky-500/50",
};

function FieldCard({ label, value, onChange, min = 0, accent = "emerald" }) {
  return (
    <div className="bg-[#111315] p-6 rounded-3xl border border-white/5 space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`w-full bg-[#0a0b0c] border border-white/5 rounded-xl p-4 font-black text-xl text-white outline-none transition-all ${
          FIELD_ACCENTS[accent] || FIELD_ACCENTS.emerald
        }`}
      />
    </div>
  );
}

function TextFieldCard({ label, value, onChange, accent = "emerald" }) {
  return (
    <div className="bg-[#111315] p-6 rounded-3xl border border-white/5 space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full bg-[#0a0b0c] border border-white/5 rounded-xl p-4 font-black text-xl text-white outline-none transition-all ${
          FIELD_ACCENTS[accent] || FIELD_ACCENTS.emerald
        }`}
      />
    </div>
  );
}

function QuestionsCountCard({ title, count, accent = "emerald", onManage }) {
  const accentStyles = {
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
    yellow: "border-yellow-300/20 bg-yellow-400/10 text-yellow-100",
  };

  return (
    <div className="rounded-[2rem] border border-white/5 bg-[#111315] p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3 text-right">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {title}
          </div>
          <div className="flex items-center justify-end gap-3">
            <span
              className={`rounded-full border px-4 py-2 text-sm font-black ${
                accentStyles[accent] || accentStyles.cyan
              }`}
            >
              {count} سؤال محفوظ
            </span>
            <span className="text-sm font-bold text-slate-400">
              يتم تحديث العدد تلقائياً من بنك الأسئلة
            </span>
          </div>
        </div>

        <button
          onClick={onManage}
          className="rounded-[1.1rem] border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
        >
          إدارة الأسئلة
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const nav = useNavigate();
  const players = useGameStore((s) => s.players);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setOrder = useGameStore((s) => s.setRoundsOrder);
  const currentOrder = useGameStore((s) => s.roundsOrder);
  const settings = useSettingsStore();
  const updateRound = useSettingsStore((s) => s.updateRound);
  const updateRoundName = useSettingsStore((s) => s.updateRoundName);
  const round1QuestionsCount = settings.questionBank.round1.filter(
    (question) => question.trim().length > 0,
  ).length;
  const round2QuestionsCount = settings.questionBank.round2.filter(
    (question) => question.trim().length > 0,
  ).length;

  const moveRound = (index, direction) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= currentOrder.length) {
      return;
    }

    const nextOrder = [...currentOrder];
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[nextIndex];
    nextOrder[nextIndex] = temp;
    setOrder(nextOrder);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 text-right" dir="rtl">
      <div className="flex justify-between items-center border-b pb-8 flex-row-reverse">
        <div>
          <h1 className="text-4xl font-black text-white">إعدادات اللعبة</h1>
          <p className="text-slate-500 font-medium">
            عدّل إعدادات كل جولة ورتّب الجولات بأي تسلسل يناسب برنامجك.
          </p>
        </div>
        <button
          onClick={() => nav("/")}
          className="bg-white/5 text-slate-300 px-8 py-3 rounded-2xl font-black hover:bg-white/10 transition-all border border-white/10"
        >
          العودة للقائمة
        </button>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center text-sm">
            01
          </span>
          أسماء المتسابقين
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {players.map((player, index) => (
            <div
              key={index}
              className="bg-[#111315] p-6 rounded-3xl border border-white/5 space-y-2"
            >
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                اسم المتسابق {index + 1}
              </label>
              <input
                type="text"
                value={player.name}
                onChange={(event) => setPlayerName(index, event.target.value)}
                className="w-full bg-[#0a0b0c] border border-white/5 rounded-xl p-4 font-black text-xl text-white outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center text-sm">
            02
          </span>
          ترتيب الجولات
        </h2>
        <div className="rounded-[2rem] border border-white/5 bg-[#111315] p-6">
          <div className="mb-4 text-sm font-bold text-slate-400">
            حرّك كل جولة للأعلى أو للأسفل حتى تصل للترتيب الذي تريده.
          </div>
          <div className="grid gap-4">
            {currentOrder.map((roundNumber, index) => (
              <div
                key={`${roundNumber}-${index}`}
                className="flex flex-col gap-4 rounded-[1.6rem] border border-white/5 bg-[#0a0b0c] p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    الموضع {index + 1}
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">
                    {getRoundName(settings, roundNumber)}
                  </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                  <button
                    onClick={() => moveRound(index, -1)}
                    disabled={index === 0}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    للأعلى
                  </button>
                  <button
                    onClick={() => moveRound(index, 1)}
                    disabled={index === currentOrder.length - 1}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    للأسفل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-cyan-500/10 text-cyan-500 rounded-lg flex items-center justify-center text-sm">
            03
          </span>
          أسماء الجولات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
          {[1, 2, 3, 4].map((roundNumber) => {
            const roundKey = ROUND_KEY_BY_NUMBER[roundNumber];

            return (
              <TextFieldCard
                key={roundKey}
                label={`اسم الجولة ${roundNumber}`}
                value={settings.roundNames[roundKey] || DEFAULT_ROUND_NAMES[roundKey]}
                onChange={(value) => updateRoundName(roundKey, value)}
                accent="cyan"
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-cyan-500/10 text-cyan-500 rounded-lg flex items-center justify-center text-sm">
            04
          </span>
          إعدادات الجولة الأولى
        </h2>
        <QuestionsCountCard
          title="أسئلة الجولة الأولى"
          count={round1QuestionsCount}
          accent="cyan"
          onManage={() => nav("/questions")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-right">
          <FieldCard
            label="الوقت (ثواني)"
            value={settings.round1.time}
            onChange={(value) => updateRound("round1", { time: value })}
            accent="cyan"
          />
          <FieldCard
            label="حد الأخطاء"
            value={settings.round1.mistakes}
            onChange={(value) => updateRound("round1", { mistakes: value })}
            accent="cyan"
          />
          <FieldCard
            label="نقطة الفوز العادي"
            value={settings.round1.normalPoint}
            onChange={(value) => updateRound("round1", { normalPoint: value })}
            accent="cyan"
          />
          <FieldCard
            label="نقطة الفوز المثالي"
            value={settings.round1.perfectPoint}
            onChange={(value) => updateRound("round1", { perfectPoint: value })}
            accent="cyan"
          />
          <FieldCard
            label="عدد التمريرات لكل لاعب"
            value={settings.round1.passCount}
            onChange={(value) => updateRound("round1", { passCount: value })}
            min={1}
            accent="cyan"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center justify-center text-sm">
            05
          </span>
          إعدادات الجولة الثانية
        </h2>
        <QuestionsCountCard
          title="أسئلة الجولة الثانية"
          count={round2QuestionsCount}
          accent="yellow"
          onManage={() => nav("/questions")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 text-right">
          <FieldCard
            label="الوقت (ثواني)"
            value={settings.round2.time}
            onChange={(value) => updateRound("round2", { time: value })}
            accent="yellow"
          />
          <FieldCard
            label="عدد الأسماء لكل نقطة"
            value={settings.round2.namesForPoint}
            onChange={(value) => updateRound("round2", { namesForPoint: value })}
            accent="yellow"
          />
          <FieldCard
            label="نقطة الخطأ"
            value={settings.round2.normalPoint}
            onChange={(value) => updateRound("round2", { normalPoint: value })}
            accent="yellow"
          />
          <FieldCard
            label="نقطة أقل من النصف"
            value={settings.round2.bonusPoint}
            onChange={(value) => updateRound("round2", { bonusPoint: value })}
            accent="yellow"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center text-sm">
            06
          </span>
          إعدادات الجولة الثالثة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
          <FieldCard
            label="قيمة الزر الأول"
            value={settings.round3.singlePoint}
            onChange={(value) => updateRound("round3", { singlePoint: value })}
            accent="rose"
          />
          <FieldCard
            label="قيمة الزر الثاني"
            value={settings.round3.doublePoint}
            onChange={(value) => updateRound("round3", { doublePoint: value })}
            accent="rose"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3 flex-row-reverse">
          <span className="w-8 h-8 bg-sky-500/10 text-sky-500 rounded-lg flex items-center justify-center text-sm">
            07
          </span>
          إعدادات الجولة الرابعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
          <FieldCard
            label="وقت كل لاعب (ثواني)"
            value={settings.round4.time}
            onChange={(value) => updateRound("round4", { time: value })}
            accent="sky"
          />
        </div>
      </section>

      <div className="bg-gradient-to-br from-purple-900/40 to-black rounded-[40px] p-12 text-center text-white space-y-6 shadow-2xl border border-white/5">
        <h3 className="text-3xl font-black italic tracking-tighter">جاهز للانطلاق؟</h3>
        <p className="text-slate-400 font-medium italic">
          يتم حفظ جميع التعديلات تلقائياً في المتصفح.
        </p>
        <button
          onClick={() => nav("/")}
          className="w-full max-w-sm bg-white text-black py-5 rounded-[24px] font-black text-2xl hover:scale-105 transition-all shadow-xl uppercase italic"
        >
          حفظ وإغلاق
        </button>
      </div>
    </div>
  );
}
