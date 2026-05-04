export const PATHS = {
    USER_LIST: "/users",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
    ACTIVATE: "/activate",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password"
} as const;

export type AppPaths = typeof PATHS[keyof typeof PATHS];
