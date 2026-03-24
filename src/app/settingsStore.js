import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_ROUND_NAMES } from "./roundUtils";

const defaultSettingsState = {
  roundNames: DEFAULT_ROUND_NAMES,

  round1: {
    time: 8,
    mistakes: 3,
    questionsCount: 3,
    normalPoint: 1,
    perfectPoint: 2,
    passCount: 1,
  },

  round2: {
    time: 30,
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
          round1: {
            ...currentState.round1,
            ...(persisted.round1 || {}),
          },
          round2: {
            ...currentState.round2,
            ...(persisted.round2 || {}),
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
