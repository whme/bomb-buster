import type { GamePlayer, GameRack, GameTile, WireType } from "../types/game";

interface MockBoardData {
  racks: GameRack[];
  tiles: GameTile[];
}

function randomId(): string {
  return crypto.randomUUID();
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateMockBoard(
  gameId: string,
  players: GamePlayer[],
  captainPlayerId: string,
  redWireCount: number,
  yellowWireCount: number,
): MockBoardData {
  const now = new Date().toISOString();
  const isTwoPlayer = players.length === 2;

  // Determine racks: captain gets 2, others get 1. In 2-player both get 2.
  const racks: GameRack[] = [];
  let rackIndex = 0;

  // Sort players by turn_order_index for deterministic rack ordering
  const sortedPlayers = [...players].sort(
    (a, b) => (a.turn_order_index ?? a.seat_index) - (b.turn_order_index ?? b.seat_index),
  );

  for (const player of sortedPlayers) {
    const rackCount =
      isTwoPlayer || player.id === captainPlayerId ? 2 : 1;

    for (let r = 0; r < rackCount; r++) {
      racks.push({
        id: randomId(),
        game_id: gameId,
        rack_index: rackIndex++,
        controller_player_id: player.id,
        created_at: now,
      });
    }
  }

  const totalRacks = racks.length;

  // Build tile pool: 48 blue (1-12, 4 each) + red + yellow
  const pool: { wire_type: WireType; wire_rank: number }[] = [];

  for (let rank = 1; rank <= 12; rank++) {
    for (let copy = 0; copy < 4; copy++) {
      pool.push({ wire_type: "blue", wire_rank: rank });
    }
  }
  for (let rank = 1; rank <= redWireCount; rank++) {
    pool.push({ wire_type: "red", wire_rank: rank });
  }
  for (let rank = 1; rank <= yellowWireCount; rank++) {
    pool.push({ wire_type: "yellow", wire_rank: rank });
  }

  // Trim or keep blue tiles so total divides evenly across racks
  const totalSpecial = redWireCount + yellowWireCount;
  const remainder = (48 + totalSpecial) % totalRacks;
  const blueToRemove = remainder > 0 ? remainder : 0;

  // Remove excess blue tiles from the end of the pool (they're the first 48 entries)
  if (blueToRemove > 0) {
    pool.splice(48 - blueToRemove, blueToRemove);
  }

  const shuffled = shuffle(pool);
  const tilesPerRack = shuffled.length / totalRacks;

  // Distribute tiles across racks
  const tiles: GameTile[] = [];
  for (let rIdx = 0; rIdx < totalRacks; rIdx++) {
    const rackTiles = shuffled.slice(
      rIdx * tilesPerRack,
      (rIdx + 1) * tilesPerRack,
    );
    for (let pos = 0; pos < rackTiles.length; pos++) {
      const entry = rackTiles[pos];
      tiles.push({
        id: randomId(),
        game_id: gameId,
        rack_id: racks[rIdx].id,
        rack_position: pos,
        wire_type: entry.wire_type,
        wire_rank: entry.wire_rank,
        is_revealed: false,
        is_cut: false,
        revealed_at: null,
        cut_at: null,
      });
    }
  }

  // For demo: on OTHER players' racks (not captain/current player), mark a few
  // tiles as hinted (is_revealed) and a couple as cut (is_cut + is_revealed)
  // so all tile states are visible.
  const otherRackIds = new Set(
    racks
      .filter((r) => r.controller_player_id !== captainPlayerId)
      .map((r) => r.id),
  );

  let hintCount = 0;
  let cutCount = 0;
  for (const tile of tiles) {
    if (!otherRackIds.has(tile.rack_id)) continue;

    if (!tile.is_revealed && hintCount < 3) {
      tile.is_revealed = true;
      tile.revealed_at = now;
      hintCount++;
    } else if (!tile.is_cut && tile.wire_type === "blue" && cutCount < 2) {
      tile.is_revealed = true;
      tile.revealed_at = now;
      tile.is_cut = true;
      tile.cut_at = now;
      cutCount++;
    }
  }

  return { racks, tiles };
}
