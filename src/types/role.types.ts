export const RoleEnum = {
    ADMINISTRATOR: 'ADMIN',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
} as const;

export type Role = typeof RoleEnum[keyof typeof RoleEnum];