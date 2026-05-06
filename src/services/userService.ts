import axiosInstance from "../api/auth/middleware";
import type {AccountWithAccessLevelsDTO, Page, UpdateAccountDTO} from "../types/user.types";

export const userService = {
    getUsers: async (page: number, size: number, phrase: string = "") => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (phrase.trim() !== "") {
            params.append('phrase', phrase.trim());
        }

        const response = await axiosInstance.get<Page<AccountWithAccessLevelsDTO>>('/account', {params});
        return response.data;
    },

    getAccountById: async (id: string) => {
        const response = await axiosInstance.get<AccountWithAccessLevelsDTO>(`/account/${id}`);
        return response.data;
    },
    getAccountByLogin: async (login: string | null) => {
        const response = await axiosInstance.get<AccountWithAccessLevelsDTO>(`/account/login/${login}`);
        return response.data;
    },

    grantAccessLevel: async (id: string, accessLevelName: string, versionHash: string) => {
        const response = await axiosInstance.post<AccountWithAccessLevelsDTO>(
            `/account/${id}/access-levels/${accessLevelName}/grant`,
            null,
            {
                headers:
                    {
                        "If-Match": versionHash
                    }
            }
        );
        return response.data;
    },

    revokeAccessLevel: async (id: string, accessLevelName: string, versionHash: string) => {
        const response = await axiosInstance.post<AccountWithAccessLevelsDTO>(
            `/account/${id}/access-levels/${accessLevelName}/revoke`,
            null,
            {
                headers:
                    {
                        "If-Match": versionHash
                    }
            }
        );
        return response.data;
    },

    blockUser: async (id: string, version_hash: string) => {
        const response = await axiosInstance.post(`/account/block/${id}`,
            null,
            {
                headers: {
                    'If-Match': version_hash
                }
            });
        return response.data;
    },

    unblockUser: async (id: string, version_hash: string) => {
        const response = await axiosInstance.post(`/account/unblock/${id}`,
            null,
            {
                headers: {
                    'If-Match': version_hash
                }
            });
        return response.data;
    },

    updateUserDetails: async (id: string, data: UpdateAccountDTO, version_hash: string) => {
        const response = await axiosInstance.patch(`/account/${id}`,
            data,
            {
                headers: {
                    'If-Match': version_hash
                }
            });
        return response.data;
    },

    updateMyDetails: async (data: UpdateAccountDTO, version_hash: string) => {
        const response = await axiosInstance.patch(`/account/update-myself`,
            data,
            {
                headers: {
                    'If-Match': version_hash
                }
            });
        return response.data;
    }
};