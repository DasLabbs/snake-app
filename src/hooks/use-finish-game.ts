import { FinishGamePayload, FinishGameResponse } from '@src/libs/types/game.action';
import { finishGame } from '@src/service/game';
import { useMutation } from '@tanstack/react-query';

const useFinishGame = (callback?: (res: FinishGameResponse) => void) => {
  const { mutate: _finish, isPending } = useMutation({
    mutationFn: (data: FinishGamePayload) => finishGame(data),
    onSuccess: (data: FinishGameResponse) => {
      callback && callback(data);
    },
    onError: (error) => {
      console.log('error: ', error);
    },
  });

  return { finishGame: _finish, isLoading: isPending };
};

export default useFinishGame;
