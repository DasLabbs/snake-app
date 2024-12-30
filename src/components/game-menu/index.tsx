import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ASSETS } from '@src/assets';
import { useTranslation } from '@src/hooks/use-translation';
import { useUserProvider } from '@src/providers/user-provider';
import { useGameStore } from '@src/stores/game';
import { useUserStore } from '@src/stores/user';

import Button from '../shared/button';
import PreLoader from '../shared/pre-loader';
import Task from '../task';

import NumberLives from './number-lives';

const GameMenu = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { user } = useUserStore();
  const { lives } = useGameStore();
  const { login, isLoading, start } = useUserProvider();
  const { translate } = useTranslation();
  const [isOpenedTask, setIsOpenedTask] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.userEmail);
    }
  }, [user]);

  const onOpenTaskFrame = () => {
    setIsOpenedTask(true);
  };

  if (isLoading) {
    return <PreLoader />;
  }

  return (
    <>
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="absolute right-4 top-8">
          <NumberLives lives={lives} onOpenTaskFrame={onOpenTaskFrame} />
        </div>
        <div className="absolute bottom-0 right-0">
          <img src={ASSETS.snakeImg} alt="snake" width={24} height={24} loading="lazy" className="h-auto w-24" />
        </div>
        <div className="absolute left-[-9px] top-[24px] origin-center rotate-90">
          <img src={ASSETS.snakeImg} alt="snake" width={24} height={24} loading="lazy" className="h-auto w-24" />
        </div>
        <div className=" flex w-full flex-col items-center px-10 text-center">
          <div className="mb-10 w-[200px] text-2xl font-semibold uppercase tracking-widest text-[#B20025]">
            {translate('game_title')}
          </div>

          <div className="flex flex-col items-center gap-10">
            <div className="flex max-w-[200px] flex-col items-center gap-1 overflow-hidden">
              <input
                type="email"
                placeholder={translate('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-fit text-center text-base text-[#B20025] placeholder:text-base placeholder:font-normal placeholder:uppercase placeholder:tracking-wider placeholder:text-[#B20025] focus:outline-none"
              />
              <div className="w-full border-t-[3px] border-dashed border-[#B20025]"></div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  if (!user || user.userEmail !== email) {
                    if (!email) {
                      toast.error('Please enter your email');
                      return;
                    }
                    login(email);
                  } else {
                    if (lives <= 0) {
                      toast.error('You have no more lives');
                      return;
                    }
                    start();
                  }
                }}
                className="text-sm uppercase"
              >
                {translate('start_button')}
              </Button>

              <Button
                onClick={() => {
                  navigate('/leaderboard');
                }}
                className="text-xs font-normal uppercase"
              >
                {translate('view_leaderboard_button')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isOpenedTask && <Task onClose={() => setIsOpenedTask(false)} />}
    </>
  );
};

export default GameMenu;
