import { create } from 'zustand';

type GameState = {
  gameId: string | null;
  lives: number;
  score: number;
  lastLifeRegeneration: number;
};

type GameAction = {
  setCurrentGameId: (gameId: string) => void;
  setScore: (score: number) => void;
  setLives: (lives: number) => void;
  setLastLifeRegeneration: (time: number) => void;
  reset: () => void;
};

const initialState: GameState = {
  gameId: null,
  lives: 6,
  score: 0,
  lastLifeRegeneration: Date.now(),
};

export const useGameStore = create<GameState & GameAction>()((set) => ({
  ...initialState,

  setCurrentGameId: (gameId) => set({ gameId }),
  setScore: (score) => set({ score }),
  setLives: (lives) => set({ lives: lives >= 6 ? 6 : lives }),
  setLastLifeRegeneration: (time) => set({ lastLifeRegeneration: time }),

  reset: () =>
    set({
      lives: 6,
      score: 0,
      lastLifeRegeneration: Date.now(),
    }),
}));
