import axios from 'axios';
import type {FailedQueueItem} from "../../types/failed_query.type.ts";

const baseURL = 'http://localhost:8080/PAS_SPA/api/v1';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
});

// Variables to handle concurrent requests during a token refresh
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401s for token refreshing
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If a refresh is already happening, queue this request
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            const refToken = sessionStorage.getItem('refresh_token');

            if (refToken) {
                try {
                    // Use a clean axios instance to avoid interceptor loops, but keep it dynamic
                    const res = await axios.post(`${baseURL}/auth/refresh`, {
                        refreshToken: refToken
                    });

                    if (res.status === 200) {
                        const { accessToken, refreshToken: newRefreshToken } = res.data;

                        sessionStorage.setItem('access_token', accessToken);
                        sessionStorage.setItem('refresh_token', newRefreshToken);

                        // Process the queue with the new token
                        processQueue(null, accessToken);

                        // Retry the original request
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    sessionStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                sessionStorage.clear();
                window.location.href = '/login';
            }
        }

        // Let the calling function handle 403s or other errors
        return Promise.reject(error);
    }
);

export default axiosInstance;