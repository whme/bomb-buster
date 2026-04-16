import { useGameContext } from "../../contexts/GameContext";

export function GameSettings() {
  const { game } = useGameContext();

  if (!game) return null;

  return (
    <div className="rounded-xl bg-gray-800 p-6">
      <h2 className="mb-4 text-lg font-semibold">Game Settings</h2>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Red Wires</span>
          <span className="font-mono text-sm">{game.red_wire_count}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Yellow Wires</span>
          <span className="font-mono text-sm">{game.yellow_wire_count}</span>
        </div>
      </div>
    </div>
  );
}
