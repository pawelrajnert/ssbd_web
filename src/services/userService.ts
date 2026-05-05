import axiosInstance from "../api/auth/middleware";
import type {AccountWithAccessLevelsDTO} from "../types/user.types";

export const userService = {
    getUsers: async (page: number, size: number, /*phrase: string = ""*/) => {
        // Symulacja opóźnienia sieciowego
        await new Promise(resolve => setTimeout(resolve, 500));

        // Zwracamy sztuczne dane (MOCK), które frontend wyświetli bez pytania backendu
        return {
            content: [
                {
                    account: {
                        id: "123-uuid-admin",
                        name: "Andrzej",
                        surname: "Kowalski",
                        login: "a.kowalski",
                        email: "a.kowalski@p.lodz.pl",
                        lastLoginSuccessDateTime: "2026-05-05T20:00:00",
                        version: 1,
                        versionHash: "hash123",
                        active: true
                    },
                    accessLevels: [{ accessLevelName: "TEACHER", active: true }]
                }
            ],
            totalElements: 1,
            totalPages: 1,
            size: size,
            number: page
        };
    },

    // Podobnie zrób dla pobierania jednego użytkownika pod edycję (MOK.11)
    getAccountById: async (id: string) => {
        return {
            account: {
                id: id,
                name: "Andrzej",
                surname: "Kowalski",
                login: "a.kowalski",
                email: "a.kowalski@p.lodz.pl",
                version: 1,
                versionHash: "hash123",
                active: true
            },
            accessLevels: [{ accessLevelName: "TEACHER", active: true }]
        };
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