import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      round1: {
        time: 8,
        mistakes: 3,
        questionsCount: 3,
        normalPoint: 1,
        perfectPoint: 2,
      },

      round2: {
        time: 30,
        namesForPoint: 10,
        normalPoint: 1,
        bonusPoint: 2,
      },

      round4: {
        time: 120,
      },

      updateRound: (roundKey, newValues) =>
        set((state) => ({
          [roundKey]: {
            ...state[roundKey],
            ...newValues,
          },
        })),
    }),
    {
      name: "challenge30-settings",
      storage: createJSONStorage(() => localStorage),
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
