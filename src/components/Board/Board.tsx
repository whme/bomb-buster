import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";
import { PlayerRackSection } from "./PlayerRackSection";

export function Board() {
  const { game, players, racks, tiles, userId, selectedTileId, selectTile } =
    useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!game || game.status !== "in_progress") {
      navigate("/lobby");
    }
  }, [game, navigate]);

  // Group racks by controller player
  const racksByPlayer = useMemo(() => {
    const map = new Map<string, typeof racks>();
    for (const rack of racks) {
      const existing = map.get(rack.controller_player_id) ?? [];
      existing.push(rack);
      map.set(rack.controller_player_id, existing);
    }
    return map;
  }, [racks]);

  // Group tiles by rack
  const tilesByRack = useMemo(() => {
    const map = new Map<string, typeof tiles>();
    for (const tile of tiles) {
      const existing = map.get(tile.rack_id) ?? [];
      existing.push(tile);
      map.set(tile.rack_id, existing);
    }
    return map;
  }, [tiles]);

  // Sort players by turn order, partition into current vs others
  const sortedPlayers = useMemo(
    () =>
      [...players].sort(
        (a, b) =>
          (a.turn_order_index ?? a.seat_index) -
          (b.turn_order_index ?? b.seat_index),
      ),
    [players],
  );

  const currentPlayer = sortedPlayers.find((p) => p.id === userId);
  const otherPlayers = sortedPlayers.filter((p) => p.id !== userId);

  if (!game || game.status !== "in_progress") {
    return null;
  }

  const handleSelectTile = (tileId: string) => {
    selectTile(selectedTileId === tileId ? null : tileId);
  };

  const isActiveTurn = (playerId: string) =>
    game.current_turn_player_id === playerId;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center p-4">
      {/* Other players' racks — top */}
      <div className="flex w-full flex-1 flex-col gap-4">
        {otherPlayers.map((player) => (
          <PlayerRackSection
            key={player.id}
            player={player}
            racks={racksByPlayer.get(player.id) ?? []}
            tilesByRack={tilesByRack}
            isCurrentPlayer={false}
            isActiveTurn={isActiveTurn(player.id)}
            selectedTileId={selectedTileId}
            onSelectTile={handleSelectTile}
          />
        ))}
      </div>

      {/* Current player's rack — bottom */}
      {currentPlayer && (
        <div className="mt-auto w-full pt-4">
          <PlayerRackSection
            player={currentPlayer}
            racks={racksByPlayer.get(currentPlayer.id) ?? []}
            tilesByRack={tilesByRack}
            isCurrentPlayer={true}
            isActiveTurn={isActiveTurn(currentPlayer.id)}
            selectedTileId={selectedTileId}
            onSelectTile={handleSelectTile}
          />
        </div>
      )}
    </div>
  );
}
