import api from '../api/auth/middleware';

export interface ChangeOwnPasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export const getAccountByLogin = async (login: string) => {
    // Korzystamy z endpointu z AccountController
    const response = await api.get(`/account/login/${login}`);
    return response.data;
};

export const changeOwnPassword = async (data: ChangeOwnPasswordDto, version: number) => {
    return await api.post('/account/security/password', data, {
        headers: {
            'If-Match': version.toString()
        }
    });
};