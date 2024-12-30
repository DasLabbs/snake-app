import React from 'react';
import { ASSETS } from '@src/assets';
import { useLifeCountdown } from '@src/hooks/use-life-countdown';

type NumberLivesProps = {
  lives: number;
  onOpenTaskFrame: () => void;
};

const NumberLives = (props: NumberLivesProps) => {
  const { lives, onOpenTaskFrame } = props;
  const countdown = useLifeCountdown();

  return (
    <div
      className={`border-primary border-thick relative flex w-14 justify-end px-2 text-xs font-normal text-[#B20025]`}
      {...(lives === 0 && { onClick: onOpenTaskFrame })}
    >
      <div className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2">
        <div className="relative flex h-full w-full items-center justify-center ">
          <img
            src={ASSETS.heartIcon}
            alt="heart"
            loading="lazy"
            width={32}
            height={32}
            className="absolute left-1/2 top-1/2 h-auto w-8 -translate-x-1/2 -translate-y-1/2 object-cover"
          />
          <span className="relative z-10 text-white">{lives}</span>
        </div>
      </div>
      {lives >= 6 ? 'Full' : countdown}
      {lives === 0 && (
        <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 cursor-pointer">
          <img
            src={ASSETS.plusSvg}
            alt="heart"
            loading="lazy"
            width={32}
            height={32}
            className="h-auto w-5 bg-white object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default NumberLives;
