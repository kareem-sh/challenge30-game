import React from "react";
import { useGameStore } from "../app/gameStore";

export default function Timer({ playerIndex = null }) {
  const globalTimer = useGameStore((s) => s.globalTimer);
  const players = useGameStore((s) => s.players);
  const roundIndex = useGameStore((s) => s.roundIndex);
  const roundsOrder = useGameStore((s) => s.roundsOrder);
  
  const currentRound = roundsOrder[roundIndex];

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // If playerIndex is provided (Round 4 Chess Clock)
  if (currentRound === 4 && playerIndex !== null) {
    const time = players[playerIndex].time;
    return (
      <span className={time < 10 ? "text-red-500 animate-pulse" : ""}>
        {formatTime(time)}
      </span>
    );
  }

  // Default: Global Timer (Round 1, 2, 3)
  return (
    <span className={globalTimer < 5 ? "text-red-500 animate-pulse" : ""}>
      {formatTime(globalTimer)}
    </span>
  );
}
