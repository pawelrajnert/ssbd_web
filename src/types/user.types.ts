export interface AccessLevelDTO {
    accessLevelName: string;
    active: boolean;
}

export interface AccountDTO {
    id: string;
    name: string;
    surname: string;
    login: string;
    email: string;
    lastLoginSuccessDateTime?: string | null;
    version: number;
    versionHash: string;
    active: boolean;
    verified?: boolean;
}

export interface AccountWithAccessLevelsDTO {
    account: AccountDTO;
    accessLevels: AccessLevelDTO[];
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}