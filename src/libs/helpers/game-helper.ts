import { appConfigs } from '@src/configs/app-config';
import CryptoJS from 'crypto-js';

export const encrypt = (data: string): string => {
  const encrypted = CryptoJS.AES.encrypt(data, appConfigs.encryptionKey).toString();
  return encrypted;
};

export const encryptLifePoint = (payload: { [key: string]: unknown }): string => {
  return CryptoJS.AES.encrypt(
    JSON.stringify({ ...payload, deadline: Date.now() + 300 * 1000 }),
    payload.userId as string
  ).toString();
};

export const encryptFinishPayload = (payload: { [key: string]: unknown }): string => {
  return CryptoJS.AES.encrypt(
    JSON.stringify({ ...payload, deadline: Date.now() + 300 * 1000 }),
    `${payload.userId}:${payload.gamePlayId}` as string
  ).toString();
};
