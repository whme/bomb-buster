import { Route, Routes } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import { Landing } from "./components/Landing/Landing";
import { Lobby } from "./components/Lobby/Lobby";
import { Board } from "./components/Board/Board";
import { GameOver } from "./components/GameOver/GameOver";

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/join/:inviteCode" element={<Landing />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/board" element={<Board />} />
          <Route path="/gameover" element={<GameOver />} />
        </Routes>
      </div>
    </GameProvider>
  );
}
