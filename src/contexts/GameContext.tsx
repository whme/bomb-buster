import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useGame } from "../hooks/useGame";
import type { Game, GameSettings, GamePlayer, GameRack, GameTile } from "../types/game";

interface GameContextValue {
  game: Game | null;
  players: GamePlayer[];
  racks: GameRack[];
  tiles: GameTile[];
  userId: string | null;
  captainUserId: string | null;
  selectedTileId: string | null;
  displayName: string;
  setDisplayName: (name: string) => void;
  isHost: boolean;
  isLoading: boolean;
  error: string | null;
  createGame: (displayName: string, settings: GameSettings) => Promise<Game>;
  joinGame: (inviteCode: string, displayName: string) => Promise<Game>;
  setCaptain: (userId: string) => void;
  selectTile: (tileId: string | null) => void;
  startGame: () => Promise<void>;
  clearError: () => void;
}

const DISPLAY_NAME_KEY = "bomb-busters-display-name";

function getStoredDisplayName(): string {
  return localStorage.getItem(DISPLAY_NAME_KEY) ?? "";
}

function storeDisplayName(name: string) {
  localStorage.setItem(DISPLAY_NAME_KEY, name);
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const gameHook = useGame();

  const displayName = getStoredDisplayName();

  const setDisplayName = useCallback((name: string) => {
    storeDisplayName(name);
  }, []);

  const isHost =
    gameHook.game !== null &&
    gameHook.userId !== null &&
    gameHook.game.host_player_id === gameHook.userId;

  return (
    <GameContext.Provider
      value={{
        ...gameHook,
        displayName,
        setDisplayName,
        isHost,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return ctx;
}
