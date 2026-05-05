export const PATHS = {
    USER_LIST: "/users",
    USER_EDIT: "/users/:id",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
    ACTIVATE: "/activate",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    PROFILE: "/profile",
    OWN_EMAIL_CHANGE_MAIN: "/email/change",
    OWN_EMAIL_CHANGE_CONFIRM: "/change-email"
} as const;

export type AppPaths = typeof PATHS[keyof typeof PATHS];
