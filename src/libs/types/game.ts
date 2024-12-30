import Phaser from 'phaser';

export interface Position {
  x: number;
  y: number;
}

export interface SnakeState {
  body: Phaser.GameObjects.Sprite[];
  size: number;
  direction: Position;
}

export interface GameState {
  lives: number;
  lastLifeRegeneration: number;
  score: number;
}
