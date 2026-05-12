import { useEffect, useState, type KeyboardEvent } from "react";
import { RefreshCw, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { PATHS } from "../../routes/paths";
import type { Page, AccountWithAccessLevelsDTO, AccountDTO } from "../../types/user.types";
import ChangePasswordModal from "./ChangeOtherPasswordModal";

export default function UserListPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [data, setData] = useState<Page<AccountWithAccessLevelsDTO> | null>(null);
    const [page, setPage] = useState(0);

    const [size, setSize] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortDesc, setSortDesc] = useState<boolean | undefined>(undefined);

    const [phrase, setPhrase] = useState("");
    const [searchPhrase, setSearchPhrase] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AccountDTO | null>(null);

    const [isProfileLoaded, setIsProfileLoaded] = useState(false);

    const getLoginFromToken = () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload).sub;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const currentLogin = getLoginFromToken();
                if (currentLogin) {
                    const profile = await userService.getAccountByLogin(currentLogin);
                    if (profile?.account) {
                        if (profile.account.listSortBy) {
                            setSortBy(profile.account.listSortBy);
                        }
                        if (profile.account.listSortDesc !== undefined && profile.account.listSortDesc !== null) {
                            setSortDesc(profile.account.listSortDesc);
                        }
                        if (profile.account.listPageSize) {
                            setSize(profile.account.listPageSize);
                        }
                    }
                }
            } catch { /* empty */ } finally {
                setIsProfileLoaded(true);
            }
        };
        loadProfile();
    }, []);

    useEffect(() => {
        if (!isProfileLoaded) return;

        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const result = await userService.getUsers(page, size, searchPhrase, sortBy, sortDesc);
                setData(result);
            } catch { /* empty */ } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [page, size, searchPhrase, sortBy, sortDesc, isProfileLoaded]);

    const handleRefresh = () => {
        setSearchPhrase(phrase);
        if (page !== 0) {
            setPage(0);
        } else if (isProfileLoaded) {
            setIsLoading(true);
            userService.getUsers(page, size, phrase, sortBy, sortDesc)
                .then(setData)
                .catch(() => {})
                .finally(() => setIsLoading(false));
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleRefresh();
    };

    const handleNextPage = () => {
        if (data && !data.last) setPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (page > 0) setPage(prev => prev - 1);
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortDesc(prev => !prev);
        } else {
            setSortBy(column);
            setSortDesc(false);
        }
        setPage(0);
    };

    const handleSizeChange = (newSize: number) => {
        setSize(newSize);
        setPage(0);
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toISOString().replace('T', ' ').substring(0, 16);
    };

    const renderRoleBadge = (roleName: string) => {
        const isAdmin = roleName === "ROLE_ADMIN" || roleName === "ADMINISTRATOR";
        const colors = isAdmin ? "bg-red-100 text-[#7A1014]" : "bg-teal-100 text-teal-800";
        const getLabel = () => {
            if (isAdmin) return t('userEdit.roles.adminBadge');
            if (roleName === "ROLE_TEACHER" || roleName === "TEACHER") return t('userEdit.roles.teacher').toUpperCase();
            if (roleName === "ROLE_STUDENT" || roleName === "STUDENT") return t('userEdit.roles.student').toUpperCase();
            return roleName;
        };
        return (
            <span key={roleName} className={`inline-block px-3 py-1 ${colors} text-[10px] font-bold rounded-full tracking-wider mb-1`}>
                {getLabel()}
            </span>
        );
    };

    const availableSizes = [5, 10, 20, 50];
    const currentSize = size !== undefined ? size : (data?.size || 10);

    if (!availableSizes.includes(currentSize)) {
        availableSizes.push(currentSize);
        availableSizes.sort((a, b) => a - b);
    }

    if (!isProfileLoaded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <RefreshCw className="animate-spin text-[#7A1014]" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('userList.title')}</h1>
                        <p className="text-gray-500 text-sm max-w-2xl">{t('userList.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-md text-sm font-bold text-gray-700 transition-colors">
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            {t('userList.refresh')}
                        </button>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                                <Filter size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder={t('userList.filterPlaceholder')}
                                value={phrase}
                                onChange={(e) => setPhrase(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="pl-10 pr-4 py-2 bg-gray-200 border-none rounded-md text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#7A1014] outline-none w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                                <RefreshCw className="animate-spin text-[#7A1014]" size={32} />
                            </div>
                        )}
                        <table className="w-full text-left border-collapse relative">
                            <thead>
                            <tr className="border-b border-gray-100 cursor-pointer select-none">
                                <th className="py-6 px-8 text-xs font-bold text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors" onClick={() => handleSort('accessLevel')}>
                                    {t('userList.table.role')}
                                </th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors" onClick={() => handleSort('name')}>
                                    {t('userList.table.firstName')}
                                </th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors" onClick={() => handleSort('surname')}>
                                    {t('userList.table.surname')}
                                </th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors" onClick={() => handleSort('login')}>
                                    {t('userList.table.login')}
                                </th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors" onClick={() => handleSort('email')}>
                                    {t('userList.table.email')}
                                </th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors" onClick={() => handleSort('lastLoginSuccessDateTime')}>
                                    {t('userList.table.lastLogin')}
                                </th>
                                <th className="py-6 px-8 text-xs font-bold text-gray-700 uppercase tracking-widest">{t('userList.table.actions')}</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {data?.content?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                                        {t('userList.noResults', 'Brak wyników')}
                                    </td>
                                </tr>
                            ) : (
                                data?.content?.map((row) => (
                                    <tr key={row.account.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-8 align-middle">
                                            <div className="flex flex-col items-start">
                                                {row.accessLevels.filter(al => al.active).sort((a, b) => a.accessLevelName.localeCompare(b.accessLevelName)).map(al => renderRoleBadge(al.accessLevelName))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">{row.account.name}</td>
                                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">{row.account.surname}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{row.account.login}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{row.account.email}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{formatDate(row.account.lastLoginSuccessDateTime)}</td>
                                        <td className="py-4 px-8 gap-4">
                                            <button
                                                className="text-sm font-bold text-[#7A1014] hover:text-red-900 cursor-pointer transition-colors"
                                                onClick={() => navigate(PATHS.USER_EDIT.replace(':id', row.account.id))}
                                            >
                                                {t('userList.table.edit')}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between px-8 py-4 border-t border-gray-100 bg-gray-50/50 gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 font-medium">
                                {t('userList.pagination.page')} {data ? (data.number + 1) : 0} {t('userList.pagination.of')} {data ? data.totalPages : 0}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                <label htmlFor="pageSize">{t('userList.pagination.showing')}</label>
                                <select
                                    id="pageSize"
                                    value={currentSize}
                                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7A1014]"
                                >
                                    {availableSizes.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 0 || isLoading}
                                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                                {t('userList.pagination.prev', 'Poprzednia')}
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={!data || data.last || isLoading}
                                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('userList.pagination.next', 'Następna')}
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {selectedUser && (
                <ChangePasswordModal
                    isOpen={true}
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSuccess={() => {
                        setSelectedUser(null);
                        handleRefresh();
                    }}
                />
            )}
        </div>
    );
}