import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_ROUND_NAMES } from "./roundUtils";

const defaultQuestionBank = {
  round1: [
    "رفاق ميسي الذين فازوا بدوري أبطال أوروبا معه",
    "منتخبات فازت بكأس العالم",
    "لاعبون فازوا بالكرة الذهبية",
  ],
  round2: [
    "لاعبون فازوا بدوري أبطال أوروبا",
    "منتخبات فازت بكأس آسيا",
    "أندية فازت بالدوري الإنجليزي الممتاز",
  ],
};

const getFilledQuestionsCount = (questions = []) =>
  questions.filter((question) => question.trim().length > 0).length;

const defaultSettingsState = {
  roundNames: DEFAULT_ROUND_NAMES,
  questionBank: defaultQuestionBank,

  round1: {
    time: 8,
    mistakes: 3,
    questionsCount: getFilledQuestionsCount(defaultQuestionBank.round1),
    normalPoint: 1,
    perfectPoint: 2,
    passCount: 1,
  },

  round2: {
    time: 30,
    questionsCount: getFilledQuestionsCount(defaultQuestionBank.round2),
    namesForPoint: 10,
    normalPoint: 1,
    bonusPoint: 2,
  },

  round3: {
    singlePoint: 1,
    doublePoint: 2,
  },

  round4: {
    time: 120,
  },
};

export const useSettingsStore = create(
  persist(
    (set) => ({
      ...defaultSettingsState,

      updateRound: (roundKey, newValues) =>
        set((state) => ({
          [roundKey]: {
            ...state[roundKey],
            ...newValues,
          },
        })),

      updateRoundName: (roundKey, name) =>
        set((state) => ({
          roundNames: {
            ...state.roundNames,
            [roundKey]: name,
          },
        })),

      setQuestionsForRound: (roundKey, questions) =>
        set((state) => {
          const normalizedQuestions = questions.map((question) => question ?? "");
          const questionsCount = getFilledQuestionsCount(normalizedQuestions);

          return {
            questionBank: {
              ...state.questionBank,
              [roundKey]: normalizedQuestions,
            },
            ...(roundKey === "round1"
              ? {
                  round1: {
                    ...state.round1,
                    questionsCount,
                  },
                }
              : {}),
            ...(roundKey === "round2"
              ? {
                  round2: {
                    ...state.round2,
                    questionsCount,
                  },
                }
              : {}),
          };
        }),
    }),
    {
      name: "challenge30-settings",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState || {};

        return {
          ...currentState,
          ...persisted,
          roundNames: {
            ...currentState.roundNames,
            ...(persisted.roundNames || {}),
          },
          questionBank: {
            ...currentState.questionBank,
            ...(persisted.questionBank || {}),
          },
          round1: {
            ...currentState.round1,
            ...(persisted.round1 || {}),
            questionsCount: getFilledQuestionsCount(
              (persisted.questionBank || {}).round1 || currentState.questionBank.round1,
            ),
          },
          round2: {
            ...currentState.round2,
            ...(persisted.round2 || {}),
            questionsCount: getFilledQuestionsCount(
              (persisted.questionBank || {}).round2 || currentState.questionBank.round2,
            ),
          },
          round3: {
            ...currentState.round3,
            ...(persisted.round3 || {}),
          },
          round4: {
            ...currentState.round4,
            ...(persisted.round4 || {}),
          },
        };
      },
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === useSettingsStore.persist.getOptions().name) {
      useSettingsStore.persist.rehydrate();
    }
  });
}
