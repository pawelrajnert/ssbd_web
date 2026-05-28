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
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

    const canCreateSubject = activeRole === 'TEACHER' || activeRole === 'ADMIN';

    useEffect(() => {
        getAllSubjects()
            .then(data => {
                setSubjects(data);
                setLoading(false);
            })
            .catch(() => {
                setError(t('subject.list.fetchError', 'Wystąpił błąd podczas pobierania.'));
                setLoading(false);
            });
    }, [t]);

    const activeSubjects = subjects.filter(sub => !sub.archived);
    const archivedSubjects = subjects.filter(sub => sub.archived);
    const displayedSubjects = activeTab === 'active' ? activeSubjects : archivedSubjects;

    if (loading) return <div className="p-8 text-center text-secondary">{t('common.loading', 'Ładowanie...')}</div>;
    if (error) return <div className="p-8 text-center text-danger font-medium">{error}</div>;

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen bg-base">
            <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                {activeRole === 'STUDENT' ? 'Panel Studenta / Moje Przedmioty' : 'Panel Prowadzącego / Moje Przedmioty'}
            </div>

            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                    {t('subject.list.title', 'Zarządzane Przedmioty')}
                </h1>
                <p className="text-secondary text-sm max-w-2xl">
                    Przeglądaj swoje przedmioty i zarządzaj w nich regułami antyplagiatowymi oraz organizacjami w Gitea.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border mb-8 gap-4">
                <div className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`text-sm font-bold pb-4 -mb-[1px] transition-colors ${activeTab === 'active' ? 'text-brand border-b-2 border-brand' : 'text-secondary hover:text-primary'}`}
                    >
                        Aktywne Kursy ({activeSubjects.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('archived')}
                        className={`text-sm font-bold pb-4 -mb-[1px] transition-colors ${activeTab === 'archived' ? 'text-brand border-b-2 border-brand' : 'text-secondary hover:text-primary'}`}
                    >
                        Zarchiwizowane ({archivedSubjects.length})
                    </button>
                </div>

                {canCreateSubject && (
                    <button
                        onClick={() => navigate('/teacher/subjects/create')}
                        className="flex items-center gap-2 text-brand font-bold text-sm hover:text-brand-hover pb-4 transition-colors"
                    >
                        <span className="text-lg leading-none">+</span> Utwórz Przedmiot
                    </button>
                )}
            </div>

            {displayedSubjects.length === 0 ? (
                <div className="text-center bg-surface border border-border rounded-xl p-12 shadow-sm">
                    <p className="text-secondary text-lg">{t('subject.list.empty', 'Brak przedmiotów w tej kategorii.')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {displayedSubjects.map((sub) => (
                        <div
                            key={sub.id}
                            className="bg-surface border border-border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group"
                        >
                            {/* Część wizualna (Zdjęcie) */}
                            <div className="h-44 bg-gray-200 dark:bg-gray-800 relative flex items-center justify-center overflow-hidden shrink-0">
                                <span className="text-gray-400 dark:text-gray-500 font-medium tracking-wide">
                                    [ Przykładowe zdjęcie ]
                                </span>
                                {/* Edycja z odstępem w lewym górnym rogu */}
                                <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 shadow border border-gray-100 dark:border-gray-700 text-primary text-xs font-bold px-2.5 py-1 rounded">
                                    {sub.edition}
                                </div>
                            </div>

                            {/* Treść merytoryczna */}
                            <div className="p-6 flex-grow flex flex-col">
                                {/* Pogrubiona nazwa */}
                                <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors cursor-pointer" onClick={() => sub.id && navigate(`/subjects/${sub.id}`)}>
                                    {sub.name}
                                </h3>

                                {/* Opis mniejszymi literami */}
                                <p className="text-secondary text-sm mb-5 line-clamp-3">
                                    Organizacja źródłowa w Gitea: <span className="font-semibold text-primary">{sub.organizationName}</span>. Analiza zgodności kodu i monitorowanie rzetelności akademickiej.
                                </p>

                                <div className="mt-auto flex justify-between items-end mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-secondary font-semibold mb-1">
                                            Następny skan:
                                        </span>
                                        <span className="text-sm font-medium text-primary">
                                            {sub.archived ? 'Zarchiwizowany' : 'Oczekuje na uruchomienie'}
                                        </span>
                                    </div>
                                </div>

                                {/* Przyciski akcji (Czerwony przycisk + kwadrat statystyk) */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => sub.id && navigate(`/subjects/${sub.id}`)}
                                        className="flex-grow bg-red-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                    >
                                        Zarządzaj kursem
                                    </button>
                                    <button
                                        className="w-11 h-11 shrink-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-secondary hover:text-primary rounded-lg flex items-center justify-center transition-colors shadow-sm"
                                        title="Statystyki"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};