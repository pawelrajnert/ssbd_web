import api from '../api/auth/middleware';

export interface ChangeOwnPasswordPayload {
    oldPassword: string;
    newPassword: string;
}

export const getAccountByLogin = async (login: string) => {
    const response = await api.get(`/account/login/${login}`);
    return response.data;
};

export const changeOwnPassword = async (data: ChangeOwnPasswordPayload, version: number) => {
    return await api.post('/account/security/password', data, {
        headers: {
            'If-Match': version.toString()
        }
    });
};