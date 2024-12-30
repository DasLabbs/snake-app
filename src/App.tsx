import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import '../i18n.config.js';

import Layout from './components/shared/layout';
import queryClient from './libs/client/query-client';
import { GameState } from './libs/types/game';
import GamePlay from './pages/game-play';
import Home from './pages/home';
import Leaderboard from './pages/leaderboard';

import './App.scss';

declare global {
  interface Window {
    gameState: GameState;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game-play" element={<GamePlay />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
