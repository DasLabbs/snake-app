import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS } from '@src/assets';
import { useTranslation } from '@src/hooks/use-translation';
import { useUserProvider } from '@src/providers/user-provider';
import { useGameStore } from '@src/stores/game';

import Button from '../shared/button';

type GameOverProps = {
  onClose: () => void;
  onRestart: () => void;
};

const GameOver = (props: GameOverProps) => {
  const { onClose, onRestart } = props;
  const { translate } = useTranslation();
  const { refetchUser } = useUserProvider();

  const navigate = useNavigate();
  const { lives } = useGameStore();

  const onBackToHome = () => {
    refetchUser();
    navigate('/');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex h-8 w-8 items-center justify-center ">
            <img
              src={ASSETS.heartIcon}
              alt="heart"
              className="absolute left-1/2 top-1/2 w-8 -translate-x-1/2 -translate-y-1/2 object-cover"
            />
            <span className="relative z-10 text-white">{lives}</span>
          </div>
          <h1 className="text-2xl font-medium tracking-wider text-white">{translate('game_over')}</h1>
        </div>
        <div className="flex flex-col items-center gap-5">
          <Button variant="secondary" size="sm" className="text-sm uppercase" onClick={onRestart}>
            {translate('restart_button')}
          </Button>
          <Button variant="secondary" size="sm" className="text-sm uppercase" onClick={onBackToHome}>
            {translate('back_to_home')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
