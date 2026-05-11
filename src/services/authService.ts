import axiosInstance from "../api/auth/middleware";

export const authService = {
    login: async (login: string, password: string) => {
        const response = await axiosInstance.post('/auth/login', { login, password });
        return {response: response.data, status: response.status};
    },
    verify2FA: async (login: string, auth2F: string) => {
        const response = await axiosInstance.post('/auth/check2FA', { login, auth2F });
        return response.data;
    },
    resend2FA: async (login: string) => {
        const response = await axiosInstance.post('/auth/resend2FA', { login });
        return response.data;
    }
};

export const loginWithGoogle = async (idToken: string) => {
    const response = await axiosInstance.post('/auth/google', { idToken });
    return response.data;
};