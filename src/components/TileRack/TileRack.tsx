import type { GameTile, WireType } from "../../types/game";
import { Tile } from "./Tile";

const WIRE_TYPE_OFFSET: Record<WireType, number> = { blue: 0, yellow: 0.1, red: 0.5 };
const sortKey = (t: GameTile) => t.wire_rank + WIRE_TYPE_OFFSET[t.wire_type];

interface TileRackProps {
  tiles: GameTile[];
  selectedTileId: string | null;
  isOwnRack: boolean;
  onSelectTile: (tileId: string) => void;
}

export function TileRack({ tiles, selectedTileId, isOwnRack, onSelectTile }: TileRackProps) {
  const sorted = [...tiles].sort((a, b) => sortKey(a) - sortKey(b) || a.id.localeCompare(b.id));

  return (
    <div className="flex gap-1.5 overflow-x-auto py-1">
      {sorted.map((tile) => (
        <Tile
          key={tile.id}
          tile={tile}
          isSelected={selectedTileId === tile.id}
          isOwnRack={isOwnRack}
          onClick={onSelectTile}
        />
      ))}
    </div>
  );
}
