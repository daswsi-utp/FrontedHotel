import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosRetry(api, {
  retries: 3,
  retryDelay: retryCount => retryCount * 1000,
  retryCondition: (error) =>
    axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error) || error.response?.status >= 500,
});

export default api;
