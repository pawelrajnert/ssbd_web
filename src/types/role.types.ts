export const RoleEnum = {
    ADMINISTRATOR: 'ADMINISTRATOR',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
} as const;

export type Role = typeof RoleEnum[keyof typeof RoleEnum];