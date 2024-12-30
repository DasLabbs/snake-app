import React from 'react';
import { ASSETS } from '@src/assets';

type GameStatsProps = {
  lives: number;
  score: number;
  width?: number;
};

const GameStats = (props: GameStatsProps) => {
  const { score, lives, width } = props;
  return (
    <div className="flex w-[264px] items-center justify-between" style={{ width: width }}>
      <span className="text-[#B20025]">0{score}</span>
      <div className="relative flex h-5 w-5 items-center justify-center ">
        <img
          src={ASSETS.heartIcon}
          alt="heart"
          className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 object-cover"
        />
        <span className="relative z-10 text-[10px] text-white">{lives}</span>
      </div>
    </div>
  );
};

export default GameStats;
