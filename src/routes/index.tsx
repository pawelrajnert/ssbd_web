import type {RouteObject} from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import {PATHS} from "./paths.ts";
import UserListPage from "../pages/UserList/UserListPage.tsx";
import LoginPage from "../pages/auth/login/LoginPage.tsx";
import Layout from "../layout.tsx";
import {RoleEnum} from "../types/role.types.ts";
import ProtectedRoute from "./ProtectedRoute.tsx";
import AuthLayout from "../shared/layouts/AuthLayout.tsx";
import RegisterPage from "../pages/auth/register/RegisterPage.tsx";
import ActivatePage from "../pages/auth/activate/ActivatePage.tsx";
import PasswordResetInitPage from "../pages/auth/password_reset/PasswordResetInitPage.tsx";
import PasswordResetConfirmPage from "../pages/auth/password_reset/PasswordResetConfirmPage.tsx";

import EmailChangeConfirmPage from "../pages/own_email_change/EmailChangeConfirmPage.tsx";
import UserEditPage from "../pages/UserEdit/UserEditPage.tsx";
import EmailChangeRevertPage from "../pages/own_email_change/EmailChangeRevertPage.tsx";
import TwoFactorVerifyPage from "../pages/auth/login/TwoFactorAuthorizationPage.tsx";

const routes: RouteObject[] = [
    {
        //odkomentować jeżeli chcecie zobaczyć header na login page
        // element: <Layout />,
        // children: [{
        element: <AuthLayout/>,
        children: [
            {
                index: true,
                element: <LoginPage/>
            },
            {
                path: PATHS.LOGIN,
                element: <LoginPage/>
            },
            {
                path: PATHS._2FA_VERIFY,
                element: <TwoFactorVerifyPage />
            },
            {
                path: PATHS.REGISTER,
                element: <RegisterPage/>
            },
            {
                path: PATHS.ACTIVATE,
                element: <ActivatePage/>
            },
            {
                path: PATHS.FORGOT_PASSWORD,
                element: <PasswordResetInitPage/>
            },
            {
                path: PATHS.RESET_PASSWORD,
                element: <PasswordResetConfirmPage/>
            },
            {
                path: PATHS.OWN_EMAIL_CHANGE_CONFIRM,
                element: <EmailChangeConfirmPage/>
            },
            {
                path: PATHS.OWN_EMAIL_CHANGE_REVERT,
                element: <EmailChangeRevertPage/>
            }
        ]
    },
    // {
    //     element: <Layout/>,
    //     children: [
    //         {
    //             path: PATHS.USER_LIST,
    //             element: <UserListPage/>
    //         },
    //         {
    //             path: PATHS.USER_EDIT,
    //             element: <UserEditPage/>
    //         },
    //         {
    //             path: PATHS.OWN_EMAIL_CHANGE_MAIN,
    //             element: <EmailChangeInitPage/> //tutaj jak sie odkomentuje to mozna email change testowac bez logowania
    //         }
    //     ]
    // }, //dla testu :)
    {
        element: <ProtectedRoute allowedRoles={[RoleEnum.ADMINISTRATOR, RoleEnum.STUDENT, RoleEnum.TEACHER]}/>,
        children: [
            {
                element: <Layout/>,
                children: [
                    // {
                    //     path: PATHS.PROFILE,
                    //     element: <ProfilePage/>
                    // },
                    // {
                    //     path: PATHS.OWN_EMAIL_CHANGE_MAIN,
                    //     element: <EmailChangeInitPage/>
                    // },
                    {
                        path: PATHS.PROFILE,
                        element: <UserEditPage/>
                    }
                ]
            }
        ]
    },
    {
        element: <ProtectedRoute allowedRoles={[RoleEnum.ADMINISTRATOR]}/>,
        children: [
            {
                element: <Layout/>,
                children: [
                    {
                        path: PATHS.USER_LIST,
                        element: <UserListPage/>
                    },
                    {
                        path: PATHS.USER_EDIT,
                        element: <UserEditPage/>
                    }
                ]
            }
        ]
    }
]

export const router = createBrowserRouter(routes);