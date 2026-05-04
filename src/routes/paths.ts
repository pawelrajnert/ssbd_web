export const PATHS = {
    USER_LIST: "/users",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    PROFILE: "/profile"
} as const;

export type AppPaths = typeof PATHS[keyof typeof PATHS];
