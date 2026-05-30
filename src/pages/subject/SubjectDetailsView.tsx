import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {getSubjectDetails, deleteSubject} from '../../services/subjectService';
import type {SubjectDTO} from '../../types/SubjectDTO';
import {useTranslation} from 'react-i18next';
import {formatDate, reportService} from "../../services/reportService.ts";
import type {Page} from "../../types/user.types.ts";
import type {ReportDTO} from "../../types/report.types.ts";
import {getSimilarityBadge} from "../../shared/components/similarity_badge/SimilarityBadge.tsx";
import {Calendar, SquarePen, CirclePlay, BarChartBigIcon, Trash2, Loader2} from "lucide-react"

export const SubjectDetailsView: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [subject, setSubject] = useState<SubjectDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isReportsModalOpen, setIsReportsModalOpen] = useState<boolean>(false);
    const [isStartAnalysisModalOpen, setIsStartAnalysisModalOpen] = useState<boolean>(false);
    const [analysisTag, setAnalysisTag] = useState('');

    const [reports, setReports] = useState<Page<ReportDTO> | null>(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [deleteGiteaOrg, setDeleteGiteaOrg] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const MOCK_REPOS = [
        {
            id: 1,
            name: 'Grupa_cz_12_01',
            date: 'Oct 24, 2026',
            msg: t('subject.details.status.clean'),
            status: 'clean',
            users: 'Jan Kowalski, Anna Nowak'
        },
        {
            id: 2,
            name: 'Grupa_cz_12_02',
            date: 'Oct 23, 2026',
            msg: `${t('subject.details.status.alert')} 82%`,
            status: 'alert',
            users: 'Marek Wiśniewski, Kasia Zielińska'
        },
        {
            id: 3,
            name: 'Grupa_cz_12_03',
            date: 'Oct 21, 2026',
            msg: t('subject.details.status.pending'),
            status: 'pending',
            users: 'Piotr Mazur, Olga Lewandowska'
        },
        {
            id: 4,
            name: 'Grupa_cz_12_04',
            date: 'Oct 19, 2026',
            msg: t('subject.details.status.clean'),
            status: 'clean',
            users: 'Tomasz Kot, Ewa Wójcik'
        },
    ];

    useEffect(() => {
        if (!id) return;
        getSubjectDetails(id)
            .then(data => {
                setSubject(data);
                setLoading(false);
            })
            .catch(() => {
                setError(t('subject.details.fetchError'));
                setLoading(false);
            });
        reportService.getAllReportsForSubject(id, 0, 5, "created_at", true)
            .then(data => {
                setReports(data)
            })
    }, [id, t]);

    const handleStartAnalysis = () => {
        reportService.postStartSubjectAnalysis(id, analysisTag)
            .catch((err: string) => {
                setError(err)
            });
        setIsStartAnalysisModalOpen(false);
        setAnalysisTag('');
    };

    const handleDeleteSubject = async () => {
        if (!id || !subject) return;

        const currentHash = subject.versionHash;

        if (!currentHash) {
            setError("Błąd: Brak wersji przedmiotu (versionHash). Odśwież stronę.");
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await deleteSubject(id, currentHash, deleteGiteaOrg);
            navigate('/subjects');
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError(t('subject.deleteConflict'));
            } else if (err.response?.status === 403) {
                setError(t('subject.deleteForbidden'));
            } else {
                setError(t('subject.deleteError'));
            }
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-secondary">{t('common.loading', 'Ładowanie...')}</div>;
    if (error || !subject) return <div
        className="p-8 text-center text-danger font-medium">{error || t('subject.details.notFound')}</div>;

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen bg-base relative">

            <div className="mb-8 border-b border-border pb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{subject.name}</h1>
                <p className="text-secondary max-w-4xl text-sm md:text-base mb-6 leading-relaxed">
                    {t('subject.details.edition')}: <span
                        className="font-medium text-primary">{subject.edition}</span> | {t('subject.details.organization')}: <a
                href={subject.giteaURL || "#"} target="_blank" rel="noreferrer"
                className="font-medium text-brand hover:underline">{subject.organizationName}</a>
                </p>

                <div className="flex flex-wrap gap-6">
                    <button
                        className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                        <Calendar/>
                        {t('subject.details.actions.schedule')}
                    </button>
                    {subject.canEdit && (
                        <button onClick={() => navigate(`/subjects/${subject.id}/edit`)}
                                className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                            <SquarePen/>
                            {t('subject.details.actions.edit')}
                        </button>
                    )}
                    <button
                        className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand-hover transition-colors"
                        onClick={() => setIsStartAnalysisModalOpen(true)}>
                        <CirclePlay/>
                        {t('subject.details.actions.analyze')}
                    </button>
                    <button
                        className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                        <BarChartBigIcon/>
                        {t('subject.details.actions.statistics')}
                    </button>
                    {subject.canEdit && (
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex items-center gap-2 text-sm font-semibold text-danger hover:text-red-700 dark:hover:text-red-400 transition-colors md:ml-auto">
                            <Trash2 className="w-4 h-4"/>
                            {t('subject.delete')}
                        </button>
                    )}
                </div>
            </div>

            {subject.canViewStats ? (
                <div className="flex flex-col gap-10">

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-4">
                        {[
                            {label: t('subject.details.stats.students'), value: '42'},
                            {label: t('subject.details.stats.repos'), value: '128'},
                            {label: t('subject.details.stats.pending'), value: reports?.totalElements},
                            {label: t('subject.details.stats.similarity'), value: '8.4%'}
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span
                                    className="text-[11px] sm:text-xs font-bold text-secondary uppercase tracking-widest mb-1">{stat.label}</span>
                                <span className="text-4xl sm:text-5xl font-extrabold text-primary">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4 mt-4">
                            <h3 className="text-xl font-bold text-primary">{t('subject.details.reports.title')}</h3>
                            <button
                                onClick={() => setIsReportsModalOpen(true)}
                                className="text-sm font-bold text-brand hover:text-brand-hover transition-colors"
                            >
                                {t('subject.details.reports.viewAll')}
                            </button>
                        </div>

                        <div
                            className="flex overflow-x-auto gap-5 pb-4 snap-x [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#cbd5e1] hover:[&::-webkit-scrollbar-thumb]:bg-[#94a3b8] dark:[&::-webkit-scrollbar-thumb]:bg-[#475569] dark:hover:[&::-webkit-scrollbar-thumb]:bg-[#334155] [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
                            {reports?.content.map((report) => (
                                <div
                                    key={report.id}
                                    className="min-w-[280px] p-5 rounded-xl border border-border bg-surface shadow-sm snap-start shrink-0 cursor-pointer hover:border-brand transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-primary">{t('subject.details.reports.report')} • {formatDate(report.created_at)}</h4>
                                        <span className={"text-[13px] font-bold px-2 py-0.5 rounded-sm"}>
                                            {getSimilarityBadge(report.average_similarity * 100)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary"> {report.tag} </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-primary">{t('subject.details.repos.title')}</h3>
                            <div className="flex gap-4 text-sm font-semibold text-secondary">
                                <button className="hover:text-primary transition-colors flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                    </svg>
                                    {t('subject.details.repos.refresh')}
                                </button>
                                <button
                                    className="hover:text-primary transition-colors">{t('subject.details.repos.filter')}</button>
                                <button
                                    className="hover:text-primary transition-colors">{t('subject.details.repos.sort')}</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {MOCK_REPOS.map((repo) => {
                                let colors = "border-border bg-surface";
                                if (repo.status === 'alert') colors = "border-danger-border bg-danger-subtle";
                                if (repo.status === 'clean') colors = "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10";

                                return (
                                    <div key={repo.id}
                                         className={`border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-colors ${colors}`}>
                                        <div>
                                            <h4 className="font-bold text-primary text-base mb-1">{repo.name}</h4>
                                            <p className="text-sm text-secondary mb-1">
                                                {t('subject.details.repos.lastCommit')}: {repo.date} — <span
                                                className={repo.status === 'alert' ? 'text-danger font-bold' : repo.status === 'clean' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-primary'}>{repo.msg}</span>
                                            </p>
                                            <p className="text-xs text-secondary font-medium">{t('subject.details.repos.contributors')}: {repo.users}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                                            <button
                                                className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-secondary hover:text-primary hover:bg-active transition-colors">
                                                {t('subject.details.repos.viewCode')}
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-brand border border-brand rounded-lg text-sm font-bold text-white hover:bg-brand-hover shadow-sm transition-colors">
                                                {t('subject.details.repos.analyze')}
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
                    <p className="text-secondary text-lg">{t('subject.details.noAccess')}</p>
                </div>
            )}

            {isReportsModalOpen && (
                <div className="fixed inset-0 z-50 bg-base flex flex-col p-6 md:p-10 overflow-y-auto animate-fade-in">
                    <div className="max-w-[1400px] w-full mx-auto">
                        <div className="flex justify-between items-center mb-8 border-b border-border pb-4 mt-4">
                            <h2 className="text-3xl font-bold text-primary">{t('subject.details.reports.modalTitle')}</h2>
                            <button
                                onClick={() => setIsReportsModalOpen(false)}
                                className="text-secondary hover:text-brand font-bold text-3xl p-2 transition-colors leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {reports?.content.map((report) => (
                                <div
                                    key={report.id}
                                    className="min-w-[280px] p-5 rounded-xl border border-border bg-surface shadow-sm snap-start shrink-0 cursor-pointer hover:border-brand transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-primary">{t('subject.details.reports.report')} • {formatDate(report.created_at)}</h4>
                                        <span className={"text-[13px] font-bold px-2 py-0.5 rounded-sm"}>
                                            {getSimilarityBadge(report.average_similarity * 100)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary"> {report.tag} </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {isStartAnalysisModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div
                        className="bg-white dark:bg-surface w-full max-w-[480px] rounded-2xl shadow-xl overflow-hidden border border-border">

                        <div className="flex justify-between items-center p-6 pb-4">
                            <h2 className="text-[20px] font-bold text-[#2a2a2a] dark:text-primary">
                                {t('subject.analysis.modal.title', 'Start New Analysis')}
                            </h2>
                            <button
                                onClick={() => setIsStartAnalysisModalOpen(false)}
                                className="text-gray-500 hover:text-gray-800 dark:text-secondary dark:hover:text-primary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 pb-6">
                            <p className="text-[13px] text-gray-600 dark:text-secondary leading-relaxed mb-6">
                                {t('subject.analysis.modal.description', 'Enter the tag to pull the corresponding code from all student repositories for this subject.')}
                            </p>

                            <div>
                                <label
                                    className="block text-[11px] font-bold text-[#2a2a2a] dark:text-primary uppercase tracking-wider mb-2">
                                    {t('subject.analysis.modal.tagLabel', 'Gitea Tag')}
                                </label>
                                <input
                                    type="text"
                                    value={analysisTag}
                                    onChange={(e) => setAnalysisTag(e.target.value)}
                                    placeholder={t('subject.analysis.modal.tagPlaceholder', 'e.g., final-submission-v1')}
                                    className="w-full px-4 py-2.5 bg-transparent border border-[#e2c8c8] dark:border-border rounded-lg text-[#2a2a2a] dark:text-primary placeholder:text-gray-400 focus:outline-none focus:border-[#8b1114] focus:ring-1 focus:ring-[#8b1114] transition-all"
                                />
                            </div>
                        </div>

                        <div className="px-6 pb-6 flex justify-end items-center gap-6">
                            <button
                                onClick={() => setIsStartAnalysisModalOpen(false)}
                                className="text-[14px] font-bold text-[#5a5a5a] dark:text-secondary hover:text-[#2a2a2a] dark:hover:text-primary transition-colors"
                            >
                                {t('common.cancel', 'Cancel')}
                            </button>
                            <button
                                onClick={handleStartAnalysis}
                                className="px-6 py-2.5 bg-[#8b1114] hover:bg-[#6b0d0f] text-white text-[14px] font-bold rounded-lg shadow-sm transition-colors"
                            >
                                {t('subject.analysis.modal.submit', 'Start Analysis')}
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface w-full max-w-[480px] rounded-2xl shadow-xl overflow-hidden border border-border">

                        <div className="flex justify-between items-center p-6 pb-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-danger-subtle rounded-full text-danger">
                                    <Trash2 className="w-5 h-5"/>
                                </div>
                                <h2 className="text-xl font-bold text-primary">
                                    {t('subject.deleteConfirmTitle')}
                                </h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-secondary leading-relaxed mb-6">
                                {t('subject.deleteConfirmMessage')}
                            </p>

                            <div className="flex items-center gap-3 mt-5">
                                <input
                                    id="gitea-delete-checkbox"
                                    type="checkbox"
                                    checked={deleteGiteaOrg}
                                    onChange={(e) => setDeleteGiteaOrg(e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-danger focus:ring-danger cursor-pointer"
                                />
                                <label
                                    htmlFor="gitea-delete-checkbox"
                                    className="text-sm font-bold text-primary cursor-pointer select-none"
                                >
                                    {t('subject.deleteGiteaOption')}
                                </label>
                            </div>
                        </div>

                        <div className="px-6 pb-6 pt-2 flex justify-end items-center gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="text-sm font-bold text-secondary hover:text-primary transition-colors disabled:opacity-50"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDeleteSubject}
                                disabled={isDeleting}
                                className="px-6 py-2.5 bg-danger hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : null}
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};