import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectDetails } from '../../services/subjectService';
import type { SubjectDTO } from '../../types/SubjectDTO';
import { useTranslation } from 'react-i18next';

export const SubjectDetailsView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [subject, setSubject] = useState<SubjectDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getSubjectDetails(id)
                .then(data => {
                    setSubject(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError(t('subject.details.fetchError'));
                    setLoading(false);
                });
        }
    }, [id, t]);

    if (loading) return <div className="p-6 text-center text-secondary">{t('common.loading')}</div>;
    if (error) return <div className="p-6 text-center text-danger">{error}</div>;
    if (!subject) return <div className="p-6 text-center text-secondary">{t('subject.details.notFound')}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-primary">{subject.name}</h1>

            <div className="bg-surface border border-border shadow rounded-lg p-6 mb-6 transition-colors duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">
                            {t('subject.details.edition')}
                        </p>
                        <p className="text-primary text-base font-medium">{subject.edition}</p>
                    </div>
                    <div>
                        <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">
                            {t('subject.details.organization')}
                        </p>
                        <p className="text-primary text-base font-medium">{subject.organizationName}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">
                            {t('subject.details.description')}
                        </p>
                        <p className="text-primary text-base whitespace-pre-line">
                            {subject.subjectDescription || t('common.none')}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">
                            {t('subject.details.gitea')}
                        </p>
                        <a
                            href={subject.giteaURL}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand hover:text-brand-hover hover:underline text-base font-medium transition-colors duration-300"
                        >
                            {subject.giteaURL}
                        </a>
                    </div>
                </div>

                {subject.archived && (
                    <div className="mt-6 inline-block bg-danger-subtle border border-danger-border text-danger px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-300">
                        {t('subject.details.archived')}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                {subject.canEdit && (
                    <button
                        onClick={() => navigate(`/subjects/${id}/edit`)}
                        className="bg-brand text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-hover shadow transition-colors duration-300 cursor-pointer"
                    >
                        {t('subject.details.actions.edit')}
                    </button>
                )}
                {subject.canManageTeachers && (
                    <button
                        onClick={() => navigate(`/subjects/${id}/teachers`)}
                        className="bg-surface text-brand border border-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-active transition-colors duration-300 cursor-pointer"
                    >
                        {t('subject.details.actions.manageTeachers')}
                    </button>
                )}
            </div>

            {subject.canViewStats && (
                <div className="space-y-6">
                    {subject.manualRules && (
                        <div className="bg-surface border border-border shadow rounded-lg p-6 transition-colors duration-300">
                            <h2 className="text-xl font-bold mb-4 text-primary">
                                {t('subject.details.rules.title', 'Konfiguracja reguł antyplagiatowych')}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-border p-3 rounded-md bg-base">
                                    <p className="text-xs text-secondary font-semibold uppercase">{t('subject.details.rules.raportLevel', 'Poziom raportu')}</p>
                                    <p className="text-primary font-medium mt-0.5">{subject.manualRules.raportLevelName}</p>
                                </div>
                                <div className="border border-border p-3 rounded-md bg-base">
                                    <p className="text-xs text-secondary font-semibold uppercase">{t('subject.details.rules.ticketCount', 'Liczba zgłoszeń studenta')}</p>
                                    <p className="text-primary font-medium mt-0.5">{subject.manualRules.studentTicketCount}</p>
                                </div>
                                <div className="border border-border p-3 rounded-md bg-base">
                                    <p className="text-xs text-secondary font-semibold uppercase">{t('subject.details.rules.minTokens', 'Minimalne dopasowanie tokenów')}</p>
                                    <p className="text-primary font-medium mt-0.5">{subject.manualRules.minimumTokensMatch}</p>
                                </div>
                                <div className="border border-border p-3 rounded-md bg-base">
                                    <p className="text-xs text-secondary font-semibold uppercase">{t('subject.details.rules.normalization', 'Normalizacja kodu')}</p>
                                    <p className="text-primary font-medium mt-0.5">
                                        {subject.manualRules.enableNormalization ? t('common.yes', 'Tak') : t('common.no', 'Nie')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-base border border-border rounded-lg p-6 transition-colors duration-300">
                        <h2 className="text-xl font-bold mb-2 text-primary">{t('subject.details.statistics.title')}</h2>
                        <p className="text-secondary text-sm">{t('subject.details.statistics.placeholder')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};