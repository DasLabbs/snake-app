import { memo, useMemo, useState } from 'react';
import { VIDEOS } from '@src/assets';
import { useTranslation } from '@src/hooks/use-translation';
import { IncreaseLifePoint } from '@src/libs/types/user.action';
import { increaseLifePoint } from '@src/service/user';
import { useGameStore } from '@src/stores/game';
import { useUserStore } from '@src/stores/user';
import { useMutation } from '@tanstack/react-query';

type AdvertisingFrameProps = {
  onClose: () => void;
};

const AdvertisingFrame = (props: AdvertisingFrameProps) => {
  const { onClose } = props;
  const [isSkipVisible, setIsSkipVisible] = useState(false);
  const { setLives, lives } = useGameStore();
  const { user, incrementAdsWatched } = useUserStore();
  const { translate } = useTranslation();
  const { mutate: _increase } = useMutation({
    mutationFn: (data: IncreaseLifePoint) => increaseLifePoint(data),
    onSuccess: () => {
      incrementAdsWatched();
      setLives(lives + 1);
    },
  });

  const selectedVideo = useMemo(() => VIDEOS[Math.floor(Math.random() * VIDEOS.length)], []);

  const onBack = () => {
    _increase({ userId: user?.id as string, currentLifePoint: lives });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[11] flex flex-col items-center justify-center">
      <div className="relative size-full">
        <div className="absolute left-3 top-3 z-10 flex h-[30px]">
          {isSkipVisible && (
            <button className="text-sm uppercase text-white" onClick={onBack}>
              {'<'} {translate('back_button')}
            </button>
          )}
        </div>
        <div className="size-full">
          <video
            src={selectedVideo}
            autoPlay
            playsInline
            className="h-full w-full bg-black object-contain"
            onEnded={() => {
              setIsSkipVisible(true);
            }}
          />
          <video />
        </div>
      </div>
    </div>
  );
};

export default memo(AdvertisingFrame);
