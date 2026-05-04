import type {RouteObject} from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import {PATHS} from "./paths.ts";
import UserListPage from "../pages/UserList/UserListPage.tsx";
import LoginPage from "../pages/login/LoginPage.tsx";
import Layout from "../layout.tsx";
import {RoleEnum} from "../types/role.types.ts";
import ProtectedRoute from "./ProtectedRoute.tsx";
import AuthLayout from "../shared/layouts/AuthLayout.tsx";
import PasswordResetInitPage from "../pages/password_reset/PasswordResetInitPage.tsx";
import PasswordResetConfirmPage from "../pages/password_reset/PasswordResetConfirmPage.tsx";
import {ProfilePage} from "../pages/profile/ProfilePage.tsx";


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
            // {
            //     path: PATHS.REGISTER,
            //     element: <RegisterPage />
            // }
            {
                path: PATHS.FORGOT_PASSWORD,
                element: <PasswordResetInitPage/>
            },
            {
                path: PATHS.RESET_PASSWORD,
                element: <PasswordResetConfirmPage/>
            }
        ]
        // }]
    },
    {
        element: <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}/>,
        children: [
            {
                element: <Layout/>,
                children: [
                    {
                        index: true,
                        element: <UserListPage/>
                    },
                    {
                        path: PATHS.PROFILE,
                        element: <ProfilePage/>
                    }
                ]
            }
        ]
    }
]

export const router = createBrowserRouter(routes);