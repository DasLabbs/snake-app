import { StorageKey } from '../constants/storage';

export const getStorageData = <T>(key: StorageKey) => {
  const data = localStorage.getItem(key);
  if (!data) return null;

  return JSON.parse(data) as T;
};

export const setStorageData = <T>(key: StorageKey, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const removeStorageData = (key: StorageKey) => {
  localStorage.removeItem(key);
};

export const clearStorage = () => {
  localStorage.clear();
};
