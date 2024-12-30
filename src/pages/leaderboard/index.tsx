import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS } from '@src/assets';
import PreLoader from '@src/components/shared/pre-loader';
import { useTranslation } from '@src/hooks/use-translation';
import { QUERY_KEYS } from '@src/libs/constants/query-key';
import { getLeaderboard } from '@src/service/game';
import { useQuery } from '@tanstack/react-query';

const Leaderboard = () => {
  const { translate } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.GAME.LEADERBOARD],
    queryFn: getLeaderboard,
  });

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <PreLoader />;
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-3 top-3 cursor-pointer text-xs font-medium text-[#B20025]" onClick={handleBack}>
        {'<'} {translate('back_button')}
      </div>
      <div className="flex h-full w-full flex-col items-center gap-1 px-4 pb-4 pt-10">
        <h1 className="text-lg font-semibold uppercase tracking-widest text-[#B20025]">
          {translate('leaderboard_title')}
        </h1>
        <div className="dotted-border  relative flex h-[200px] w-full  flex-1 flex-col p-6">
          {/* Leaderboard List */}
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
            <table className="w-full table-auto border-separate border-spacing-y-1">
              <tbody className="">
                {data &&
                  data.map((player, index) => (
                    <tr key={`rank-${index}`} className="text-xs font-light">
                      <td>
                        <div className="flex items-center gap-2">
                          <span>{index + 1}.</span>
                          <span className="max-w-[120px] truncate">{player.userEmail}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <img src={ASSETS.pointIcon} alt="star" width={12} height={12} className="h-3 w-3" />
                          <span>{player.highestPoint}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="h-20 w-full"></div>
        </div>
      </div>
      <div className="absolute bottom-0 right-[6px] z-[1] bg-white pl-8">
        <img src={ASSETS.snakeWithTailImg} alt="snake" className="w-28" />
      </div>
    </div>
  );
};

export default Leaderboard;
