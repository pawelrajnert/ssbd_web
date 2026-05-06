import axiosInstance from "../api/auth/middleware";

export const authService = {
    login: async (login: string, password: string) => {
        const response = await axiosInstance.post('/auth/login', { login, password });
        return response.data;
    }
};