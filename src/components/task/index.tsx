import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ASSETS } from '@src/assets';
import { useLifeCountdown } from '@src/hooks/use-life-countdown';
import { useTranslation } from '@src/hooks/use-translation';
import { INSTAGRAM_FOLLOW_LINK, TIKTOK_FOLLOW_LINK } from '@src/libs/constants/soical';
import { Social, SocialLifePointPayload } from '@src/libs/types/user.action';
import { addLifePointSocial } from '@src/service/user';
import { useGameStore } from '@src/stores/game';
import { useUserStore } from '@src/stores/user';
import { useMutation } from '@tanstack/react-query';

import AdvertisingFrame from '../shared/advertising-frame';

import TaskItem from './task-item';

type TaskProps = {
  onClose: () => void;
};

const Task = (props: TaskProps) => {
  const { onClose } = props;
  const countdown = useLifeCountdown();
  const { translate } = useTranslation();
  const { setLives, lives } = useGameStore();
  const { socialLinks, addSocial, numberAdsWatched } = useUserStore();
  const [isShowAd, setIsShowAd] = useState(false);
  const { mutate: addLifePoint } = useMutation({
    mutationFn: (data: SocialLifePointPayload) => addLifePointSocial(data),
    onSuccess: () => {
      setLives(lives + 1);
    },
    onError: () => {
      toast.error('Already claimed !');
    },
  });

  const isFollowedTiktok = socialLinks.some((social) => social === Social.TIKTOK);
  const isFollowedInstagram = socialLinks.some((social) => social === Social.INSTAGRAM);
  const isWatchedExceed = numberAdsWatched >= 3;

  const TASKS = [
    {
      id: 1,
      task: translate('follow_tiktok'),
      name: '@CHARLESKEITHOFFICIAL',
      description: translate('tiktok'),
      img: ASSETS.tiktokImg,
      disabled: isFollowedTiktok || false,
      onClick: () => {
        if (!isFollowedTiktok) {
          window.open(TIKTOK_FOLLOW_LINK, '_blank');
          addSocial(Social.TIKTOK);
          addLifePoint({ social: Social.TIKTOK });
        } else {
          toast.error('Already claimed');
        }
      },
    },
    {
      id: 2,
      task: translate('follow_instagram'),
      name: '@CHARLESKEITHOFFICIAL',
      description: translate('instagram'),
      disabled: isFollowedInstagram || false,
      img: ASSETS.instagramImg,
      onClick: () => {
        if (!isFollowedInstagram) {
          window.open(INSTAGRAM_FOLLOW_LINK, '_blank');
          addSocial(Social.INSTAGRAM);
          addLifePoint({ social: Social.INSTAGRAM });
        } else {
          toast.error('Already claimed');
        }
      },
    },
    {
      id: 3,
      task: 'Watch',
      name: translate('watch_video_title'),
      disabled: isWatchedExceed || false,
      onClick: () => {
        if (!isWatchedExceed) {
          setIsShowAd(true);
        } else {
          toast.error('Already claimed');
        }
      },
    },
  ];

  const handleBack = () => {
    onClose();
  };

  return (
    <>
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(0,0,0,0.9)] px-4 pb-4 pt-10">
        <div className="dotted-border flex h-full w-full flex-col gap-2 p-4 ss:gap-4">
          <div className="cursor-pointer text-xs font-medium text-white" onClick={handleBack}>
            {'<'} {translate('back_button')}
          </div>
          <div className=" flex  flex-col items-center gap-5 pb-4 pt-2 ss:gap-4">
            <div className="flex items-center gap-2">
              <img src={ASSETS.heartShadowIcon} alt="heart" width={40} height={40} className="h-auto w-10" />
              <div className="flex flex-col">
                <h1 className="text-base font-medium text-white">NEXT LIFE: </h1>
                <p className="text-base font-medium text-white">{countdown}</p>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center">
              <div className="flex flex-col gap-4">
                {TASKS.map((task) => (
                  <TaskItem
                    disabled={task.disabled || false}
                    key={task.id}
                    task={task.task}
                    name={task.name}
                    description={task.description}
                    img={task.img}
                    onClick={task.onClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShowAd && <AdvertisingFrame onClose={() => setIsShowAd(false)} />}
    </>
  );
};

export default Task;
