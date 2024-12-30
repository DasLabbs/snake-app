import toast from 'react-hot-toast';
import { JoinGameResponse } from '@src/libs/types/game.action';
import { joinGame } from '@src/service/game';
import { useGameStore } from '@src/stores/game';
import { useMutation } from '@tanstack/react-query';

const useStartGame = (callback?: (data: JoinGameResponse) => void) => {
  const { setCurrentGameId, setScore } = useGameStore();
  const { mutate: _start, isPending } = useMutation({
    mutationFn: () => joinGame(),
    onSuccess: (data: JoinGameResponse) => {
      setScore(0);
      setCurrentGameId(data.id);
      callback && callback(data);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  return { startGame: _start, isLoading: isPending };
};

export default useStartGame;
