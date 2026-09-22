import { useAuth } from '@/stores/authStore';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessTk = useAuth.getState().accessTk;

    if (accessTk) {
      config.headers.Authorization = `Bearer ${accessTk}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<{ status: number; accessToken: string }> | null = null;

const attemptRefresh = async (): Promise<{ status: number; accessToken: string }> => {
  if (refreshPromise) {
    return refreshPromise;
  }
  refreshPromise = (async () => {
    try {
      console.log("refreshing auth tokens")
      const response = await axios.post<{ status: number; accessToken: string }>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      console.log(" Finished!! refreshing auth tokens")
      return response.data;
    } catch (error) {
      useAuth.getState().clearToken();
      console.error('Refresh token failed. Logging out user...', error);
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errConfig = error.config as typeof error.config & { is_retried?: boolean };
    const url = errConfig?.url ?? '';
    const isAuthEndpoint =
      url.includes('/auth/refresh') ||
      url.includes('/auth/login') ||
      url.includes('/auth/logout');

    if (error.response?.status === 401 && !errConfig.is_retried && !isAuthEndpoint) {
      errConfig.is_retried = true;

      try {
        console.log("Actually testing the auth refresh")
        const data = await attemptRefresh();

        if (data?.accessToken) {
        // Extract the setter function from the store
        const setAccessToken = useAuth.getState().setAccessToken;

        // Call it directly with your new token
        setAccessToken(data.accessToken as string | null);
          errConfig.headers = errConfig.headers ?? {};
          errConfig.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(errConfig);
        }
      } catch (refreshError) {
        console.log("could not refresh so im sending you back to the login page")
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;