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
    const [size] = useState(10);

    const [phrase, setPhrase] = useState("");
    const [searchPhrase, setSearchPhrase] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AccountDTO | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const result = await userService.getUsers(page, size, searchPhrase);
            setData(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size, searchPhrase]);

    const handleRefresh = () => {
        setSearchPhrase(phrase);
        if (page !== 0) {
            setPage(0);
        } else {
            fetchUsers();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRefresh();
        }
    };

    const handleNextPage = () => {
        if (data && !data.last) {
            setPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toISOString().replace('T', ' ').substring(0, 16);
    };
    const renderRoleBadge = (roleName: string) => {
        const isAdmin = roleName === "ROLE_ADMIN" || roleName === "ADMINISTRATOR";
        const colors = isAdmin
            ? "bg-red-100 text-[#7A1014]"
            : "bg-teal-100 text-teal-800";

        const getLabel = () => {
            if (roleName === "ROLE_ADMIN" || roleName === "ADMINISTRATOR") return t('userEdit.roles.adminBadge');
            if (roleName === "ROLE_TEACHER" || roleName === "TEACHER") return t('userEdit.roles.teacher').toUpperCase();
            if (roleName === "ROLE_STUDENT" || roleName === "STUDENT") return t('userEdit.roles.student').toUpperCase();
            return roleName;
        };

        return (
            <span
                key={roleName}
                className={`inline-block px-3 py-1 ${colors} text-[10px] font-bold rounded-full tracking-wider mb-1`}
            >
            {getLabel()}
        </span>
        );
    };

    return (
        <div className="min-h-screen bg-base p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">{t('userList.title')}</h1>
                        <p className="text-secondary text-sm max-w-2xl">{t('userList.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-active disabled:opacity-50 rounded-md text-sm font-bold text-primary transition-colors"
                        >
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            {t('userList.refresh')}
                        </button>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-secondary">
                                <Filter size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder={t('userList.filterPlaceholder')}
                                value={phrase}
                                onChange={(e) => setPhrase(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="pl-10 pr-4 py-2 bg-surface border border-border rounded-md text-sm font-semibold text-primary focus:ring-2 focus:ring-brand outline-none w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
                    <div className="overflow-x-auto relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                                <RefreshCw className="animate-spin text-brand" size={32} />
                            </div>
                        )}
                        <table className="w-full text-left border-collapse relative">
                            <thead>
                            <tr className="border-b border-border">
                                <th className="py-6 px-8 text-xs font-bold text-secondary uppercase tracking-widest">{t('userList.table.role')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-secondary uppercase tracking-widest">{t('userList.table.firstName')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-secondary uppercase tracking-widest">{t('userList.table.surname')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-secondary uppercase tracking-widest">{t('userList.table.login')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-secondary uppercase tracking-widest">{t('userList.table.email')}</th>
                                <th className="py-6 px-6 text-xs font-bold text-secondary uppercase tracking-widest">{t('userList.table.lastLogin')}</th>
                                <th className="py-6 px-8 text-xs font-bold text-secondary uppercase tracking-widest">{t('userList.table.actions')}</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                            {data?.content?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-secondary font-medium">
                                        {t('userList.noResults', 'Brak wynikÃ³w')}
                                    </td>
                                </tr>
                            ) : (
                                data?.content?.map((row) => (
                                    <tr key={row.account.id} className="hover:bg-base transition-colors">
                                        <td className="py-4 px-8 align-middle">
                                            <div className="flex flex-col items-start">
                                                {row.accessLevels.filter(al => al.active).map(al => renderRoleBadge(al.accessLevelName))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-primary font-medium">{row.account.name}</td>
                                        <td className="py-4 px-6 text-sm text-primary font-medium">{row.account.surname}</td>
                                        <td className="py-4 px-6 text-sm text-secondary">{row.account.login}</td>
                                        <td className="py-4 px-6 text-sm text-secondary">{row.account.email}</td>
                                        <td className="py-4 px-6 text-sm text-secondary">{formatDate(row.account.lastLoginSuccessDateTime)}</td>
                                        <td className="py-4 px-8 gap-4">
                                            <button
                                                className="text-sm font-bold text-brand hover:text-brand-hover cursor-pointer transition-colors"
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

                    <div className="flex items-center justify-between px-8 py-4 border-t border-border bg-base/50">
                    <span className="text-sm text-secondary font-medium">
                        {t('userList.pagination.page', 'Strona')} {data ? (data.number + 1) : 0} z {data ? data.totalPages : 0}
                    </span>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 0 || isLoading}
                                className="flex items-center gap-1 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-bold text-primary hover:bg-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                                {t('userList.pagination.prev', 'Poprzednia')}
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={!data || data.last || isLoading}
                                className="flex items-center gap-1 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-bold text-primary hover:bg-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('userList.pagination.next', 'NastÄ™pna')}
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
                        fetchUsers();
                    }}
                />
            )}
        </div>
    );
}