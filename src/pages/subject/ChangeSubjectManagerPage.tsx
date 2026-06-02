import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, GraduationCap, AlertCircle, CheckCircle2, User, UserCheck } from 'lucide-react';
import axios from 'axios';
import SubmitButton from '../../shared/components/buttons/SubmitButton';
import { subjectService } from '../../services/subjectService';
import { userService } from '../../services/userService';
import type { SubjectDTO } from '../../types/SubjectDTO';
import type { AccountWithAccessLevelsDTO } from '../../types/user.types';

interface VerifiedTeacher {
    login: string;
    name: string;
    surname: string;
}

export const ChangeSubjectManagerPage: React.FC = () => {
    const { t } = useTranslation();

    const [subjects, setSubjects] = useState<SubjectDTO[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [isSubjectsLoading, setIsSubjectsLoading] = useState<boolean>(false);

    const [loginInput, setLoginInput] = useState<string>('');
    const [verifiedTeacher, setVerifiedTeacher] = useState<VerifiedTeacher | null>(null);

    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [checkError, setCheckError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            setIsSubjectsLoading(true);
            try {
                const data = await subjectService.getSubjects();
                setSubjects(data);
            } catch (err) {
                setSubmitError(t('subject.manager.error.fetchSubjects'));
            } finally {
                setIsSubjectsLoading(false);
            }
        };
        fetchSubjects();
    }, [t]);

    useEffect(() => {
        if (loginInput.trim().length < 3) {
            setVerifiedTeacher(null);
            setCheckError(null);
            setIsChecking(false);
            return;
        }

        const verifyTeacher = async () => {
            setIsChecking(true);
            setCheckError(null);
            setVerifiedTeacher(null);

            try {
                const data: AccountWithAccessLevelsDTO = await userService.getAccountByLogin(loginInput.trim());
                const accessLevels = data.accessLevels || [];

                const isTeacher = accessLevels.some(
                    (al) => al.active && (al.accessLevelName === 'TEACHER' || al.accessLevelName === 'ROLE_TEACHER')
                );

                if (!isTeacher) {
                    setCheckError(t('subject.manager.error.notATeacher'));
                    return;
                }

                setVerifiedTeacher({
                    login: data.account.login,
                    name: data.account.name,
                    surname: data.account.surname
                });
            } catch (err) {
                setCheckError(t('subject.manager.error.notATeacher'));
            } finally {
                setIsChecking(false);
            }
        };

        const timeoutId = setTimeout(verifyTeacher, 500);
        return () => clearTimeout(timeoutId);
    }, [loginInput, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSubjectId) {
            setSubmitError(t('subject.manager.error.noSubjectSelected'));
            return;
        }

        if (!verifiedTeacher) {
            setSubmitError(t('subject.manager.error.notVerified'));
            return;
        }

        setIsLoading(true);
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            await subjectService.changeSubjectManager(selectedSubjectId, verifiedTeacher.login);

            setSuccessMessage(t('subject.manager.success'));
            setLoginInput('');
            setVerifiedTeacher(null);
            setSelectedSubjectId('');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    setSubmitError(t('subject.manager.error.notFound'));
                } else if (err.response?.status === 409) {
                    setSubmitError(t('subject.manager.error.conflict'));
                } else if (err.response?.status === 403) {
                    setSubmitError(t('subject.manager.error.forbidden'));
                } else {
                    setSubmitError(t('subject.manager.error.unexpected'));
                }
            } else {
                setSubmitError(t('subject.manager.error.unexpected'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
                            <GraduationCap className="text-brand" size={32} />
                            {t('subject.manager.change.title')}
                        </h1>
                        <p className="text-secondary text-sm max-w-2xl">
                            {t('subject.manager.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="bg-surface w-full max-w-3xl rounded-2xl shadow-sm border border-border p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {submitError && (
                            <div className="mb-6 p-4 bg-danger-subtle border border-danger text-danger rounded-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-300">
                                <AlertCircle size={20} className="shrink-0" />
                                {submitError}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-300">
                                <CheckCircle2 size={20} className="shrink-0" />
                                {successMessage}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                                {t('subject.manager.selectSubject')}
                            </label>
                            <select
                                value={selectedSubjectId}
                                onChange={(e) => {
                                    setSelectedSubjectId(e.target.value);
                                    setSubmitError(null);
                                    setSuccessMessage(null);
                                }}
                                className="w-full px-4 py-3 bg-surface border border-border rounded-md text-primary focus:ring-2 focus:ring-brand outline-none transition-all text-sm font-medium cursor-pointer"
                                required
                                disabled={isSubjectsLoading}
                            >
                                <option value="" disabled>
                                    {isSubjectsLoading ? t('common.loading') : t('subject.manager.selectPlaceholder')}
                                </option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id || ''}>
                                        {subject.name} ({subject.edition})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                                {t('subject.manager.loginInput')}
                            </label>
                            <div className="relative border border-border rounded-md focus-within:ring-2 focus-within:ring-brand transition-all bg-surface">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                                    {isChecking ? (
                                        <Loader2 size={16} className="animate-spin text-brand" />
                                    ) : (
                                        <User size={16} />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={loginInput}
                                    onChange={(e) => {
                                        setLoginInput(e.target.value);
                                        setSubmitError(null);
                                        setSuccessMessage(null);
                                    }}
                                    className="w-full pl-10 pr-4 py-3 bg-transparent outline-none text-primary text-sm font-medium placeholder:text-secondary placeholder:font-normal"
                                    placeholder={t('subject.manager.loginPlaceholder')}
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            <div className="mt-3 min-h-10">
                                {checkError && !isChecking && (
                                    <div className="text-sm font-medium text-danger flex items-center gap-2 px-2 animate-in fade-in duration-200">
                                        <AlertCircle size={16} />
                                        {checkError}
                                    </div>
                                )}
                                {verifiedTeacher && !isChecking && (
                                    <div className="p-3 bg-brand/5 border border-brand/20 rounded-lg flex items-center gap-3 animate-in fade-in duration-200">
                                        <div className="bg-brand text-white p-2 rounded-full shrink-0">
                                            <UserCheck size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-primary">
                                                {verifiedTeacher.name} {verifiedTeacher.surname}
                                            </p>
                                            <p className="text-xs text-secondary mt-0.5">
                                                {t('subject.manager.teacherFound')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border mt-2">
                            <p className="mb-6 text-xs text-secondary leading-relaxed bg-base p-3 rounded border border-border">
                                {t('subject.manager.warning')}
                            </p>

                            <div className="flex justify-end">
                                <SubmitButton
                                    isLoading={isLoading}
                                    disabled={!verifiedTeacher || isChecking}
                                    className="px-8 py-2.5 w-auto mt-0 text-sm tracking-widest uppercase"
                                >
                                    {t('subject.manager.change.submit')}
                                </SubmitButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};