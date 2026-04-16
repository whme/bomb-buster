import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function Stepper({ label, value, min, max, onChange }: StepperProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 text-sm transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          -
        </button>
        <span className="w-8 text-center font-mono text-sm">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 text-sm transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function Landing() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const {
    displayName,
    setDisplayName,
    createGame,
    joinGame,
    isLoading,
    error,
    clearError,
  } = useGameContext();

  const [name, setName] = useState(displayName);
  const [redWireCount, setRedWireCount] = useState(0);
  const [yellowWireCount, setYellowWireCount] = useState(0);

  const handleCreateGame = async () => {
    if (!name.trim()) return;
    setDisplayName(name.trim());
    try {
      await createGame(name.trim(), {
        red_wire_count: redWireCount,
        yellow_wire_count: yellowWireCount,
      });
      navigate("/lobby");
    } catch {
      // error is set in context
    }
  };

  const handleJoinGame = async () => {
    if (!name.trim() || !inviteCode) return;
    setDisplayName(name.trim());
    try {
      await joinGame(inviteCode, name.trim());
      navigate("/lobby");
    } catch {
      // error is set in context
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-2 text-5xl font-bold tracking-tight">Bomb Busters</h1>
      <p className="mb-10 text-gray-400">
        A cooperative bomb-defusal game for 2–5 players
      </p>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <label
            htmlFor="display-name"
            className="mb-1 block text-sm text-gray-400"
          >
            Your Name
          </label>
          <input
            id="display-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError();
            }}
            placeholder="Enter your name"
            maxLength={20}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
        </div>

        {!inviteCode && (
          <div className="space-y-3 rounded-xl bg-gray-800 p-4">
            <h2 className="text-sm font-medium text-gray-400">
              Game Settings
            </h2>
            <Stepper
              label="Red Wires"
              value={redWireCount}
              min={0}
              max={11}
              onChange={setRedWireCount}
            />
            <Stepper
              label="Yellow Wires"
              value={yellowWireCount}
              min={0}
              max={11}
              onChange={setYellowWireCount}
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-900/40 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {inviteCode ? (
          <button
            onClick={handleJoinGame}
            disabled={isLoading || !name.trim()}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Joining…" : "Join Game"}
          </button>
        ) : (
          <button
            onClick={handleCreateGame}
            disabled={isLoading || !name.trim()}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating…" : "Create Game"}
          </button>
        )}
      </div>
    </div>
  );
}
