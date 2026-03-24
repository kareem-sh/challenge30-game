import { useGameStore } from "../app/gameStore";

export default function Score() {
  const players = useGameStore((s) => s.players);

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        fontSize: 22,
        marginBottom: 20,
      }}
    >
      {players.map((p, i) => (
        <div key={i}>
          {p.name} — {p.score}
        </div>
      ))}
    </div>
  );
}
