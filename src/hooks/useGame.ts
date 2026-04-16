import { useCallback, useState } from "react";
import type {
  Game,
  GamePlayer,
  GameRack,
  GameSettings,
  GameTile,
} from "../types/game";
import { generateMockBoard } from "../lib/mockBoard";

// TODO: Remove mocks and use real Supabase calls once edge functions are implemented.

function randomId(): string {
  return crypto.randomUUID();
}

function randomInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface UseGameReturn {
  game: Game | null;
  players: GamePlayer[];
  racks: GameRack[];
  tiles: GameTile[];
  userId: string | null;
  captainUserId: string | null;
  selectedTileId: string | null;
  isLoading: boolean;
  error: string | null;
  createGame: (displayName: string, settings: GameSettings) => Promise<Game>;
  joinGame: (inviteCode: string, displayName: string) => Promise<Game>;
  setCaptain: (userId: string) => void;
  selectTile: (tileId: string | null) => void;
  startGame: () => Promise<void>;
  clearError: () => void;
}

export function useGame(): UseGameReturn {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [racks, setRacks] = useState<GameRack[]>([]);
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [captainUserId, setCaptainUserId] = useState<string | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGame = useCallback(
    async (displayName: string, settings: GameSettings): Promise<Game> => {
      setIsLoading(true);
      setError(null);
      try {
        await delay(400);

        const newUserId = randomId();
        const gameId = randomId();
        const now = new Date().toISOString();

        const newGame: Game = {
          id: gameId,
          invite_code: randomInviteCode(),
          host_player_id: newUserId,
          captain_player_id: newUserId,
          status: "lobby",
          current_turn_player_id: null,
          turn_number: 0,
          detonator_step: 0,
          detonator_limit: 6,
          red_wire_count: settings.red_wire_count,
          yellow_wire_count: settings.yellow_wire_count,
          next_yellow_rank: 1,
          started_at: null,
          ended_at: null,
          created_at: now,
          updated_at: now,
        };

        const allPlayers: GamePlayer[] = [
          {
            id: newUserId,
            game_id: gameId,
            display_name: displayName,
            seat_index: 0,
            turn_order_index: null,
            joined_at: now,
          },
          {
            id: randomId(),
            game_id: gameId,
            display_name: "Alice",
            seat_index: 1,
            turn_order_index: null,
            joined_at: now,
          },
          {
            id: randomId(),
            game_id: gameId,
            display_name: "Bob",
            seat_index: 2,
            turn_order_index: null,
            joined_at: now,
          },
        ];

        setGame(newGame);
        setUserId(newUserId);
        setPlayers(allPlayers);
        setCaptainUserId(newUserId);

        return newGame;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create game";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const joinGame = useCallback(
    async (inviteCode: string, displayName: string): Promise<Game> => {
      setIsLoading(true);
      setError(null);
      try {
        await delay(400);

        const newUserId = randomId();
        const gameId = randomId();
        const hostId = randomId();
        const now = new Date().toISOString();

        const existingGame: Game = {
          id: gameId,
          invite_code: inviteCode,
          host_player_id: hostId,
          captain_player_id: hostId,
          status: "lobby",
          current_turn_player_id: null,
          turn_number: 0,
          detonator_step: 0,
          detonator_limit: 6,
          red_wire_count: 3,
          yellow_wire_count: 3,
          next_yellow_rank: 1,
          started_at: null,
          ended_at: null,
          created_at: now,
          updated_at: now,
        };

        const allPlayers: GamePlayer[] = [
          {
            id: hostId,
            game_id: gameId,
            display_name: "Host Player",
            seat_index: 0,
            turn_order_index: null,
            joined_at: now,
          },
          {
            id: newUserId,
            game_id: gameId,
            display_name: displayName,
            seat_index: 1,
            turn_order_index: null,
            joined_at: now,
          },
          {
            id: randomId(),
            game_id: gameId,
            display_name: "Charlie",
            seat_index: 2,
            turn_order_index: null,
            joined_at: now,
          },
        ];

        setGame(existingGame);
        setUserId(newUserId);
        setPlayers(allPlayers);
        setCaptainUserId(null);

        return existingGame;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to join game";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const setCaptain = useCallback((id: string) => {
    setCaptainUserId(id);
  }, []);

  const selectTile = useCallback((tileId: string | null) => {
    setSelectedTileId(tileId);
  }, []);

  const startGame = useCallback(async () => {
    if (!game || !captainUserId) return;

    setIsLoading(true);
    setError(null);
    try {
      await delay(300);

      // Assign turn order: captain first, then others by seat index
      const updatedPlayers = players.map((p) => ({
        ...p,
        turn_order_index:
          p.id === captainUserId
            ? 0
            : p.seat_index < players.find((cp) => cp.id === captainUserId)!.seat_index
              ? p.seat_index + 1
              : p.seat_index,
      }));

      const { racks: newRacks, tiles: newTiles } = generateMockBoard(
        game.id,
        updatedPlayers,
        captainUserId,
        game.red_wire_count,
        game.yellow_wire_count,
      );

      // Set current turn to a non-current-user player for demo visibility
      const firstOtherPlayer = updatedPlayers.find((p) => p.id !== userId);
      const currentTurnPlayerId = firstOtherPlayer?.id ?? updatedPlayers[0].id;

      setPlayers(updatedPlayers);
      setRacks(newRacks);
      setTiles(newTiles);
      setGame({
        ...game,
        status: "in_progress",
        started_at: new Date().toISOString(),
        captain_player_id: captainUserId,
        current_turn_player_id: currentTurnPlayerId,
        turn_number: 1,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start game";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [game, captainUserId, players, userId]);

  const clearError = useCallback(() => setError(null), []);

  return {
    game,
    players,
    racks,
    tiles,
    userId,
    captainUserId,
    selectedTileId,
    isLoading,
    error,
    createGame,
    joinGame,
    setCaptain,
    selectTile,
    startGame,
    clearError,
  };
}
