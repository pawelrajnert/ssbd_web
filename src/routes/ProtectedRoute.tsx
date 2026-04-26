import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { PATHS } from './paths.ts';
import { useAuth } from "../hooks/useAuth";
import {type Role, RoleEnum} from "../types/role.types.ts";

interface HandleProtectionProperties {
    allowedRoles?: Role[];
}

const ProtectedRoute = ({ allowedRoles }: HandleProtectionProperties) => {
    const { isAuthenticated, userRole } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
    }

    const hasPermission = !allowedRoles || allowedRoles.includes(userRole as Role);

    if (!hasPermission) {
        console.warn("Access Denied. User Role:", userRole, "Allowed:", allowedRoles);

        //TODO: Zmienić na strony na które będziemy robić redirect w przypadku odmowy przejścia na jakąś stronę
        if (userRole === RoleEnum.ADMIN) {
            return <Navigate to="/admin/cos/tam" replace />;
        } else if (userRole === RoleEnum.STUDENT) {
            return <Navigate to="/student/cos/tam" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;