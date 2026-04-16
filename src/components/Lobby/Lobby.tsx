import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";
import { canStartGame } from "../../lib/game";
import { InviteSection } from "./InviteSection";
import { PlayerList } from "./PlayerList";
import { GameSettings } from "./GameSettings";

export function Lobby() {
  const { game, players, isHost, isLoading, error, captainUserId, startGame } =
    useGameContext();
  const navigate = useNavigate();

  if (!game) {
    navigate("/");
    return null;
  }

  const handleStartGame = async () => {
    await startGame();
    navigate("/board");
  };

  const ready = canStartGame(players, captainUserId);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Game Lobby</h1>
        <p className="mt-1 text-sm text-gray-400">
          Code: {game.invite_code}
        </p>
      </div>

      <InviteSection />
      <PlayerList />
      <GameSettings />

      {error && (
        <p className="rounded-lg bg-red-900/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {isHost && (
        <button
          onClick={handleStartGame}
          disabled={isLoading || !ready}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Starting…" : "Start Game"}
        </button>
      )}

      {isHost && !ready && (
        <p className="text-center text-sm text-gray-500">
          {players.length < 2
            ? "Need at least 2 players to start"
            : "Select a captain to start the game"}
        </p>
      )}
    </div>
  );
}
