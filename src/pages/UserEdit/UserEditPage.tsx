import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Eye, Lock} from "lucide-react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import {userService} from "../../services/userService";
import type {AccountWithAccessLevelsDTO} from "../../types/user.types";
import {RoleEnum} from "../../types/role.types";
import {PATHS} from "../../routes/paths";
import SubmitButton from "../../shared/components/buttons/SubmitButton";
import {useBreadcrumb} from "../../contexts/BreadcrumbContext";

export default function UserEditPage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {setDynamicBreadcrumb} = useBreadcrumb();

    const [user, setUser] = useState<AccountWithAccessLevelsDTO | null>(null);
    const [localRoles, setLocalRoles] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchUser(id);
        }
    }, [id]);

    useEffect(() => {
        if (user) {
            setDynamicBreadcrumb(user.account.login);
        }
        return () => setDynamicBreadcrumb(null);
    }, [user, setDynamicBreadcrumb]);

    const fetchUser = async (userId: string) => {
        try {
            const data = await userService.getAccountById(userId);
            setUser(data);
            setLocalRoles(data.accessLevels.filter(al => al.active).map(al => al.accessLevelName));
        } catch (err) {
            console.error(err);
            navigate(PATHS.USER_LIST);
        }
    };

    const handleBlock = async () => {
        if (!user || isBlocking) return;

        setIsBlocking(true);
        setError(null);

        try {
            if (user.account.active) {
                await userService.blockUser(user.account.id);
            } else {
                await userService.unblockUser(user.account.id);
            }
            if (id) await fetchUser(id);
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.response?.data || t('userEdit.messages.updateError'));
            } else {
                setError(t('userEdit.messages.updateError'));
            }
        } finally {
            setIsBlocking(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setError(null);

        try {
            let currentHash = user.account.versionHash;
            const initialRoles = user.accessLevels.filter(al => al.active).map(al => al.accessLevelName);
            const rolesToGrant = localRoles.filter(r => !initialRoles.includes(r));
            const rolesToRevoke = initialRoles.filter(r => !localRoles.includes(r));

            let latestUser = user;

            for (const role of rolesToGrant) {
                latestUser = await userService.grantAccessLevel(user.account.id, role, currentHash);
                currentHash = latestUser.account.versionHash;
            }

            for (const role of rolesToRevoke) {
                latestUser = await userService.revokeAccessLevel(user.account.id, role, currentHash);
                currentHash = latestUser.account.versionHash;
            }

            setUser(latestUser);
            setLocalRoles(latestUser.accessLevels.filter(al => al.active).map(al => al.accessLevelName));
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || t('userEdit.messages.updateError'));
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('userEdit.messages.updateError'));
            }
            if (id) fetchUser(id);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        if (user) {
            setLocalRoles(user.accessLevels.filter(al => al.active).map(al => al.accessLevelName));
        }
    };

    const toggleRole = (role: string) => {
        setLocalRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const renderRoleBadge = (roleName: string) => {
        if (roleName === RoleEnum.ADMINISTRATOR) {
            return <span key={roleName}
                         className="px-3 py-1 bg-red-100 text-[#7A1014] text-[10px] font-bold rounded-full tracking-wider">{t('userEdit.roles.adminBadge')}</span>;
        }
        return <span key={roleName}
                     className="px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-full tracking-wider">{roleName === "TEACHER" ? t('userEdit.roles.teacher').toUpperCase() : roleName === "STUDENT" ? t('userEdit.roles.student').toUpperCase() : roleName}</span>;
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return t('userEdit.stats.never');
        return new Date(dateString).toLocaleString();
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-[#7A1014] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('userEdit.title')}</h1>

                {error && (
                    <div
                        className="mb-4 p-4 bg-red-50 text-[#7A1014] rounded-md border border-red-200 text-sm font-semibold">
                        {error}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3 space-y-6">
                        <div
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-extrabold text-gray-900 text-center">{user.account.name} {user.account.surname}</h2>
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                {localRoles.length > 0
                                    ? localRoles.map(renderRoleBadge)
                                    : <span className="text-xs text-gray-400">{t('userEdit.noRoles')}</span>
                                }
                            </div>
                        </div>

                        <div className="bg-gray-100/50 rounded-r-2xl border-l-4 border-red-200 p-6">
                            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">{t('userEdit.stats.title')}</h3>
                            <div className="flex justify-between items-center">
                                <span
                                    className="text-sm font-semibold text-gray-600">{t('userEdit.stats.lastLogin')}</span>
                                <span
                                    className="text-sm font-bold text-gray-900">{formatDate(user.account.lastLoginSuccessDateTime)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-[#7A1014] tracking-widest uppercase mb-4">{t('userEdit.credentials.title')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('userEdit.credentials.login')}</label>
                                    <div className="relative bg-gray-50 border border-gray-200 rounded-md">
                                        <input
                                            type="text"
                                            value={user.account.login}
                                            readOnly
                                            className="w-full bg-transparent p-3 text-sm font-medium text-gray-600 outline-none pr-10 cursor-not-allowed"
                                        />
                                        <Lock size={16}
                                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2">{t('userEdit.credentials.loginHint')}</p>
                                </div>
                                <div>
                                    <label
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('userEdit.credentials.password')}</label>
                                    <div className="relative bg-gray-50 border border-gray-200 rounded-md">
                                        <input
                                            type="password"
                                            value="••••••••"
                                            readOnly
                                            className="w-full bg-transparent p-3 text-sm font-medium text-gray-600 outline-none pr-10 cursor-not-allowed"
                                        />
                                        <Eye size={16}
                                             className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A1014]"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-8"/>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label
                                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('userEdit.personal.firstName')}</label>
                                <input
                                    type="text"
                                    value={user.account.name}
                                    readOnly
                                    className="w-full border border-gray-200 rounded-md p-3 text-sm font-medium text-gray-900 outline-none cursor-not-allowed focus:border-gray-300"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('userEdit.personal.surname')}</label>
                                <input
                                    type="text"
                                    value={user.account.surname}
                                    readOnly
                                    className="w-full border border-gray-200 rounded-md p-3 text-sm font-medium text-gray-900 outline-none cursor-not-allowed focus:border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label
                                className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('userEdit.personal.email')}</label>
                            <input
                                type="email"
                                value={user.account.email}
                                readOnly
                                className="w-full border border-gray-200 rounded-md p-3 text-sm font-medium text-gray-900 outline-none cursor-not-allowed focus:border-gray-300"
                            />
                        </div>

                        <hr className="border-gray-100 mb-8"/>

                        <div
                            className={`bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between mb-8 transition-opacity ${isBlocking ? 'opacity-50' : 'opacity-100'}`}>
                            <div>
                                <h3 className="text-xs font-bold text-[#7A1014] tracking-widest uppercase mb-1">{t('userEdit.blockStatus.title')}</h3>
                                <p className="text-xs text-gray-500">{t('userEdit.blockStatus.hint')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    onClick={handleBlock}
                                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isBlocking ? 'cursor-wait' : 'cursor-pointer'} ${user.account.active ? "bg-gray-300" : "bg-[#7A1014]"}`}
                                >
                                    <div
                                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${user.account.active ? "" : "translate-x-4"}`}></div>
                                </div>
                                <span className="text-sm font-bold text-gray-800">
                                    {user.account.active ? t('userEdit.blockStatus.active') : t('userEdit.blockStatus.blocked')}
                                </span>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-xs font-bold text-[#7A1014] tracking-widest uppercase mb-4">{t('userEdit.roles.title')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    {id: RoleEnum.STUDENT, label: t('userEdit.roles.student')},
                                    {id: RoleEnum.TEACHER, label: t('userEdit.roles.teacher')},
                                    {id: RoleEnum.ADMINISTRATOR, label: t('userEdit.roles.admin')}
                                ].map((role) => {
                                    const isChecked = localRoles.includes(role.id);
                                    return (
                                        <div
                                            key={role.id}
                                            onClick={() => toggleRole(role.id)}
                                            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${isChecked ? 'bg-red-50 border-[#7A1014]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#7A1014] border-[#7A1014]' : 'bg-white border-gray-300'}`}>
                                                {isChecked && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24"
                                                         stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={3} d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <span
                                                className={`text-sm font-bold ${isChecked ? 'text-[#7A1014]' : 'text-gray-700'}`}>
                                                {role.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6">
                            <button
                                onClick={handleDiscard}
                                disabled={isSaving}
                                className="px-6 py-3 text-xs font-bold text-gray-500 tracking-widest uppercase hover:text-gray-800 transition-colors disabled:opacity-50"
                            >
                                {t('userEdit.actions.discard')}
                            </button>
                            <SubmitButton
                                onClick={handleSave}
                                isLoading={isSaving}
                                className="w-auto mt-0 px-8 py-3 text-xs tracking-widest uppercase"
                            >
                                {t('userEdit.actions.save')}
                            </SubmitButton>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}