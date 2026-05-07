import axiosInstance from "../api/auth/middleware";

export const authService = {
    login: async (login: string, password: string) => {
        const response = await axiosInstance.post('/auth/login', { login, password });
        return response.data;
    },
    verify2FA: async (login: string, Auth2F: string) => {
        const response = await axiosInstance.post('/auth/check2FA', { login, Auth2F });
        return response.data;
    },
    
    resend2FA: async (login: string) => {
        const response = await axiosInstance.post('/auth/resend2FA', { login });
        return response.data;
    }
};