import { useEffect, useState } from "react";
import { RefreshCw, Filter } from "lucide-react";
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
    const [size] = useState(5);
    const [phrase, setPhrase] = useState("");
    const [debouncedPhrase, setDebouncedPhrase] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [selectedUser, setSelectedUser] = useState<AccountDTO | null>(null);

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
        // Define styles and labels outside the JSX for clarity
        const isAdmin = roleName === "ADMINISTRATOR";
        const colors = isAdmin
            ? "bg-red-100 text-[#7A1014]"
            : "bg-teal-100 text-teal-800";

        const getLabel = () => {
            if (roleName === "ADMINISTRATOR") return t('userEdit.roles.adminBadge');
            if (roleName === "TEACHER") return t('userEdit.roles.teacher').toUpperCase();
            if (roleName === "STUDENT") return t('userEdit.roles.student').toUpperCase();
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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('userList.title')}</h1>
                        <p className="text-gray-500 text-sm max-w-2xl">{t('userList.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-bold text-gray-700 transition-colors">
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
                            {data?.content?.map((row) => (
                                <tr key={row.account.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-8 align-middle">
                                        <div className="flex flex-col items-start">
                                            {row.accessLevels.filter(al => al.active).map(al => renderRoleBadge(al.accessLevelName))}
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
                                    <td className="py-4 px-8">
                                        <button
                                            onClick={() => setSelectedUser(row.account)}
                                            className="text-sm font-bold text-[#7A1014] hover:text-red-900 transition-colors"
                                        >
                                            {t('userList.changePassword')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedUser && (
                <ChangePasswordModal
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