import { useLocation, useNavigate, Link } from "react-router-dom";
import { Bell, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../hooks/useAuth";
import { PATHS } from "../../../routes/paths";
import { useBreadcrumb } from "../../../contexts/BreadcrumbContext";

export default function Header() {
    const { logout, userRole, userLogin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { dynamicBreadcrumb } = useBreadcrumb();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate(PATHS.LOGIN);
    };

    const generateBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(p => p !== '');
        if (paths.length === 0) return [{ name: t('header.dashboard'), path: "/", isLast: true }];

        let currentPath = "";
        return paths.map((path, index) => {
            currentPath += `/${path}`;
            const isLast = index === paths.length - 1;

            let formattedName = path.replace(/-/g, ' ');
            formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

            if (path.toLowerCase() === 'users') {
                formattedName = t('header.userManagement');
            } else if (isLast && dynamicBreadcrumb) {
                formattedName = dynamicBreadcrumb;
            }

            return { name: formattedName, path: currentPath, isLast };
        });
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-8">
                <Link to={"/"}>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                            {t('header.title')}
                        </h1>
                        <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">
                            {t('header.subtitle')}
                        </p>
                    </div>
                </Link>
                <div className="h-8 w-px bg-red-100 hidden md:block"></div>
                <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {index > 0 && <span className="text-gray-300">/</span>}
                            {crumb.isLast ? (
                                <span className="text-[#7A1014] border-b border-[#7A1014]">
                                    {crumb.name}
                                </span>
                            ) : (
                                <Link to={crumb.path} className="text-gray-400 hover:text-[#7A1014] transition-colors">
                                    {crumb.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-gray-600">
                    <button className="hover:text-[#7A1014] transition-colors">
                        <Bell size={20} />
                    </button>
                    <button className="hover:text-[#7A1014] transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{userLogin || t('header.defaultUser')}</p>
                        <p className="text-xs text-gray-500 tracking-wider uppercase">{userRole || t('header.defaultGuest')}</p>
                    </div>
                    <Link to={PATHS.PROFILE}>
                        <div className="relative">
                            <div className="w-10 h-10 bg-red-500 rounded-md overflow-hidden flex items-center justify-center">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userLogin || 'default'}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-bold text-[#7A1014] hover:text-red-900 transition-colors ml-2"
                >
                    {t('header.logout')}
                </button>
            </div>
        </header>
    );
}