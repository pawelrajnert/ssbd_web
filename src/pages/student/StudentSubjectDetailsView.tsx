import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStudentSubjectDetails } from '../../services/subjectService';
import type { StudentSubjectDetailsDTO } from '../../types/subject.types';
import { Loader2, ArrowLeft, BookOpen, ShieldAlert, GitBranch } from "lucide-react";
import { PATHS } from "../../routes/paths";
import { ReportVisibilityLevel } from '../../types/subject.types';

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
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 flex items-center gap-3">
                    <BookOpen className="text-brand" /> {subject.name}
                </h1>
                <p className="text-secondary max-w-4xl text-sm md:text-base leading-relaxed">
                    Edycja: <span className="font-medium text-primary">{subject.edition}</span> |
                    Organizacja: <a href={subject.giteaURL} target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">{subject.organizationName}</a>
                </p>
                {subject.subjectDescription && (
                    <p className="mt-4 text-sm text-secondary bg-surface p-4 rounded-xl border border-border shadow-sm">
                        {subject.subjectDescription}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <GitBranch className="text-brand w-5 h-5"/> Twoje Repozytorium
                    </h3>
                    {subject.studentRepository ? (
                        <div className="border border-brand/50 bg-brand-subtle rounded-xl p-6 shadow-sm">
                            <h4 className="font-bold text-primary text-lg mb-2">{subject.studentRepository.repositoryName}</h4>
                            <p className="text-sm text-secondary mb-4">
                                Dostępne tokeny skanowań: <span className="font-bold text-primary">{subject.studentRepository.ticketCount}</span>
                            </p>
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => navigate(PATHS.STUDENT_SCAN)} className="px-5 py-2.5 bg-brand border border-brand rounded-lg text-sm font-bold text-white hover:bg-brand-hover shadow-sm transition-colors">
                                    Wykonaj skan kodu
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-secondary border border-dashed border-border rounded-xl">
                            Nie jesteś przypisany do żadnego repozytorium w tym przedmiocie.
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <ShieldAlert className="text-secondary w-5 h-5"/> Widoczność Raportów
                    </h3>
                    <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
                        <p className="text-sm font-medium text-primary mb-2">
                            {t('subject.details.reportLevelLabel', 'Prowadzący ustawił poziom raportowania na:')}
                            <span className="ml-2 px-2.5 py-1 bg-active text-brand rounded-md font-mono text-xs">
                                {subject.reportVisibilityLevel}
                            </span>
                        </p>
                        <p className="text-sm text-secondary leading-relaxed mt-4">
                            {subject.reportVisibilityLevel === ReportVisibilityLevel.FULL_INSIGHT && t('subject.details.reportLevel.fullInsight', 'Będziesz miał pełny wgląd w analizę podobieństwa oraz dostęp do kodu podświetlającego problematyczne sekcje.')}
                            {subject.reportVisibilityLevel === ReportVisibilityLevel.SCORE_ONLY && t('subject.details.reportLevel.scoreOnly', 'Będziesz widział wyłącznie wynik procentowy podobieństwa bez dostępu do dokładnego porównania kodu.')}
                            {subject.reportVisibilityLevel === ReportVisibilityLevel.ONLY_HIGHEST_PERCENT && t('subject.details.reportLevel.onlyHighest', 'Będziesz widział wyłącznie najwyższy wynik procentowy podobieństwa bez dostępu do dokładnego porównania kodu.')}
                            {subject.reportVisibilityLevel === ReportVisibilityLevel.HIDDEN && t('subject.details.reportLevel.hidden', 'Wszystkie raporty są ukryte. Wyłącznie prowadzący posiada do nich wgląd.')}
                        </p>
                        {subject.reportVisibilityLevel !== ReportVisibilityLevel.HIDDEN && (
                            <button onClick={() => navigate(PATHS.STUDENT_REPORTS)} className="mt-6 px-5 py-2.5 bg-surface border border-border rounded-lg text-sm font-bold text-secondary hover:text-primary hover:bg-active transition-colors w-full">
                                {t('subject.details.goToReportsBtn', 'Przejdź do moich raportów')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};