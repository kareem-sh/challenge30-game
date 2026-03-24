import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCurrentGlobalTimerValue } from "./timerUtils";

export const useGameStore = create(
  persist(
    (set, get) => ({
      players: [
        { name: "المتسابق ١", score: 0, strikes: 0, time: 120 },
        { name: "المتسابق ٢", score: 0, strikes: 0, time: 120 },
      ],

      currentPlayer: 0,
      question: "",
      round1QuestionIndex: 1,
      round1PassUsed: [false, false],
      roundIndex: 0,
      roundsOrder: [1, 2, 3, 4],
      timeRunning: false,
      isRoundActive: false,
      isQuestionStarted: false,
      globalTimer: 8,
      globalTimerStartedAt: null,
      auctionValue: 0,
      showAuction: false,
      auctionPlayerIndex: null,
      mistakeTrigger: 0,
      lastMistakePlayer: null,
      biddingValue: 0,
      round2Phase: "bidding",
      round2DeclaredValue: 0,
      round2CorrectCount: 0,
      round2DeclaredByPlayer: [0, 0],
      round2LastOutcome: null,

      getCurrentGlobalTimer: () =>
        getCurrentGlobalTimerValue({
          globalTimer: get().globalTimer,
          globalTimerStartedAt: get().globalTimerStartedAt,
          timeRunning: get().timeRunning,
        }),

      setPlayerName: (index, name) => {
        const players = [...get().players];
        players[index].name = name;
        set({ players });
      },

      setBiddingValue: (val) => set({ biddingValue: val }),
      startRound: () => set({ isRoundActive: true, isQuestionStarted: false }),

      startQuestion: (initialTime) =>
        set({
          isQuestionStarted: true,
          timeRunning: true,
          globalTimer: initialTime,
          globalTimerStartedAt: Date.now(),
        }),

      triggerMistakeSound: (player = get().currentPlayer) =>
        set({
          mistakeTrigger: get().mistakeTrigger + 1,
          lastMistakePlayer: player,
        }),

      setAuction: (val, playerIndex = get().currentPlayer) =>
        set({
          auctionValue: val,
          showAuction: true,
          auctionPlayerIndex: playerIndex,
        }),
      hideAuction: () => set({ showAuction: false }),

      setQuestion: (q) => set({ question: q, isQuestionStarted: false }),
      setRound1QuestionIndex: (value) => set({ round1QuestionIndex: value }),
      setRound2Phase: (phase) => set({ round2Phase: phase }),
      setRound2DeclaredValue: (value) => set({ round2DeclaredValue: Math.max(0, value) }),
      setRound2CorrectCount: (value) => set({ round2CorrectCount: Math.max(0, value) }),
      setRound2PlayerDeclaration: (playerIndex, value) => {
        const round2DeclaredByPlayer = [...get().round2DeclaredByPlayer];
        round2DeclaredByPlayer[playerIndex] = Math.max(0, value);
        set({ round2DeclaredByPlayer });
      },
      setRound2LastOutcome: (outcome) => set({ round2LastOutcome: outcome }),
      resetRound2State: ({ clearDeclarations = false } = {}) =>
        set((state) => ({
          round2Phase: "bidding",
          round2DeclaredValue: 0,
          round2CorrectCount: 0,
          round2LastOutcome: null,
          showAuction: false,
          auctionValue: 0,
          auctionPlayerIndex: null,
          round2DeclaredByPlayer: clearDeclarations
            ? [0, 0]
            : state.round2DeclaredByPlayer,
        })),
      markRound1PassUsed: (playerIndex) => {
        const round1PassUsed = [...get().round1PassUsed];
        round1PassUsed[playerIndex] = true;
        set({ round1PassUsed });
      },
      resetRound1Passes: () => set({ round1PassUsed: [false, false] }),

      addScore: (player, pts) => {
        const players = [...get().players];
        players[player].score += pts;
        set({ players });
      },

      addStrike: (player) => {
        const players = [...get().players];
        players[player].strikes += 1;
        set({ players });
      },

      resetStrikes: () => {
        const players = get().players.map((player) => ({ ...player, strikes: 0 }));
        set({ players });
      },

      switchPlayer: () => {
        set({ currentPlayer: get().currentPlayer === 0 ? 1 : 0 });
      },

      setCurrentPlayer: (idx) => set({ currentPlayer: idx }),

      setRoundIndex: (idx) =>
        set({
          roundIndex: idx,
          isRoundActive: false,
          isQuestionStarted: false,
          question: "",
          round1QuestionIndex: 1,
          round1PassUsed: [false, false],
          round2Phase: "bidding",
          round2DeclaredValue: 0,
          round2CorrectCount: 0,
          round2DeclaredByPlayer: [0, 0],
          round2LastOutcome: null,
          auctionValue: 0,
          showAuction: false,
          auctionPlayerIndex: null,
          lastMistakePlayer: null,
          timeRunning: false,
          globalTimerStartedAt: null,
        }),

      nextRound: () => {
        set({
          roundIndex: get().roundIndex + 1,
          isRoundActive: false,
          isQuestionStarted: false,
          question: "",
          round1QuestionIndex: 1,
          round1PassUsed: [false, false],
          round2Phase: "bidding",
          round2DeclaredValue: 0,
          round2CorrectCount: 0,
          round2DeclaredByPlayer: [0, 0],
          round2LastOutcome: null,
          auctionValue: 0,
          showAuction: false,
          auctionPlayerIndex: null,
          lastMistakePlayer: null,
          timeRunning: false,
          globalTimerStartedAt: null,
        });
        get().resetStrikes();
      },

      prevRound: () => {
        set({
          roundIndex: Math.max(0, get().roundIndex - 1),
          isRoundActive: false,
          isQuestionStarted: false,
          question: "",
          round1QuestionIndex: 1,
          round1PassUsed: [false, false],
          round2Phase: "bidding",
          round2DeclaredValue: 0,
          round2CorrectCount: 0,
          round2DeclaredByPlayer: [0, 0],
          round2LastOutcome: null,
          auctionValue: 0,
          showAuction: false,
          auctionPlayerIndex: null,
          lastMistakePlayer: null,
          timeRunning: false,
          globalTimerStartedAt: null,
        });
        get().resetStrikes();
      },

      setRoundsOrder: (order) => set({ roundsOrder: order }),

      startTimer: () => {
        const state = get();
        const currentRoundNum = state.roundsOrder[state.roundIndex];

        if (state.timeRunning) return;

        if (currentRoundNum === 4) {
          set({ timeRunning: true });
          return;
        }

        const remaining = state.getCurrentGlobalTimer();

        set({
          timeRunning: remaining > 0,
          globalTimer: remaining,
          globalTimerStartedAt: remaining > 0 ? Date.now() : null,
        });
      },

      restartGlobalTimer: (seconds) => {
        const nextValue = Math.max(0, seconds);
        const currentRoundNum = get().roundsOrder[get().roundIndex];

        if (currentRoundNum === 4) {
          set({ timeRunning: nextValue > 0 });
          return;
        }

        set({
          timeRunning: nextValue > 0,
          globalTimer: nextValue,
          globalTimerStartedAt: nextValue > 0 ? Date.now() : null,
        });
      },

      resetGlobalTimer: (seconds) => {
        const nextValue = Math.max(0, seconds);

        set({
          timeRunning: false,
          globalTimer: nextValue,
          globalTimerStartedAt: null,
        });
      },

      pauseTimer: () => {
        const state = get();
        const currentRoundNum = state.roundsOrder[state.roundIndex];

        if (currentRoundNum === 4) {
          set({ timeRunning: false });
          return;
        }

        set({
          timeRunning: false,
          globalTimer: state.getCurrentGlobalTimer(),
          globalTimerStartedAt: null,
        });
      },

      setGlobalTimer: (val) => {
        const nextValue = Math.max(0, val);
        const currentRoundNum = get().roundsOrder[get().roundIndex];

        if (currentRoundNum === 4) {
          set({ globalTimer: nextValue });
          return;
        }

        set((state) => ({
          globalTimer: nextValue,
          globalTimerStartedAt: state.timeRunning && nextValue > 0 ? Date.now() : null,
        }));
      },

      tick: () => {
        const state = get();
        if (!state.timeRunning) return;

        const currentRoundNum = state.roundsOrder[state.roundIndex];

        if (currentRoundNum !== 4) return;

        const players = [...state.players];

        if (players[state.currentPlayer].time > 0) {
          players[state.currentPlayer].time -= 1;
          set({ players });
          return;
        }

        set({ timeRunning: false });
      },

      resetTimes: (time) => {
        const players = get().players.map((player) => ({ ...player, time }));
        set({ players });
      },

      resetQuestion: (initialTime = 8) => {
        set({
          question: "",
          timeRunning: false,
          isQuestionStarted: false,
          globalTimer: initialTime,
          globalTimerStartedAt: null,
          round1PassUsed: [false, false],
          round2Phase: "bidding",
          round2DeclaredValue: 0,
          round2CorrectCount: 0,
          round2LastOutcome: null,
          auctionValue: 0,
          showAuction: false,
          auctionPlayerIndex: null,
          lastMistakePlayer: null,
        });
        get().resetStrikes();
      },

      resetGame: () => {
        const currentPlayers = get().players;
        set({
          players: currentPlayers.map((player) => ({
            ...player,
            score: 0,
            strikes: 0,
            time: 120,
          })),
          currentPlayer: 0,
          question: "",
          round1QuestionIndex: 1,
          round1PassUsed: [false, false],
          round2Phase: "bidding",
          round2DeclaredValue: 0,
          round2CorrectCount: 0,
          round2DeclaredByPlayer: [0, 0],
          round2LastOutcome: null,
          auctionValue: 0,
          showAuction: false,
          auctionPlayerIndex: null,
          roundIndex: 0,
          isRoundActive: false,
          isQuestionStarted: false,
          timeRunning: false,
          globalTimer: 8,
          globalTimerStartedAt: null,
          lastMistakePlayer: null,
        });
      },
    }),
    {
      name: "challenge30-game",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === useGameStore.persist.getOptions().name) {
      useGameStore.persist.rehydrate();
    }
  });
}
