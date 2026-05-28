import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects } from '../../services/subjectService';
import type { SubjectDTO } from '../../types/SubjectDTO';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

export const SubjectListView: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { activeRole } = useAuth();

    const [subjects, setSubjects] = useState<SubjectDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const canCreateSubject = activeRole === 'TEACHER' || activeRole === 'ADMIN';

    useEffect(() => {
        getAllSubjects()
            .then(data => {
                setSubjects(data);
                setLoading(false);
            })
            .catch(() => {
                setError(t('subject.list.fetchError'));
                setLoading(false);
            });
    }, [t]);

    if (loading) return <div className="p-6 text-center text-secondary">{t('common.loading')}</div>;
    if (error) return <div className="p-6 text-center text-danger">{error}</div>;

    if (subjects.length === 0) {
        return (
            <div className="p-6 max-w-4xl mx-auto mt-10">
                {canCreateSubject && (
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => navigate('/teacher/subjects/create')}
                            className="bg-brand text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-hover shadow transition-colors duration-300"
                        >
                            {t('common.create', 'Utwórz przedmiot')}
                        </button>
                    </div>
                )}
                <div className="text-center bg-surface border border-border rounded-lg p-6 transition-colors duration-300">
                    <p className="text-secondary text-lg font-medium">{t('subject.list.empty')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-primary">{t('subject.list.title')}</h1>
                {canCreateSubject && (
                    <button
                        onClick={() => navigate('/teacher/subjects/create')}
                        className="bg-brand text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-hover shadow transition-colors duration-300 w-full sm:w-auto"
                    >
                        {t('common.create', 'Utwórz przedmiot')}
                    </button>
                )}
            </div>

            <div className="overflow-x-auto bg-surface border border-border shadow rounded-lg transition-colors duration-300">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-base">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                            {t('subject.list.name')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                            {t('subject.list.edition')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                            {t('subject.list.organization')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                            {t('subject.list.status')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                            {t('subject.list.actions')}
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {subjects.map((sub) => (
                        <tr
                            key={sub.id}
                            onClick={() => sub.id && navigate(`/subjects/${sub.id}`)}
                            className="hover:bg-active cursor-pointer transition-colors duration-200"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                {sub.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                                {sub.edition}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                                {sub.organizationName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {sub.archived ? (
                                    <span className="bg-danger-subtle border border-danger-border text-danger px-2 py-0.5 rounded-full text-xs font-semibold">
                                            {t('subject.details.archived')}
                                        </span>
                                ) : (
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                                            {t('subject.list.active')}
                                        </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => sub.id && navigate(`/subjects/${sub.id}`)}
                                    className="text-brand hover:text-brand-hover font-semibold transition-colors duration-200 mr-4"
                                >
                                    {t('subject.list.btnDetails')}
                                </button>
                                {sub.canEdit && (
                                    <button
                                        onClick={() => sub.id && navigate(`/subjects/${sub.id}/edit`)}
                                        className="text-secondary hover:text-primary font-semibold transition-colors duration-200"
                                    >
                                        {t('subject.details.actions.edit')}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};