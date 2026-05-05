import axiosInstance from "../api/auth/middleware";
import type {AccountDTO, ChangeEmailDTO} from "../types/user.types.ts";

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
    },

    changeEmailByAdmin: async (id:string ,dto: ChangeEmailDTO): Promise<AccountDTO> => {
        const response = await axiosInstance.patch(`/account/${id}/email`, dto);
        return response.data;
    }
};