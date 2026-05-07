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
    // version: string;
    versionHash: string;
    isBlocked: boolean; //może jak dodam komentarz to się zmienią
    verified?: boolean; // te pola na prodzie? Bo kurwa nie zmieniają się co bym nie robił
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
