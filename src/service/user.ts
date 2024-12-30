import axiosClient from '@src/libs/client/axios-client';
import baseClient from '@src/libs/client/base-client';
import { encrypt, encryptLifePoint } from '@src/libs/helpers/game-helper';
import {
  IncreaseLifePoint,
  SocialLifePointPayload,
  UserLoginPayload,
  UserLoginResponse,
  UserProfilePayload,
} from '@src/libs/types/user.action';

export const generateAccessToken = async (refreshToken: string) => {
  const res = await baseClient.get('/user/refresh', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return res.data?.data as UserLoginResponse;
};

export const login = async (data: UserLoginPayload) => {
  const res = await baseClient.post('/user/login', data);
  return res.data?.data as UserLoginResponse;
};

export const getUser = async () => {
  const res = await axiosClient.get('/user');
  return res.data?.data as UserProfilePayload;
};

export const addLifePointSocial = async (data: SocialLifePointPayload) => {
  const res = await axiosClient.post('/user/social', data);
  return res.data?.data;
};

export const increaseLifePoint = async (data: IncreaseLifePoint) => {
  const encryptedPayload = encrypt(encryptLifePoint(data));
  const res = await axiosClient.post('/user/life', {
    payload: encryptedPayload,
  });
  return res.data?.data;
};
