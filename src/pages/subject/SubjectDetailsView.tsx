import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectDetails } from '../../services/subjectService';
import type { SubjectDTO } from '../../types/SubjectDTO';
import { useTranslation } from 'react-i18next';

const MOCK_REPORTS = [
    { id: 1, date: 'Paź 12, 2026', count: 32, status: 'CLEAN' },
    { id: 2, date: 'Wrz 28, 2026', count: 28, status: 'ALERT' },
    { id: 3, date: 'Wrz 14, 2026', count: 30, status: 'CLEAN' },
    { id: 4, date: 'Cze 02, 2026', count: 31, status: 'CLEAN' },
    { id: 5, date: 'Maj 15, 2026', count: 30, status: 'PENDING' },
];

const MOCK_REPOS = [
    { id: 1, name: 'Projekt_Zaliczeniowy_01', date: 'Paź 24, 2026', msg: 'Kod czysty', status: 'clean', users: 'A. Kowalski, M. Nowak' },
    { id: 2, name: 'Projekt_Zaliczeniowy_02', date: 'Paź 23, 2026', msg: 'Wykryto podobieństwo: 82%', status: 'alert', users: 'T. Wiśniewski, K. Zielińska' },
    { id: 3, name: 'Projekt_Zaliczeniowy_03', date: 'Paź 21, 2026', msg: 'Oczekuje na weryfikację', status: 'pending', users: 'P. Mazur' },
];

export const SubjectDetailsView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [subject, setSubject] = useState<SubjectDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isReportsModalOpen, setIsReportsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;
        getSubjectDetails(id)
            .then(data => {
                setSubject(data);
                setLoading(false);
            })
            .catch(() => {
                setError(t('subject.details.fetchError', 'Błąd pobierania danych.'));
                setLoading(false);
            });
    }, [id, t]);

    if (loading) return <div className="p-8 text-center text-secondary">{t('common.loading', 'Ładowanie...')}</div>;
    if (error || !subject) return <div className="p-8 text-center text-danger font-medium">{error || t('subject.details.notFound', 'Nie znaleziono przedmiotu.')}</div>;

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen bg-base relative">

            <div className="mb-8 border-b border-border pb-6">
                <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    Zarządzanie Kursem / {subject.name}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{subject.name}</h1>
                <p className="text-secondary max-w-4xl text-sm md:text-base mb-6 leading-relaxed">
                    Edycja: <span className="font-medium text-primary">{subject.edition}</span> | Organizacja Gitea: <a href={`https://gitea.com/${subject.organizationName}`} target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">{subject.organizationName}</a>
                </p>

                {subject.canEdit && (
                    <div className="flex flex-wrap gap-6">
                        <button className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Harmonogram
                        </button>
                        <button onClick={() => navigate(`/subjects/${subject.id}/edit`)} className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edytuj Przedmiot
                        </button>
                        <button className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            Uruchom Analizę
                        </button>
                        <button className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            Statystyki
                        </button>
                    </div>
                )}
            </div>

            {subject.canViewStats ? (
                <div className="flex flex-col gap-10">
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-10">
                            {[
                                { label: 'LICZBA STUDENTÓW', value: '42' },
                                { label: 'AKTYWNE REPOZYTORIA', value: '128' },
                                { label: 'OCZEKUJĄCE ANALIZY', value: '14' },
                                { label: 'ŚREDNIE PODOBIEŃSTWO', value: '8.4%' }
                            ].map((stat, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-widest mb-1">{stat.label}</span>
                                    <span className="text-3xl sm:text-4xl font-extrabold text-primary">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-primary">Ostatnie Raporty</h3>
                            <button
                                onClick={() => setIsReportsModalOpen(true)}
                                className="text-sm font-bold text-brand hover:text-brand-hover transition-colors"
                            >
                                Zobacz wszystkie →
                            </button>
                        </div>

                        <div className="flex overflow-x-auto gap-5 pb-4 snap-x">
                            {MOCK_REPORTS.map((report) => (
                                <div
                                    key={report.id}
                                    className="min-w-[280px] p-5 rounded-xl border border-border bg-surface shadow-sm snap-start shrink-0 cursor-pointer hover:border-brand transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-primary">Raport • {report.date}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                                            report.status === 'CLEAN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                                report.status === 'ALERT' ? 'bg-danger-subtle text-danger border border-danger-border' :
                                                    'bg-active text-secondary'
                                        }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary">{report.count} repozytoriów studenckich</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-primary">Aktywne Repozytoria Studenckie</h3>
                            <div className="flex gap-3 text-sm font-semibold text-secondary">
                                <button className="hover:text-primary transition-colors">Odśwież</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {MOCK_REPOS.map((repo) => {
                                let colors = "border-border bg-surface";
                                if (repo.status === 'alert') colors = "border-danger-border bg-danger-subtle";
                                if (repo.status === 'clean') colors = "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10";

                                return (
                                    <div key={repo.id} className={`border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-colors ${colors}`}>
                                        <div>
                                            <h4 className="font-bold text-primary text-base mb-1">{repo.name}</h4>
                                            <p className="text-sm text-secondary mb-1">
                                                Ostatni commit: {repo.date} — <span className={repo.status === 'alert' ? 'text-danger font-bold' : repo.status === 'clean' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-primary'}>{repo.msg}</span>
                                            </p>
                                            <p className="text-xs text-secondary font-medium">Użytkownicy: {repo.users}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                                            <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-secondary hover:text-primary hover:bg-active transition-colors">
                                                Podgląd Kodu
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="bg-surface border border-border rounded-xl p-12 text-center shadow-sm">
                    <p className="text-secondary text-lg">Brak uprawnień do przeglądania szczegółowych danych kursu.</p>
                </div>
            )}

            {isReportsModalOpen && (
                <div className="fixed inset-0 z-50 bg-base flex flex-col p-6 md:p-10 overflow-y-auto">
                    <div className="max-w-[1400px] w-full mx-auto">
                        <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                            <h2 className="text-3xl font-bold text-primary">Wszystkie Raporty Antyplagiatowe</h2>
                            <button
                                onClick={() => setIsReportsModalOpen(false)}
                                className="text-secondary hover:text-brand font-bold text-2xl p-2 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {MOCK_REPORTS.map((report) => (
                                <div key={report.id} className="p-5 rounded-xl border border-border bg-surface shadow-sm cursor-pointer hover:border-brand transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-primary">{report.date}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                                            report.status === 'CLEAN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                                report.status === 'ALERT' ? 'bg-danger-subtle text-danger border border-danger-border' :
                                                    'bg-active text-secondary'
                                        }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary">{report.count} repozytoriów</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};