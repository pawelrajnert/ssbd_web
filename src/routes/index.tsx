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
import {StudentSubjectListPage} from "../pages/student/StudentSubjectListPage.tsx";
import {TeacherSubjectListPage} from "../pages/teacher/TeacherSubjectListPage.tsx";
import ForcePasswordChangePage from "../pages/auth/force_password_change/ForcePasswordChangePage.tsx";
import UnblockAccountPage from "../pages/auth/unblock/UnblockAccountPage.tsx";
import LoginEmailInitialPage from "../pages/auth/login/EmailLoginInitialPage.tsx";
import LoginEmailVerifyPage from "../pages/auth/login/EmailLoginVerifyPage.tsx";
import TeacherSubjectUsersPage from "../pages/teacher/TeacherSubjectUsersPage.tsx";
import ReportListPage from "../pages/ReportList/ReportListPage.tsx";
import GlobalRulesPage from "../pages/teacher/GlobalRulesPage.tsx";
import {CreateSubjectPage} from "../pages/teacher/CreateSubjectPage";
import StudentScanPage from "../pages/student/StudentScanPage.tsx";


const routes: RouteObject[] = [
    {
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
                element: <TwoFactorVerifyPage/>
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
            },
            {
                path: PATHS.UNBLOCK_ACCOUNT,
                element: <UnblockAccountPage/>
            },
            {
                path: PATHS.LOGIN_EMAIL,
                element: <LoginEmailInitialPage/>
            },
            {
                path: PATHS.LOGIN_EMAIL_VERIFY,
                element: <LoginEmailVerifyPage/>
            }
        ]
    },
    {
        element: <ProtectedRoute allowedRoles={[RoleEnum.FORCE_PASSWORD_CHANGE]}/>,
        children: [
            {
                path: PATHS.FORCE_PASSWORD_CHANGE,
                element: <ForcePasswordChangePage/>
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
    // {
    //     path: PATHS.STUDENT_SCAN,
    //     element: <StudentScanPage/>
    // },
    //         {
    //             path: PATHS.USER_EDIT,
    //             element: <UserEditPage/>
    //         },
    //         // {
    //         //     path: PATHS.OWN_EMAIL_CHANGE_MAIN,
    //         //     element: <EmailChangeInitPage/> //tutaj jak sie odkomentuje to mozna email change testowac bez logowania
    //         // },
    // {
    //     path: PATHS.TEACHER_SUBJECT_USERS,
    //     element: <TeacherSubjectUsersPage/>
    // }
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
        element: <ProtectedRoute allowedRoles={[RoleEnum.STUDENT]}/>,
        children: [
            {
                element: <Layout/>,
                children: [
                    {
                        path: PATHS.STUDENT_SUBJECT_LIST,
                        element: <StudentSubjectListPage/>
                    },
                    {
                        path: PATHS.STUDENT_SCAN,
                        element: <StudentScanPage/>
                    }
                ]
            }
        ]
    },
    {
        element: <ProtectedRoute allowedRoles={[RoleEnum.TEACHER]}/>,
        children: [
            {
                element: <Layout/>,
                children: [
                    {
                        path: PATHS.TEACHER_SUBJECT_LIST,
                        element: <TeacherSubjectListPage/>
                    },
                    {
                        path: PATHS.CREATE_SUBJECT,
                        element: <CreateSubjectPage/>
                    },
                    {
                        path: PATHS.TEACHER_SUBJECT_USERS,
                        element: <TeacherSubjectUsersPage/>
                    },
                    {
                        path: PATHS.REPORT_LIST,
                        element: <ReportListPage/>
                    },
                    {
                        path: PATHS.GLOBAL_RULES,
                        element: <GlobalRulesPage/>
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