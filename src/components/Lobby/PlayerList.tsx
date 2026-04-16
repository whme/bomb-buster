import { useGameContext } from "../../contexts/GameContext";

export function PlayerList() {
  const { players, userId, game, isHost, captainUserId, setCaptain } =
    useGameContext();

  if (!game) return null;

  return (
    <div className="rounded-xl bg-gray-800 p-6">
      <h2 className="mb-1 text-lg font-semibold">
        Players ({players.length}/5)
      </h2>
      {isHost && !captainUserId && (
        <p className="mb-3 text-xs text-gray-500">
          Select a player as captain to start the game.
        </p>
      )}

      <div className="mt-3 space-y-2">
        {players.map((player) => {
          const isCurrentUser = player.user_id === userId;
          const isPlayerHost = player.user_id === game.host_user_id;
          const isCaptain = player.user_id === captainUserId;

          return (
            <div
              key={player.user_id}
              className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                isCurrentUser ? "bg-gray-700" : "bg-gray-900"
              } ${isCaptain ? "ring-2 ring-blue-500" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-sm font-medium">
                  {player.seat_index + 1}
                </span>
                <span className="font-medium">
                  {player.app_user.display_name}
                </span>
                {isPlayerHost && (
                  <span className="rounded bg-yellow-600/30 px-2 py-0.5 text-xs text-yellow-300">
                    Host
                  </span>
                )}
                {isCaptain && (
                  <span className="rounded bg-blue-600/30 px-2 py-0.5 text-xs text-blue-300">
                    Captain
                  </span>
                )}
                {isCurrentUser && (
                  <span className="text-xs text-gray-500">You</span>
                )}
              </div>

              {isHost && !isCaptain && (
                <button
                  onClick={() => setCaptain(player.user_id)}
                  className="rounded-lg bg-gray-600 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-gray-500"
                >
                  Set Captain
                </button>
              )}
            </div>
          );
        })}

        {players.length < 2 && (
          <p className="px-4 py-3 text-sm text-gray-500">
            Waiting for more players to join…
          </p>
        )}
      </div>
    </div>
  );
}
