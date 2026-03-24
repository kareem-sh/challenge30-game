import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGameStore = create(
  persist(
    (set, get) => ({
      players: [
        { name: "المتسابق ١", score: 0, strikes: 0, time: 120 },
        { name: "المتسابق ٢", score: 0, strikes: 0, time: 120 },
      ],

      currentPlayer: 0,
      question: "",
      roundIndex: 0,
      roundsOrder: [1, 2, 3, 4],
      timeRunning: false,
      isRoundActive: false,
      isQuestionStarted: false, // For the "Start Question" button
      globalTimer: 8, // Unified timer for R1-R3
      auctionValue: 0,
      showAuction: false,
      mistakeTrigger: 0,
      biddingValue: 0,

      setPlayerName: (index, name) => {
        const players = [...get().players];
        players[index].name = name;
        set({ players });
      },

      setBiddingValue: (val) => set({ biddingValue: val }),
      startRound: () => set({ isRoundActive: true, isQuestionStarted: false }),
      
      startQuestion: (initialTime) => set({ 
        isQuestionStarted: true, 
        timeRunning: true, 
        globalTimer: initialTime 
      }),

      triggerMistakeSound: () => set({ mistakeTrigger: get().mistakeTrigger + 1 }),

      setAuction: (val) => set({ auctionValue: val, showAuction: true }),
      hideAuction: () => set({ showAuction: false }),

      setQuestion: (q) => set({ question: q, isQuestionStarted: false }),

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
        const players = get().players.map((p) => ({ ...p, strikes: 0 }));
        set({ players });
      },

      switchPlayer: () => {
        set({ currentPlayer: get().currentPlayer === 0 ? 1 : 0 });
      },

      setCurrentPlayer: (idx) => set({ currentPlayer: idx }),

      setRoundIndex: (idx) => set({ 
        roundIndex: idx, 
        isRoundActive: false, 
        isQuestionStarted: false, 
        question: "" 
      }),

      nextRound: () => {
        set({
          roundIndex: get().roundIndex + 1,
          isRoundActive: false,
          isQuestionStarted: false,
          question: ""
        });
        get().resetStrikes();
      },

      prevRound: () => {
        set({
          roundIndex: Math.max(0, get().roundIndex - 1),
          isRoundActive: false,
          isQuestionStarted: false,
          question: ""
        });
        get().resetStrikes();
      },

      setRoundsOrder: (order) => set({ roundsOrder: order }),

      startTimer: () => set({ timeRunning: true }),
      pauseTimer: () => set({ timeRunning: false }),
      setGlobalTimer: (val) => set({ globalTimer: val }),

      tick: () => {
        const state = get();
        if (!state.timeRunning) return;

        const currentRoundNum = state.roundsOrder[state.roundIndex];

        if (currentRoundNum === 4) {
          // Chess clock logic
          const p = [...state.players];
          if (p[state.currentPlayer].time > 0) {
            p[state.currentPlayer].time -= 1;
            set({ players: p });
          } else {
            set({ timeRunning: false });
          }
        } else {
          // Global timer logic (R1, R2)
          if (state.globalTimer > 0) {
            set({ globalTimer: state.globalTimer - 1 });
          } else {
            set({ timeRunning: false });
          }
        }
      },

      resetTimes: (time) => {
        const players = get().players.map((p) => ({ ...p, time }));
        set({ players });
      },

      resetQuestion: () => {
        set({
          question: "",
          timeRunning: false,
          isQuestionStarted: false,
          globalTimer: 8
        });
        get().resetStrikes();
      },

      resetGame: () => {
        const currentPlayers = get().players;
        set({
          players: currentPlayers.map(p => ({ ...p, score: 0, strikes: 0, time: 120 })),
          currentPlayer: 0,
          question: "",
          roundIndex: 0,
          isRoundActive: false,
          isQuestionStarted: false,
          timeRunning: false,
          globalTimer: 8
        });
      },
    }),
    {
      name: "challenge30-game",
    },
  ),
);

// Real-time synchronization
if (typeof window !== "undefined") {
  const channel = new BroadcastChannel("challenge30_sync");
  channel.onmessage = () => useGameStore.persist.rehydrate();
  useGameStore.subscribe(() => channel.postMessage("sync"));

  // Global Tick
  setInterval(() => {
    useGameStore.getState().tick();
  }, 1000);
}
