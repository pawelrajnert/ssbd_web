import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSubjectDetails, deleteSubject } from '../../services/subjectService';
import type { SubjectDTO } from '../../types/SubjectDTO';
import { formatDate, reportService } from "../../services/reportService";
import type { Page } from "../../types/user.types";
import type { ReportDTO } from "../../types/report.types";
import { getSimilarityBadge } from "../../shared/components/similarity_badge/SimilarityBadge";
import { Calendar, SquarePen, CirclePlay, BarChartBigIcon, Trash2, Loader2 } from "lucide-react";
import { PATHS } from "../../routes/paths";
import { EditSubjectModal } from './EditSubjectModal';

export const SubjectDetailsView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [subject, setSubject] = useState<SubjectDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [reports, setReports] = useState<Page<ReportDTO> | null>(null);
    const [isReportsModalOpen, setIsReportsModalOpen] = useState<boolean>(false);
    const [isStartAnalysisModalOpen, setIsStartAnalysisModalOpen] = useState<boolean>(false);
    const [analysisTag, setAnalysisTag] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [deleteGiteaOrg, setDeleteGiteaOrg] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const MOCK_REPOS = [
        { id: 1, name: 'Grupa_cz_12_01', date: 'Oct 24, 2026', msg: t('subject.details.status.clean', 'Brak podejrzenia plagiatu'), status: 'clean', users: 'Jan Kowalski, Anna Nowak' },
        { id: 2, name: 'Grupa_cz_12_02', date: 'Oct 23, 2026', msg: `${t('subject.details.status.alert', 'Podejrzenie!')} 82%`, status: 'alert', users: 'Marek Wiśniewski, Kasia Zielińska' }
    ];

    const fetchSubjectData = () => {
        if (!id) return;
        setLoading(true);
        getSubjectDetails(id)
            .then(data => {
                setSubject(data);
                setLoading(false);
            })
            .catch(() => {
                setError(t('subject.details.fetchError', 'Wystąpił błąd podczas pobierania przedmiotu.'));
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSubjectData();
        if (id) {
            reportService.getAllReportsForSubject(id, 0, 5, "created_at", true)
                .then(data => setReports(data))
                .catch(console.error);
        }
    }, [id, t]);

    const handleStartAnalysis = () => {
        if (!id) return;
        reportService.postStartSubjectAnalysis(id, analysisTag)
            .then(() => {
                setIsStartAnalysisModalOpen(false);
                setAnalysisTag('');
            })
            .catch((err: string) => {
                setError(err);
            });
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
            setIsDeleteModalOpen(false);
            navigate('/subjects');
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError(t('subject.deleteConflict', 'Dane uległy zmianie. Odśwież stronę.'));
            } else if (err.response?.status === 403) {
                setError(t('subject.deleteForbidden', 'Brak uprawnień do usunięcia przedmiotu.'));
            } else {
                setError(t('subject.deleteError', 'Wystąpił błąd podczas usuwania.'));
            }
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>;
    if (error || !subject) return <div className="p-8 text-center text-danger font-medium">{error || t('subject.details.notFound', 'Nie znaleziono przedmiotu.')}</div>;

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen bg-base relative">

            <div className="mb-8 border-b border-border pb-6">
                <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    {t('subject.details.breadcrumb', 'Przedmioty')} / {subject.name}
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{subject.name}</h1>
                        <p className="text-secondary max-w-4xl text-sm md:text-base mb-6 leading-relaxed">
                            {t('subject.details.edition', 'Edycja')}: <span className="font-medium text-primary">{subject.edition}</span> | {t('subject.details.organization', 'Organizacja')}: <a href={subject.giteaURL || `https://gitea.com/${subject.organizationName}`} target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">{subject.organizationName}</a>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <button
                            onClick={() => {
                                if (subject?.id) {
                                    navigate(PATHS.SUBJECT_SCHEDULE_LIST.replace(':id', subject.id.toString()));
                                }
                            }}
                            className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                            <Calendar/>
                            {t('subject.details.actions.schedule', 'Harmonogram')}
                        </button>
                        {subject.canEdit && (
                            <button onClick={() => setIsEditModalOpen(true)}
                                    className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                                <SquarePen/>
                                {t('subject.details.actions.edit', 'Edytuj')}
                            </button>
                        )}
                        <button
                            className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand-hover transition-colors"
                            onClick={() => setIsStartAnalysisModalOpen(true)}>
                            <CirclePlay/>
                            {t('subject.details.actions.analyze', 'Skanuj Teraz')}
                        </button>
                        <button
                            className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors">
                            <BarChartBigIcon/>
                            {t('subject.details.actions.statistics', 'Statystyki')}
                        </button>
                        {subject.canEdit && (
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="flex items-center gap-2 text-sm font-semibold text-danger hover:text-red-700 dark:hover:text-red-400 transition-colors md:ml-auto">
                                <Trash2 className="w-4 h-4"/>
                                {t('subject.delete', 'Usuń')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {subject.canViewStats ? (
                <div className="flex flex-col gap-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-4">
                        {[
                            {label: t('subject.details.stats.students', 'Studentów'), value: '42'},
                            {label: t('subject.details.stats.repos', 'Repozytoriów'), value: '128'},
                            {label: t('subject.details.stats.pending', 'Oczekujące'), value: reports?.totalElements || '0'},
                            {label: t('subject.details.stats.similarity', 'Średnie Podobieństwo'), value: '8.4%'}
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span className="text-[11px] sm:text-xs font-bold text-secondary uppercase tracking-widest mb-1">{stat.label}</span>
                                <span className="text-4xl sm:text-5xl font-extrabold text-primary">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4 mt-4">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                <BarChartBigIcon className="w-5 h-5 text-brand" />
                                {t('subject.details.reports.title', 'Ostatnie Raporty')}
                            </h3>
                            <button type="button" onClick={() => setIsReportsModalOpen(true)} className="text-sm font-bold text-brand hover:text-brand-hover transition-colors">
                                {t('subject.details.reports.viewAll', 'Zobacz Wszystkie')}
                            </button>
                        </div>

                        <div className="flex overflow-x-auto gap-5 pb-4 snap-x [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#cbd5e1] hover:[&::-webkit-scrollbar-thumb]:bg-[#94a3b8] dark:[&::-webkit-scrollbar-thumb]:bg-[#475569] dark:hover:[&::-webkit-scrollbar-thumb]:bg-[#334155] [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
                            {reports?.content.length === 0 ? (
                                <p className="text-sm text-secondary italic">Brak wygenerowanych raportów.</p>
                            ) : (
                                reports?.content.map((report) => (
                                    <div key={report.id} className="min-w-[280px] p-5 rounded-xl border border-border bg-surface shadow-sm snap-start shrink-0 cursor-pointer hover:border-brand transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-primary">{t('subject.details.reports.report', 'Raport')} • {formatDate(report.created_at)}</h4>
                                            <span className={"text-[13px] font-bold px-2 py-0.5 rounded-sm"}>
                                                {getSimilarityBadge(report.average_similarity * 100)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-secondary font-mono bg-base px-2 py-1 rounded inline-block"> {report.tag} </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-primary">{t('subject.details.repos.title', 'Repozytoria')}</h3>
                            <div className="flex gap-4 text-sm font-semibold text-secondary">
                                <button type="button" className="hover:text-primary transition-colors flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    {t('subject.details.repos.refresh', 'Odśwież')}
                                </button>
                                <button type="button" className="hover:text-primary transition-colors">{t('subject.details.repos.filter', 'Filtruj')}</button>
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
                                                {t('subject.details.repos.lastCommit', 'Ostatni commit')}: {repo.date} — <span className={repo.status === 'alert' ? 'text-danger font-bold' : repo.status === 'clean' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-primary'}>{repo.msg}</span>
                                            </p>
                                            <p className="text-xs text-secondary font-medium">{t('subject.details.repos.contributors', 'Członkowie')}: {repo.users}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                                            <button type="button" className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-secondary hover:text-primary hover:bg-active transition-colors">
                                                {t('subject.details.repos.viewCode', 'Kod')}
                                            </button>
                                            <button type="button" className="px-4 py-2 bg-brand border border-brand rounded-lg text-sm font-bold text-white hover:bg-brand-hover shadow-sm transition-colors">
                                                {t('subject.details.repos.analyze', 'Skanuj')}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="bg-surface border border-border rounded-xl p-12 text-center shadow-sm mt-8">
                    <p className="text-secondary text-lg">{t('subject.details.noAccess', 'Nie masz dostępu do statystyk tego przedmiotu.')}</p>
                </div>
            )}


            {isReportsModalOpen && (
                <div className="fixed inset-0 z-50 bg-base flex flex-col p-6 md:p-10 overflow-y-auto animate-fade-in">
                    <div className="max-w-[1400px] w-full mx-auto">
                        <div className="flex justify-between items-center mb-8 border-b border-border pb-4 mt-4">
                            <h2 className="text-3xl font-bold text-primary">{t('subject.details.reports.modalTitle', 'Wszystkie Raporty')}</h2>
                            <button type="button" onClick={() => setIsReportsModalOpen(false)} className="text-secondary hover:text-brand font-bold text-3xl p-2 transition-colors leading-none">&times;</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {reports?.content.map((report) => (
                                <div key={report.id} className="p-5 rounded-xl border border-border bg-surface shadow-sm cursor-pointer hover:border-brand transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-primary">{t('subject.details.reports.report', 'Raport')} • {formatDate(report.created_at)}</h4>
                                        <span className={"text-[13px] font-bold px-2 py-0.5 rounded-sm"}>
                                            {getSimilarityBadge(report.average_similarity * 100)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-secondary font-mono bg-base px-2 py-1 rounded inline-block">{report.tag}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isStartAnalysisModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface w-full max-w-[480px] rounded-2xl shadow-xl overflow-hidden border border-border">
                        <div className="flex justify-between items-center p-6 pb-4">
                            <h2 className="text-[20px] font-bold text-primary">
                                {t('subject.analysis.modal.title', 'Rozpocznij Nową Analizę')}
                            </h2>
                            <button onClick={() => setIsStartAnalysisModalOpen(false)} className="text-secondary hover:text-primary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="px-6 pb-6">
                            <p className="text-[13px] text-secondary leading-relaxed mb-6">
                                {t('subject.analysis.modal.description', 'Wprowadź tag, aby pobrać odpowiedni kod ze wszystkich repozytoriów studentów przypisanych do przedmiotu.')}
                            </p>
                            <div>
                                <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-2">
                                    {t('subject.analysis.modal.tagLabel', 'Tag z Gitea')}
                                </label>
                                <input
                                    type="text"
                                    value={analysisTag}
                                    onChange={(e) => setAnalysisTag(e.target.value)}
                                    placeholder={t('subject.analysis.modal.tagPlaceholder', 'np. wersja-koncowa-v1')}
                                    className="w-full px-4 py-2.5 bg-base border border-border rounded-lg text-primary placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                                />
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex justify-end items-center gap-4">
                            <button onClick={() => setIsStartAnalysisModalOpen(false)} className="text-[14px] font-bold text-secondary hover:text-primary transition-colors">
                                {t('common.cancel', 'Anuluj')}
                            </button>
                            <button onClick={handleStartAnalysis} className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-[14px] font-bold rounded-lg shadow-sm transition-colors">
                                {t('subject.analysis.modal.submit', 'Skanuj Teraz')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface w-full max-w-[480px] rounded-2xl shadow-xl overflow-hidden border border-border">
                        <div className="flex justify-between items-center p-6 pb-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-danger-subtle rounded-full text-danger">
                                    <Trash2 className="w-5 h-5"/>
                                </div>
                                <h2 className="text-xl font-bold text-primary">{t('subject.deleteConfirmTitle', 'Usunąć przedmiot?')}</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-secondary leading-relaxed mb-6">
                                {t('subject.deleteConfirmMessage', 'Czy na pewno chcesz trwale usunąć ten przedmiot? Ta akcja jest nieodwracalna.')}
                            </p>
                            <div className="flex items-center gap-3 mt-5">
                                <input
                                    id="gitea-delete-checkbox"
                                    type="checkbox"
                                    checked={deleteGiteaOrg}
                                    onChange={(e) => setDeleteGiteaOrg(e.target.checked)}
                                    className="w-4 h-4 rounded border-border accent-danger text-danger focus:ring-danger cursor-pointer"
                                />
                                <label htmlFor="gitea-delete-checkbox" className="text-sm font-bold text-primary cursor-pointer select-none">
                                    {t('subject.deleteGiteaOption', 'Usuń również organizację i repozytoria z Gitea')}
                                </label>
                            </div>
                        </div>
                        <div className="px-6 pb-6 pt-2 flex justify-end items-center gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting} className="text-sm font-bold text-secondary hover:text-primary transition-colors disabled:opacity-50">
                                {t('common.cancel', 'Anuluj')}
                            </button>
                            <button onClick={handleDeleteSubject} disabled={isDeleting} className="px-6 py-2.5 bg-danger hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50">
                                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                {t('common.delete', 'Usuń Trwale')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && subject && (
                <EditSubjectModal
                    subject={subject}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        fetchSubjectData();
                    }}
                />
            )}

        </div>
    );
};