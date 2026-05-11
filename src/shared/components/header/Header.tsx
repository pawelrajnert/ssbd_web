import {useLocation, useNavigate, Link} from "react-router-dom";
import {Bell, Globe, Settings, Shield} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../hooks/useAuth";
import {PATHS} from "../../../routes/paths";
import {useBreadcrumb} from "../../../contexts/BreadcrumbContext";
import i18n from "i18next";
import {useEffect, useRef, useState} from "react";

export default function Header() {
    const {logout, availableRoles, changeActiveRole, activeRole, userLogin} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const {dynamicBreadcrumb} = useBreadcrumb();
    const {t} = useTranslation();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate(PATHS.LOGIN);
    };

    const generateBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(p => p !== '');
        if (paths.length === 0) return [{name: t('header.dashboard'), path: "/", isLast: true}];

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

            return {name: formattedName, path: currentPath, isLast};
        });
    };

    const breadcrumbs = generateBreadcrumbs();

    const getRoleIndicatorColor = (role: string | null) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return 'bg-blue-500';
            case 'TEACHER':
                return 'bg-red-500';
            case 'STUDENT':
                return 'bg-green-500';
            default:
                return 'bg-transparent';
        }
    };
    const getDefaultLocationPath = (role: string | null) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return PATHS.USER_LIST;
            case 'TEACHER':
                return PATHS.TEACHER_SUBJECT_LIST
            case 'STUDENT':
                return PATHS.STUDENT_SUBJECT_LIST;
            default:
                return '/';
        }
    };

    return (
        <header className="relative flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-8">
                <Link to={getDefaultLocationPath(activeRole)}>
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
                        <Bell size={20}/>
                    </button>
                    <div className="relative" ref={settingsRef}>
                        <button
                            className={`p-2 rounded-full transition-colors ${isSettingsOpen ? 'bg-red-50 text-[#7A1014]' : 'hover:text-[#7A1014]'}`}
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        >
                            <Settings size={20} />
                        </button>

                        {isSettingsOpen && (
                            <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 p-5 z-50">
                                <h3 className="text-base font-bold text-gray-900 mb-5">{t("header.settings.name")}</h3>


                                <div className="mb-5">
                                    <p className="text-[11px] font-bold text-gray-500 mb-2 tracking-wider flex items-center gap-2 uppercase">
                                        <Globe size={14} /> {t("header.settings.language")}
                                    </p>
                                    <select
                                        value={i18n.language}
                                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                                        className="w-full bg-transparent text-sm font-semibold text-gray-800 border-b border-gray-200 py-2 outline-none cursor-pointer hover:border-[#7A1014] transition-colors appearance-none"
                                    >
                                        <option value="en">🇺🇸 English (US)</option>
                                        <option value="pl">🇵🇱 Polish (PL)</option>
                                        <option value="uk">🇺🇦 Ukrainian (UK)</option>
                                    </select>
                                </div>

                                {availableRoles.length > 1 && (
                                    <div className="mb-6">
                                        <p className="text-[11px] font-bold text-gray-500 mb-2 tracking-wider flex items-center gap-2 uppercase">
                                            <Shield size={14} /> {t("header.settings.activeRole")}
                                        </p>
                                        <select
                                            value={activeRole || ""}
                                            onChange={(e) => changeActiveRole(e.target.value)}
                                            className="w-full bg-transparent text-sm font-semibold text-gray-800 border-b border-gray-200 py-2 outline-none cursor-pointer hover:border-[#7A1014] transition-colors appearance-none"
                                        >
                                            {availableRoles.map(role => (
                                                <option key={role} value={role}>{t("userEdit.roles." + role.toLowerCase())}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{userLogin || t('header.defaultUser')}</p>
                        <p className="text-xs text-gray-500 tracking-wider uppercase">{t("userEdit.roles." + activeRole?.toLowerCase())}</p>
                    </div>
                    <Link to={PATHS.PROFILE}>
                        <div className="relative">
                            <div
                                className="w-10 h-10 bg-red-500 rounded-md overflow-hidden flex items-center justify-center">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userLogin || 'default'}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span
                                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
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
            <div
                className={`absolute bottom-0 left-0 w-full h-[3px] transition-colors duration-300 ${getRoleIndicatorColor(activeRole)}`}
            />
        </header>
    );
}