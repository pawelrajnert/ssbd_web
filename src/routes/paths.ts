export const PATHS = {
    USER_LIST: "/users",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
    ACTIVATE: "/activate"
} as const;

export type AppPaths = typeof PATHS[keyof typeof PATHS];
