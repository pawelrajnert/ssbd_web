export const PATHS = {
    USER_LIST: "/users",
    USER_EDIT: "/users/:id",
    USER_EDIT_ME: "/users/me",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
    ACTIVATE: "/activate",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    PROFILE: "/profile",
    OWN_EMAIL_CHANGE_MAIN: "/email/change",
    OWN_EMAIL_CHANGE_CONFIRM: "/change-email",
    OWN_EMAIL_CHANGE_REVERT: "/revert-email",
    _2FA_VERIFY: "/login/2fa"
} as const;

export type AppPaths = typeof PATHS[keyof typeof PATHS];
