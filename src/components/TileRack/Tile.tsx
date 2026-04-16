import type { GameTile, WireType } from "../../types/game";

interface TileProps {
  tile: GameTile;
  isSelected: boolean;
  isOwnRack: boolean;
  onClick: (tileId: string) => void;
}

const wireColor: Record<WireType, string> = {
  blue: "text-blue-400",
  yellow: "text-amber-400",
  red: "text-red-400",
};

const wireColorMuted: Record<WireType, string> = {
  blue: "text-blue-400/60",
  yellow: "text-amber-400/60",
  red: "text-red-400/60",
};

export function Tile({ tile, isSelected, isOwnRack, onClick }: TileProps) {
  // Own rack: you always see your tiles in full color
  // Other racks: hidden / hinted / cut states apply
  const isHidden = !isOwnRack && !tile.is_revealed && !tile.is_cut;
  const isHinted = !isOwnRack && tile.is_revealed && !tile.is_cut;
  const isCut = tile.is_cut;
  const isVisible = isOwnRack && !isCut;

  const handleClick = () => {
    onClick(tile.id);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex h-14 w-11 shrink-0 items-center justify-center rounded-lg border-b-2 shadow-md
        cursor-pointer select-none transition-all duration-150
        hover:scale-105 hover:brightness-110
        ${isHidden ? "bg-gray-600 border-gray-700" : ""}
        ${isHinted ? "bg-gray-700 border-gray-800 ring-1 ring-white/15" : ""}
        ${isVisible ? "bg-gray-700 border-gray-800" : ""}
        ${isCut ? "bg-gray-800 border-gray-900 opacity-50" : ""}
        ${isSelected ? "ring-2 ring-blue-400 -translate-y-1" : ""}
      `}
    >
      {!isHidden && (
        <span
          className={`font-bold text-xl
            ${isCut ? `${wireColor[tile.wire_type]} line-through` : ""}
            ${isHinted ? wireColorMuted[tile.wire_type] : ""}
            ${isVisible ? wireColor[tile.wire_type] : ""}
          `}
        >
          {tile.wire_rank}
        </span>
      )}
    </button>
  );
}
