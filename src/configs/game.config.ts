// eslint-disable-next-line simple-import-sort/imports
import 'phaser'; // Add this import at the top
import { GameState } from '@src/libs/types/game';
import { Types } from 'phaser';

export const GAME_CONFIG: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: 'game',
    width: '252px',
    height: '350px',
  },
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  backgroundColor: '#ffffff',
  // fps: {
  //   target: 30, // Lower FPS to reduce processing
  //   forceSetTimeOut: true,
  // },
  // render: {
  //   antialias: false,
  //   pixelArt: true,
  //   roundPixels: true,
  // },
};

export const INITIAL_GAME_STATE: GameState = {
  lives: 6,
  lastLifeRegeneration: Date.now(),
  score: 0,
};

export const CONSTANTS = {
  INITIAL_GAME_SPEED: 150, // Increased value means slower speed (milliseconds between moves)
  MIN_GAME_SPEED: 50, // Fastest speed (lower limit)
  SPEED_DECREASE: 10, // How much to decrease delay after eating food (making it faster)
  GRID_SIZE: 14,
  SPRITE_SIZE: 14,
  INITIAL_SNAKE_LENGTH: 5,
  SNAKE_INITIAL_SIZE: 3,
  SNAKE_SEGMENT_SIZE: 16,
  SPEED_INCREMENT: 2,
  LIFE_REGEN_TIME: 1800000, // 30 minutes
  MAX_LIVES: 6,
  POINTS_PER_FOOD: 10,
  SNAKE_IMAGES: {
    HEAD: 'head',
    BODY: 'body',
    TAIL: 'tail',
  },
  FOOD_IMAGES: {
    FOOD1: 'food1',
    FOOD2: 'food2',
    FOOD3: 'food3',
  },
  FOOD_WEIGHTS: {
    FOOD1: 40,
    FOOD2: 30,
    FOOD3: 30,
  },
} as const;
