import axios from 'axios';
import { ipURL } from './backendUrl';

const axiosInstance = axios.create({
  baseURL: `${ipURL}`,
});

// Function to set token dynamically
export const setAuthorizationHeader = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export default axiosInstance;
