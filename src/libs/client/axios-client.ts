import { appConfigs } from '@src/configs/app-config';
import { generateAccessToken } from '@src/service/user';
import axios, { AxiosError, AxiosResponse } from 'axios';

import { StorageKey } from '../constants/storage';
import { getStorageData, removeStorageData, setStorageData } from '../helpers/storage';

let isRefreshing = false;
let failedQueue: { resolve: (value: string) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

const axiosClient = axios.create({
  baseURL: appConfigs.apiURL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getStorageData<string>(StorageKey.ACCESS_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => handleResponse(response),
  async (error: AxiosError) => handleErrorResponse(error)
);

const handleResponse = (response: AxiosResponse) => response;

const handleErrorResponse = async (error: AxiosError): Promise<AxiosResponse | undefined> => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && originalRequest) {
    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return await axiosClient.request(originalRequest);
      } catch (err) {
        console.log('err: ', err);
        return Promise.reject(err);
      }
    }

    isRefreshing = true;
    const refreshToken = getStorageData<string>(StorageKey.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        const data = await generateAccessToken(refreshToken);
        setStorageData(StorageKey.ACCESS_TOKEN, data.accessToken);
        setStorageData(StorageKey.REFRESH_TOKEN, data.refreshToken);
        processQueue(null, data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return await axiosClient.request(originalRequest);
      } catch (refreshError) {
        removeStorageData(StorageKey.ACCESS_TOKEN);
        removeStorageData(StorageKey.REFRESH_TOKEN);

        processQueue(refreshError as AxiosError, null);
        window.location.href = '/';
        return Promise.reject(handleError(refreshError as AxiosError));
      } finally {
        isRefreshing = false;
      }
    }
  }

  return Promise.reject(handleError(error));
};

const handleError = (error: AxiosError) => {
  return error;
};

export default axiosClient;
