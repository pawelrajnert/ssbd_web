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
    versionHash: string;
    isBlocked: boolean;
    verified?: boolean;

    listPageSize?: number | null;
    listSortBy?: string | null;
    listSortDesc?: boolean | null;
}

export interface AccountWithAccessLevelsDTO {
    account: AccountDTO;
    accessLevels: AccessLevelDTO[];
}

export interface SortObject {
    property: string;
    direction: string;
    ascending: boolean;
    descending: boolean;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface ChangeEmailDTO {
    email: string
}

export interface UpdateAccountDTO {
    name: string;
    surname: string;
}
