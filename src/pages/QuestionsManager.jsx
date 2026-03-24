import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../app/settingsStore";
import { getRoundName } from "../app/roundUtils";

function QuestionEditorSection({
  roundNumber,
  roundKey,
  accent,
  title,
  description,
  questions,
  onQuestionChange,
  onAddQuestion,
  onRemoveQuestion,
}) {
  const filledCount = questions.filter((question) => question.trim().length > 0).length;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-7">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3 text-right">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <span
              className={`rounded-full border px-4 py-2 text-[0.7rem] font-black text-white ${
                accent === "cyan"
                  ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-100"
                  : "border-yellow-300/25 bg-yellow-400/10 text-yellow-100"
              }`}
            >
              الجولة {roundNumber}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
              {filledCount} سؤال محفوظ
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">{title}</h2>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <button
          onClick={() => onAddQuestion(roundKey)}
          className={`rounded-[1.2rem] px-6 py-4 text-base font-black text-slate-950 transition hover:scale-[1.02] ${
            accent === "cyan"
              ? "bg-cyan-300 hover:bg-cyan-200"
              : "bg-yellow-300 hover:bg-yellow-200"
          }`}
        >
          إضافة سؤال جديد
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {questions.map((question, index) => (
          <div
            key={`${roundKey}-${index}`}
            className="rounded-[1.6rem] border border-white/10 bg-[#0b0f15] p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <button
                onClick={() => onRemoveQuestion(roundKey, index)}
                disabled={questions.length === 1}
                className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-2 text-sm font-black text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                حذف
              </button>
              <div className="text-sm font-black text-slate-400">السؤال {index + 1}</div>
            </div>

            <textarea
              value={question}
              onChange={(event) => onQuestionChange(roundKey, index, event.target.value)}
              placeholder="اكتب نص السؤال أو موضوع التحدي هنا"
              rows={3}
              className="min-h-[112px] w-full resize-y rounded-[1.2rem] border border-white/10 bg-slate-950 px-4 py-4 text-lg font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-white/20"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function QuestionsManager() {
  const nav = useNavigate();
  const settings = useSettingsStore();
  const setQuestionsForRound = useSettingsStore((s) => s.setQuestionsForRound);
  const round1Questions = settings.questionBank?.round1 || [""];
  const round2Questions = settings.questionBank?.round2 || [""];

  const updateQuestion = (roundKey, index, value) => {
    const source = roundKey === "round1" ? round1Questions : round2Questions;
    const nextQuestions = [...source];
    nextQuestions[index] = value;
    setQuestionsForRound(roundKey, nextQuestions);
  };

  const addQuestion = (roundKey) => {
    const source = roundKey === "round1" ? round1Questions : round2Questions;
    setQuestionsForRound(roundKey, [...source, ""]);
  };

  const removeQuestion = (roundKey, index) => {
    const source = roundKey === "round1" ? round1Questions : round2Questions;
    const nextQuestions = source.filter((_, questionIndex) => questionIndex !== index);
    setQuestionsForRound(roundKey, nextQuestions.length ? nextQuestions : [""]);
  };

  return (
    <div
      className="relative mx-auto min-h-[calc(100svh-7rem)] w-full max-w-[1800px] overflow-hidden px-4 py-6 md:px-8 md:py-8 xl:px-10"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-14%] left-[-8%] h-[28rem] w-[28rem] rounded-full bg-yellow-400/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.55),_transparent_40%),linear-gradient(135deg,rgba(2,6,23,0.96),rgba(15,23,42,0.84))]" />
      </div>

      <div className="relative z-10 space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4 text-right">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
                  العدد يتحدّث تلقائياً في شاشة الإعدادات
                </span>
              </div>
              <div>
                <h1 className="text-[clamp(2.2rem,4vw,4.8rem)] font-black tracking-tight text-white">
                  إدارة أسئلة الجولات
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  أضف أسئلة {getRoundName(settings, 1)} و{getRoundName(settings, 2)} من مكان
                  واحد. عدد الأسئلة في الإعدادات يُحسب تلقائياً من الأسئلة غير الفارغة.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => nav("/settings")}
                className="rounded-[1.2rem] border border-white/10 bg-white/5 px-6 py-4 text-base font-black text-white transition hover:bg-white/10"
              >
                العودة إلى الإعدادات
              </button>
              <button
                onClick={() => nav("/")}
                className="rounded-[1.2rem] bg-white px-6 py-4 text-base font-black text-slate-950 transition hover:scale-[1.02]"
              >
                الرئيسية
              </button>
            </div>
          </div>
        </section>

        <QuestionEditorSection
          roundNumber={1}
          roundKey="round1"
          accent="cyan"
          title={getRoundName(settings, 1)}
          description="أدخل موضوعات أسئلة الأسماء التي ستستخدمها أثناء الجولة. كل سطر يمثل سؤالاً مستقلاً يمكن للمشغّل اعتماده لاحقاً."
          questions={round1Questions}
          onQuestionChange={updateQuestion}
          onAddQuestion={addQuestion}
          onRemoveQuestion={removeQuestion}
        />

        <QuestionEditorSection
          roundNumber={2}
          roundKey="round2"
          accent="yellow"
          title={getRoundName(settings, 2)}
          description="أدخل موضوعات المزاد التي سيبني عليها اللاعبون أرقامهم المعلنة. الأسئلة غير الفارغة فقط تُحتسب ضمن العدد."
          questions={round2Questions}
          onQuestionChange={updateQuestion}
          onAddQuestion={addQuestion}
          onRemoveQuestion={removeQuestion}
        />
      </div>
    </div>
  );
}
