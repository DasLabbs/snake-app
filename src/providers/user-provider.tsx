'use client';
import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useStartGame from '@src/hooks/use-start-game';
import useUser from '@src/hooks/use-user';
import { StorageKey } from '@src/libs/constants/storage';
import { removeStorageData, setStorageData } from '@src/libs/helpers/storage';
import { UserLoginPayload } from '@src/libs/types/user.action';
import { login } from '@src/service/user';
import { useMutation } from '@tanstack/react-query';

type UserProviderProps = {
  children: React.ReactNode;
};

type UserContextState = {
  isLoading: boolean;
  login: (email: string) => void;
  start: () => void;
  refetchUser: () => void;
};

const UserContext = createContext<UserContextState | null>(null);

const UserProvider = (props: UserProviderProps) => {
  const { children } = props;
  const { refetch, isLoading } = useUser();
  const navigate = useNavigate();

  const { startGame, isLoading: isLoadGame } = useStartGame(() => {
    navigate(`/game-play`);
  });

  const { mutate: _login, isPending } = useMutation({
    mutationFn: (data: UserLoginPayload) => login(data),
    onSuccess: (data) => {
      setStorageData(StorageKey.ACCESS_TOKEN, data.accessToken);
      setStorageData(StorageKey.REFRESH_TOKEN, data.refreshToken);
      refetch();
      startGame();
    },
    onError: () => {
      toast.error('Failed to login !');
      removeStorageData(StorageKey.ACCESS_TOKEN);
      removeStorageData(StorageKey.REFRESH_TOKEN);
    },
  });

  const handleLogin = (email: string) => {
    _login({
      userEmail: email,
    });
  };

  return (
    <UserContext.Provider
      value={{
        isLoading: isLoading || isPending || isLoadGame,
        login: handleLogin,
        start: startGame,
        refetchUser: refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUserProvider = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserProvider must be used within a UserProvider');
  }
  return context;
};
