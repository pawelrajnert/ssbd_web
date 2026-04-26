export const RoleEnum = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
} as const;

export type Role = typeof RoleEnum[keyof typeof RoleEnum];