import type {RouteObject} from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import {PATHS} from "./paths.ts";
import UserListPage from "../pages/UserList/UserListPage.tsx";
import LoginPage from "../pages/login/LoginPage.tsx";
import Layout from "../layout.tsx";
import {RoleEnum} from "../types/role.types.ts";
import ProtectedRoute from "./ProtectedRoute.tsx";
import AuthLayout from "../shared/layouts/AuthLayout.tsx";
import RegisterPage from "../pages/register/RegisterPage.tsx";
import ActivatePage from "../pages/activate/ActivatePage.tsx";
import PasswordResetInitPage from "../pages/password_reset/PasswordResetInitPage.tsx";
import PasswordResetConfirmPage from "../pages/password_reset/PasswordResetConfirmPage.tsx";
import {ProfilePage} from "../pages/profile/ProfilePage.tsx";
import EmailChangeInitPage from "../pages/own_email_change/EmailChangeMainPage.tsx";
import EmailChangeConfirmPage from "../pages/own_email_change/EmailChangeConfirmPage.tsx";

const routes: RouteObject[] = [
    {
        //odkomentować jeżeli chcecie zobaczyć header na login page
        // element: <Layout />,
        // children: [{
        element: <AuthLayout/>,
        children: [
            {
                path: PATHS.LOGIN,
                element: <LoginPage/>
            },
            {
                path: PATHS.REGISTER,
                element: <RegisterPage/>
            },
            {
                path: PATHS.ACTIVATE,
                element: <ActivatePage />
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
                path: PATHS.OWN_EMAIL_CHANGE_MAIN,
                element: <EmailChangeInitPage/> //tutaj jak sie odkomentuje to mozna email change testowac bez logowania
            }
        ]
        // }]
    },
    {
        element: <ProtectedRoute allowedRoles={[RoleEnum.ADMIN, RoleEnum.STUDENT, RoleEnum.TEACHER]}/>,
        children: [
            {
                element: <Layout/>,
                children: [
                    {
                        path: PATHS.USER_LIST,
                        element: <UserListPage/>
                    },
                    {
                        path: PATHS.PROFILE,
                        element: <ProfilePage/>
                    }
                    // {
                    //     path: PATHS.OWN_EMAIL_CHANGE_MAIN,
                    //     element: <EmailChangeInitPage/> //to potem odkomentowac zeby bylo za blokada
                    // }
                ]
            }
        ]
    }
]

export const router = createBrowserRouter(routes);