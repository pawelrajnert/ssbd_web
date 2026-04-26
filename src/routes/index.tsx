import type {RouteObject} from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import {PATHS} from "./paths.ts";
import UserListPage from "../pages/UserList/UserListPage.tsx";
import LoginPage from "../pages/login/LoginPage.tsx";
import Layout from "../layout.tsx";
import {RoleEnum} from "../types/role.types.ts";
import ProtectedRoute from "./ProtectedRoute.tsx";
import AuthLayout from "../shared/layouts/AuthLayout.tsx";

const routes: RouteObject[] = [
    {
        element: <AuthLayout />,
        children: [
            {
                path: PATHS.LOGIN,
                element: <LoginPage />
            },
            // {
            //     path: PATHS.REGISTER,
            //     element: <RegisterPage />
            // }
        ]
    },
    // PROTECTED ROUTES FOR ADMINS ONLY
    {
        element: <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}/>,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        index: true, // This is still "/"
                        element: <UserListPage/>
                    }
                ]
            }
        ]
    }
]

export const router = createBrowserRouter(routes);