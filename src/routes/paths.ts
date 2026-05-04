export const PATHS = {
    USER_LIST: "/users",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    OWN_EMAIL_CHANGE_MAIN: "/email/change",
    OWN_EMAIL_CHANGE_CONFIRM: "/change-email"
} as const;

export type AppPaths = typeof PATHS[keyof typeof PATHS];
