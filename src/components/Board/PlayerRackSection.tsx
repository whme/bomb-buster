import type { GamePlayer, GameRack, GameTile } from "../../types/game";
import { TileRack } from "../TileRack/TileRack";

interface PlayerRackSectionProps {
  player: GamePlayer;
  racks: GameRack[];
  tilesByRack: Map<string, GameTile[]>;
  isCurrentPlayer: boolean;
  isActiveTurn: boolean;
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
}

export function PlayerRackSection({
  player,
  racks,
  tilesByRack,
  isCurrentPlayer,
  isActiveTurn,
  selectedTileId,
  onSelectTile,
}: PlayerRackSectionProps) {
  const sortedRacks = [...racks].sort((a, b) => a.rack_index - b.rack_index);

  return (
    <div
      className={`rounded-xl bg-gray-800 p-4 ${isActiveTurn ? "ring-2 ring-amber-400" : ""}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-semibold">{player.display_name}</span>
        {isCurrentPlayer && (
          <span className="text-xs text-gray-500">You</span>
        )}
        {isActiveTurn && (
          <span className="rounded bg-amber-600/30 px-2 py-0.5 text-xs text-amber-300">
            Active Turn
          </span>
        )}
      </div>
      <div className="space-y-2">
        {sortedRacks.map((rack) => (
          <TileRack
            key={rack.id}
            tiles={tilesByRack.get(rack.id) ?? []}
            selectedTileId={selectedTileId}
            isOwnRack={isCurrentPlayer}
            onSelectTile={onSelectTile}
          />
        ))}
      </div>
    </div>
  );
}
