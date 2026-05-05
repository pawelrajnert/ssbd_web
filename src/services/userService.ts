import axiosInstance from "../api/auth/middleware";
import type {Page, AccountWithAccessLevelsDTO} from "../types/user.types";

export const userService = {
    getUsers: async (page: number, size: number, phrase: string = "") => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (phrase.trim() !== "") {
            params.append('phrase', phrase.trim());
        }

        const response = await axiosInstance.get<Page<AccountWithAccessLevelsDTO>>('/account', { params });
        return response.data;
    },

    getAccountById: async (id: string) => {
        const response = await axiosInstance.get<AccountWithAccessLevelsDTO>(`/account/${id}`);
        return response.data;
    },

    grantAccessLevel: async (id: string, accessLevelName: string, versionHash: string) => {
        const response = await axiosInstance.post<AccountWithAccessLevelsDTO>(
            `/account/${id}/access-levels/${accessLevelName}/grant`,
            { versionHash }
        );
        return response.data;
    },

    revokeAccessLevel: async (id: string, accessLevelName: string, versionHash: string) => {
        const response = await axiosInstance.post<AccountWithAccessLevelsDTO>(
            `/account/${id}/access-levels/${accessLevelName}/revoke`,
            { versionHash }
        );
        return response.data;
    }
};