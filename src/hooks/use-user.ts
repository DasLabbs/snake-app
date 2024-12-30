import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '@src/libs/constants/query-key';
import { StorageKey } from '@src/libs/constants/storage';
import { getStorageData, removeStorageData } from '@src/libs/helpers/storage';
import { getUser } from '@src/service/user';
import { useGameStore } from '@src/stores/game';
import { useUserStore } from '@src/stores/user';
import { useQuery } from '@tanstack/react-query';

const useUser = () => {
  const accessToken = typeof window !== 'undefined' && getStorageData<string>(StorageKey.ACCESS_TOKEN);
  const { setLives, setLastLifeRegeneration } = useGameStore();
  const { user, setUser, setSocialLinks, setNumberAdsWatched } = useUserStore();
  const navigate = useNavigate();

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [QUERY_KEYS.USER.ME],
    queryFn: getUser,
    enabled: !!accessToken && !user,
  });

  useEffect(() => {
    if (data) {
      setUser({
        userEmail: data.userEmail,
        id: data.id,
      });
      setLives(data.lifePoints);
      setSocialLinks(data.socialLinks);
      setNumberAdsWatched(data.adsWatch);
      setLastLifeRegeneration(data.lastRegen);
    }
  }, [data]);

  useEffect(() => {
    if (!accessToken && window.location.pathname !== '/') {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.log('error: ', error);
      removeStorageData(StorageKey.ACCESS_TOKEN);
      removeStorageData(StorageKey.REFRESH_TOKEN);
      window.location.reload();
    }
  }, [error]);

  return { user, isLoading, refetch };
};

export default useUser;
