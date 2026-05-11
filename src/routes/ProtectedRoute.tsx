import { Navigate, Outlet } from 'react-router-dom';
import { PATHS } from './paths.ts';
import { useAuth } from "../hooks/useAuth";
import {type Role, RoleEnum} from "../types/role.types.ts";

interface HandleProtectionProperties {
    allowedRoles?: Role[];
}

const ProtectedRoute = ({ allowedRoles }: HandleProtectionProperties) => {
    const { isAuthenticated, activeRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={PATHS.LOGIN} replace />;
    }

    const hasPermission = !allowedRoles || allowedRoles.includes(activeRole as Role);

    if (!hasPermission) {
        console.warn("Access Denied. User Role:", activeRole, "Allowed:", allowedRoles);

        if (activeRole === RoleEnum.ADMINISTRATOR) {
            return <Navigate to={PATHS.USER_LIST} replace />;
        } else if (activeRole === RoleEnum.STUDENT) {
            return <Navigate to={PATHS.STUDENT_SUBJECT_LIST} replace />;
        } else if (activeRole === RoleEnum.TEACHER){
            return <Navigate to={PATHS.TEACHER_SUBJECT_LIST} replace/>
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;