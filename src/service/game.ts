import axiosClient from '@src/libs/client/axios-client';
import { encrypt, encryptFinishPayload } from '@src/libs/helpers/game-helper';
import { FinishGamePayload, JoinGameResponse, LeaderBoardResponse } from '@src/libs/types/game.action';

export const joinGame = async () => {
  const res = await axiosClient.post(`/game/start`);
  return res.data?.data as JoinGameResponse;
};

export const finishGame = async (data: FinishGamePayload) => {
  const encryptedPayload = encrypt(encryptFinishPayload(data));

  const res = await axiosClient.post(`/game/finish/${data.gamePlayId}`, {
    payload: encryptedPayload,
  });
  return res.data?.data;
};

export const getLeaderboard = async () => {
  const res = await axiosClient.get(`/game/leader`);
  return res.data?.data as LeaderBoardResponse;
};
