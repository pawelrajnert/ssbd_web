import { useEffect, useState } from "react";
import { RefreshCw, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import type { Page, AccountWithAccessLevelsDTO } from "../../types/user.types";
import { PATHS } from "../../routes/paths";

export default function UserListPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [data, setData] = useState<Page<AccountWithAccessLevelsDTO> | null>(null);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [phrase, setPhrase] = useState("");
    const [debouncedPhrase, setDebouncedPhrase] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPhrase(phrase);
            setPage(0);
        }, 500);

        return () => clearTimeout(timer);
    }, [phrase]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const result = await userService.getUsers(page, size, debouncedPhrase);
            setData(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size, debouncedPhrase]);

    const handleRefresh = () => {
        fetchUsers();
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toISOString().replace('T', ' ').substring(0, 16);
    };

    const renderRoleBadge = (roleName: string) => {
        if (roleName === "ADMINISTRATOR") {
            return (
                <span key={roleName} className="inline-block px-3 py-1 bg-red-100 text-[#7A1014] text-[10px] font-bold rounded-full tracking-wider mb-1">
                    {t('userEdit.roles.adminBadge')}
                </span>
            );
        }
        return (
            <span key={roleName} className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-full tracking-wider mb-1">
                {roleName === "TEACHER" ? t('userEdit.roles.teacher').toUpperCase() : roleName === "STUDENT" ? t('userEdit.roles.student').toUpperCase() : roleName}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('userList.title')}</h1>
                        <p className="text-gray-500 text-sm max-w-2xl">
                            {t('userList.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-bold text-gray-700 transition-colors"
                        >
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
                                className="pl-10 pr-4 py-2 bg-gray-200 border-none rounded-md text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#7A1014] outline-none w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-6 px-8 text-xs font-bold text-gray-700 uppercase tracking-widest">{t('userList.table.role')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest">{t('userList.table.firstName')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest">{t('userList.table.surname')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest">{t('userList.table.login')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest">{t('userList.table.email')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-gray-700 uppercase tracking-widest">{t('userList.table.lastLogin')}</th>
                                <th className="py-6 px-8 text-xs font-bold text-gray-700 uppercase tracking-widest">{t('userList.table.actions')}</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {data?.content.map((row) => (
                                <tr key={row.account.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-8 align-middle">
                                        <div className="flex flex-col items-start">
                                            {row.accessLevels
                                                .filter(al => al.active)
                                                .map(al => renderRoleBadge(al.accessLevelName))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-800 font-medium">{row.account.name}</td>
                                    <td className="py-4 px-6 text-sm text-gray-800 font-medium">{row.account.surname}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{row.account.login}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{row.account.email}</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{formatDate(row.account.lastLoginSuccessDateTime)}</td>
                                    <td
                                        className="py-4 px-8 text-sm font-bold text-[#7A1014] hover:text-red-900 cursor-pointer transition-colors"
                                        onClick={() => navigate(PATHS.USER_EDIT.replace(':id', row.account.id))}
                                    >
                                        {t('userList.table.edit')}
                                    </td>
                                </tr>
                            ))}
                            {data?.content.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-500 text-sm">
                                        {t('userList.table.noUsers')}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {data && (
                        <div className="bg-gray-50/50 border-t border-gray-100 p-6 flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">
                                {t('userList.pagination.showing')} {data.totalElements === 0 ? 0 : page * size + 1} {t('userList.pagination.to')} {Math.min((page + 1) * size, data.totalElements)} {t('userList.pagination.of')} {data.totalElements.toLocaleString()} {t('userList.pagination.users')}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-2 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                                    let pageNum = i;
                                    if (data.totalPages > 5 && page > 2) {
                                        pageNum = page - 2 + i;
                                        if (pageNum >= data.totalPages) pageNum = data.totalPages - (5 - i);
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                                                page === pageNum
                                                    ? "bg-[#7A1014] text-white border border-[#7A1014]"
                                                    : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    );
                                })}

                                {data.totalPages > 5 && page < data.totalPages - 3 && (
                                    <>
                                        <span className="px-1 text-gray-400">...</span>
                                        <button
                                            onClick={() => setPage(data.totalPages - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors"
                                        >
                                            {data.totalPages}
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                                    disabled={page >= data.totalPages - 1}
                                    className="p-2 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}