import axiosInstance from "../api/auth/middleware";

export const emailChangeService = {
    requestEmailChange: async () => {
        const response = await axiosInstance.post('/account/email/change');
        return response.data;
    },

    confirmEmailChange: async (token: string, password: string, newEmail: string) => {
        const response = await axiosInstance.post('/account/email/confirm', {
            token,
            password,
            newEmail
        });
        return response.data;
    }
};