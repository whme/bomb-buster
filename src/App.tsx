import { useState } from "react";
import { Lobby } from "./components/Lobby/Lobby";
import { Setup } from "./components/Setup/Setup";
import { Board } from "./components/Board/Board";
import { GameOver } from "./components/GameOver/GameOver";

type Screen = "lobby" | "setup" | "board" | "gameover";

export default function App() {
  const [screen] = useState<Screen>("lobby");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {screen === "lobby" && <Lobby />}
      {screen === "setup" && <Setup />}
      {screen === "board" && <Board />}
      {screen === "gameover" && <GameOver />}
    </div>
  );
}
