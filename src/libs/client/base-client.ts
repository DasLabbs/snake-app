import { appConfigs } from '@src/configs/app-config';
import axios from 'axios';

const baseClient = axios.create({
  baseURL: appConfigs.apiURL,
});

export default baseClient;
