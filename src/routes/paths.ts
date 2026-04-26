export const PATHS = {
    USER_LIST: "/users",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register"
} as const;

export type AppPaths = typeof PATHS[keyof typeof PATHS];
