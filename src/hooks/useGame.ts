import { useCallback, useState } from "react";
import type {
  Game,
  GameSettings,
  GameUserWithName,
} from "../types/game";

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
  players: GameUserWithName[];
  userId: string | null;
  captainUserId: string | null;
  isLoading: boolean;
  error: string | null;
  createGame: (displayName: string, settings: GameSettings) => Promise<Game>;
  joinGame: (inviteCode: string, displayName: string) => Promise<Game>;
  setCaptain: (userId: string) => void;
  startGame: () => Promise<void>;
  clearError: () => void;
}

export function useGame(): UseGameReturn {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<GameUserWithName[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [captainUserId, setCaptainUserId] = useState<string | null>(null);
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
          host_user_id: newUserId,
          status: "lobby",
          current_turn_rack_id: null,
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

        const allPlayers: GameUserWithName[] = [
          {
            game_id: gameId,
            user_id: newUserId,
            seat_index: 0,
            joined_at: now,
            app_user: { display_name: displayName },
          },
          {
            game_id: gameId,
            user_id: randomId(),
            seat_index: 1,
            joined_at: now,
            app_user: { display_name: "Alice" },
          },
          {
            game_id: gameId,
            user_id: randomId(),
            seat_index: 2,
            joined_at: now,
            app_user: { display_name: "Bob" },
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
          host_user_id: hostId,
          status: "lobby",
          current_turn_rack_id: null,
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

        const allPlayers: GameUserWithName[] = [
          {
            game_id: gameId,
            user_id: hostId,
            seat_index: 0,
            joined_at: now,
            app_user: { display_name: "Host Player" },
          },
          {
            game_id: gameId,
            user_id: newUserId,
            seat_index: 1,
            joined_at: now,
            app_user: { display_name: displayName },
          },
          {
            game_id: gameId,
            user_id: randomId(),
            seat_index: 2,
            joined_at: now,
            app_user: { display_name: "Charlie" },
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

  const startGame = useCallback(async () => {
    if (!game || !captainUserId) return;

    setIsLoading(true);
    setError(null);
    try {
      await delay(300);
      // Captain is sent to the server here
      console.log("Starting game with captain:", captainUserId);
      setGame({ ...game, status: "in_progress", started_at: new Date().toISOString() });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start game";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [game, captainUserId]);

  const clearError = useCallback(() => setError(null), []);

  return {
    game,
    players,
    userId,
    captainUserId,
    isLoading,
    error,
    createGame,
    joinGame,
    setCaptain,
    startGame,
    clearError,
  };
}
