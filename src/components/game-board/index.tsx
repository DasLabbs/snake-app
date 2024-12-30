import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_CONFIG } from '@src/configs/game.config';
import useFinishGame from '@src/hooks/use-finish-game';
import useStartGame from '@src/hooks/use-start-game';
import { calculateDimensions } from '@src/libs/utils/common';
import { SnakeScene } from '@src/scenes/snake-scene';
import { useGameStore } from '@src/stores/game';
import { useUserStore } from '@src/stores/user';
import WebApp from '@twa-dev/sdk';
import { Game } from 'phaser';

import GameOver from '../game-over';
import GameStats from '../game-stats';
import PreLoader from '../shared/pre-loader';
import Task from '../task';

const GameBoard = () => {
  const [isOpenGameOver, setIsOpenGameOver] = useState(false);
  const [isOpenedTask, setIsOpenedTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { lives, score, gameId, setLastLifeRegeneration, setLives } = useGameStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);

  const gameInstanceRef = useRef<Phaser.Game>();
  const { startGame, isLoading: isLoadGame } = useStartGame(() => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.scene.start('SnakeScene');
      setIsOpenGameOver(false);
    }
  });

  const { finishGame } = useFinishGame((data) => {
    setLastLifeRegeneration(data.lastRegen);
    setLives(lives - 1);
    if (lives - 1 <= 0) {
      setIsOpenedTask(true);
    } else {
      setIsOpenGameOver(true);
    }
  });

  const { containerHeight, containerWidth, gameHeight, gameWidth } = calculateDimensions(
    Number(parentRef.current?.clientWidth) - 30 || 252,
    Number(parentRef.current?.clientHeight) - 60 || 350
  );

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();

    // Sync window.gameState with store
    window.gameState = useGameStore.getState();

    // Subscribe to store updates
    const unsubscribe = useGameStore.subscribe((state) => {
      window.gameState = {
        lives: state.lives,
        score: state.score,
        lastLifeRegeneration: state.lastLifeRegeneration,
      };
    });

    if (!gameId) {
      navigate('/');
      return;
    }

    const config = {
      ...GAME_CONFIG,
      scale: {
        ...GAME_CONFIG.scale,
        width: gameWidth,
        height: gameHeight,
      },
      callbacks: {
        postBoot: () => {
          setIsLoading(false);
        },
      },
      scene: SnakeScene,
    };

    gameInstanceRef.current = new Game(config);

    const handleGameOver = () => {
      finishGame({
        gamePlayId: gameId,
        point: window.gameState.score,
        userId: user?.id as string,
      });
    };

    window.addEventListener('game-over', handleGameOver);

    return () => {
      unsubscribe();
      window.removeEventListener('game-over', handleGameOver);
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
      }
    };
  }, [user, gameId, gameHeight, gameWidth]);

  return (
    <div ref={parentRef} className="relative flex h-full w-full flex-col items-center justify-center gap-1 p-2">
      <GameStats score={score} lives={lives} width={containerWidth} />
      <div
        className="dotted-border p-[6px]"
        style={{
          height: containerHeight,
          width: containerWidth,
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div
            id="game"
            className="flex items-center justify-center"
            style={{
              width: gameWidth,
              height: gameHeight,
              display: isLoading ? 'none' : 'block',
            }}
          />
          {(isLoading || isLoadGame) && <PreLoader />}
        </div>
      </div>
      {isOpenGameOver && <GameOver onClose={() => setIsOpenGameOver(false)} onRestart={startGame} />}
      {isOpenedTask && <Task onClose={() => navigate(-1)} />}
    </div>
  );
};

export default GameBoard;
