import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStudentSubjectDetails } from '../../services/subjectService';
import type { StudentSubjectDetailsDTO } from '../../types/subject.types';
import { Loader2, ArrowLeft, BookOpen, ShieldAlert, GitBranch } from "lucide-react";
import { PATHS } from "../../routes/paths";

export const StudentSubjectDetailsView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [subject, setSubject] = useState<StudentSubjectDetailsDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getStudentSubjectDetails(id)
            .then(data => {
                setSubject(data);
                setLoading(false);
            })
            .catch(() => {
                setError(t('subject.details.fetchError', 'Wystąpił błąd podczas pobierania przedmiotu.'));
                setLoading(false);
            });
    }, [id, t]);

    if (loading) return <div className="p-8 flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>;
    if (error || !subject) return <div className="p-8 text-center text-danger font-medium">{error || t('subject.details.notFound', 'Nie znaleziono przedmiotu.')}</div>;

    const visibilityKey = subject.reportVisibilityLevel || 'NOTHING';

    const getBadgeColorClass = (key: string) => {
        switch (key) {
            case 'ONLY_PERCENTAGES':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'ONLY_HIGHEST_PERCENT':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20';
            case 'NOTHING':
            default:
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen bg-base relative">
            <div className="mb-8 border-b border-border pb-6">
                <button
                    onClick={() => navigate(PATHS.STUDENT_SUBJECT_LIST)}
                    className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest hover:text-brand transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    {t('common.back', 'Wróć do listy')}
                </button>
                <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    {t('subject.list.role.student', 'Panel Studenta')} / {subject.name}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 flex items-center gap-3">
                    <BookOpen className="text-brand" /> {subject.name}
                </h1>

                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-surface border border-border text-primary px-4 py-2 rounded-lg text-sm shadow-sm flex items-center gap-2">
                        <span className="text-secondary font-medium">{t('subject.details.editionLabel', 'Edycja:')}</span>
                        <span className="font-bold">{subject.edition}</span>
                    </div>
                    <div className="bg-surface border border-border text-primary px-4 py-2 rounded-lg text-sm shadow-sm flex items-center gap-2">
                        <span className="text-secondary font-medium">{t('subject.details.organizationLabel', 'Organizacja:')}</span>
                        <a href={subject.giteaURL} target="_blank" rel="noreferrer" className="font-bold text-brand hover:text-brand-hover hover:underline transition-colors">
                            {subject.organizationName}
                        </a>
                    </div>
                </div>

                {subject.subjectDescription && (
                    <p className="mt-6 text-sm text-secondary bg-surface p-4 rounded-xl border border-border shadow-sm">
                        {subject.subjectDescription}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <GitBranch className="text-brand w-5 h-5"/> {t('subject.details.repoHeader', 'Twoje Repozytorium')}
                    </h3>
                    {subject.studentRepository ? (
                        <div className="border border-brand/50 bg-brand-subtle rounded-xl p-6 shadow-sm">
                            <h4 className="font-bold text-primary text-lg mb-2">{subject.studentRepository.repositoryName}</h4>
                            <p className="text-sm text-secondary mb-4">
                                {t('subject.details.availableTickets', 'Dostępne tokeny skanowań:')} <span className="font-bold text-primary">{subject.studentRepository.ticketCount}</span>
                            </p>
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => navigate(PATHS.STUDENT_SCAN)} className="px-5 py-2.5 bg-brand border border-brand rounded-lg text-sm font-bold text-white hover:bg-brand-hover shadow-sm transition-colors">
                                    {t('subject.details.runScanBtn', 'Wykonaj skan kodu')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-secondary border border-dashed border-border rounded-xl bg-surface">
                            {t('subject.details.noRepoAssigned', 'Nie jesteś przypisany do żadnego repozytorium w tym przedmiocie.')}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <ShieldAlert className="text-secondary w-5 h-5"/> {t('subject.details.reportsHeader', 'Widoczność Raportów')}
                    </h3>
                    <div className="bg-surface rounded-xl p-6 border border-border shadow-sm flex flex-col h-full">
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-medium text-secondary">
                                {t('subject.details.reportLevelLabel', 'Poziom dostępu do wyników:')}
                            </span>

                            <div>
                                <span className={`inline-flex items-center px-3 py-1.5 border rounded-lg text-sm font-bold ${getBadgeColorClass(visibilityKey)}`}>
                                    {t(`subject.details.visibility.${visibilityKey}.label`)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 bg-base p-4 rounded-lg border border-border">
                            <p className="text-sm text-secondary leading-relaxed">
                                {t(`subject.details.visibility.${visibilityKey}.description`)}
                            </p>
                        </div>

                        {visibilityKey !== 'NOTHING' && (
                            <div className="mt-auto pt-6">
                                <button onClick={() => navigate(PATHS.STUDENT_REPORTS)} className="w-full px-5 py-2.5 bg-surface border border-border rounded-lg text-sm font-bold text-secondary hover:text-primary hover:bg-active transition-colors shadow-sm">
                                    {t('subject.details.goToReportsBtn', 'Przejdź do moich raportów')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};