import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertTriangle, User } from 'lucide-react';
import { reportService } from '../../services/reportService';
import type { TeacherReportDetails, TeacherComparison } from '../../types/report.types';
import {SideBySideViewer} from "../../shared/components/SideBySideViewer.tsx";

const TeacherReportDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const { id: reportId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [report, setReport] = useState<TeacherReportDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedComparison, setSelectedComparison] = useState<TeacherComparison | null>(null);

    useEffect(() => {
        if (!reportId) return;
        const fetchReport = async () => {
            try {
                setLoading(true);
                const data = await reportService.getTeacherReportDetails(reportId);
                setReport(data);
                if (data.comparisons && data.comparisons.length > 0) {
                    setSelectedComparison(data.comparisons[0]);
                }
            } catch (err: any) {
                if (err.response?.data?.message === 'error.report.file' || err.response?.status === 500) {
                    setError(t('report.fileError'));
                }
                else if (err.response?.status === 404) {
                    setError(t('report.notFound'));
                }
                else if (err.response?.status === 403) {
                    setError(t('report.accessDenied', 'Brak dostępu do tego raportu.'));
                }
                else {
                    setError(t('report.fetchError'));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [reportId, t]);

    const getSimilarities = () => {
        if (!selectedComparison) return { avg: 0, simA: 0, simB: 0 };
        const max = selectedComparison.maxSimilarity * 100;
        const avg = selectedComparison.averageSimilarity * 100;
        const min = (max > 0 && (2 * max - avg) > 0) ? (avg * max) / (2 * max - avg) : 0;

        return {
            avg: avg.toFixed(2),
            simA: max.toFixed(2),
            simB: min.toFixed(2)
        };
    };

    const stats = getSimilarities();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="flex h-screen flex-col items-center justify-center text-center bg-base">
                <AlertTriangle className="mb-4 h-16 w-16 text-danger" />
                <h2 className="mb-2 text-2xl font-bold text-primary">{error || t('report.notFound')}</h2>
                <button onClick={() => navigate(-1)} className="mt-6 flex items-center rounded-md bg-brand px-6 py-2 text-white hover:bg-brand-hover">
                    <ArrowLeft className="mr-2 h-5 w-5" /> {t('common.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-base overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-secondary hover:text-brand transition-colors">
                        <ArrowLeft className="mr-1 h-5 w-5" /> {t('common.back')}
                    </button>
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <h1 className="text-lg font-bold text-primary truncate max-w-[300px] xl:max-w-[500px]" title={report.subjectName}>
                        {report.subjectName}
                    </h1>
                </div>

                {selectedComparison && (
                    <div className="flex items-center gap-6 bg-base border border-border px-4 py-2 rounded-lg shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{t('report.averageSimilarity')}</span>
                            <span className="text-sm font-bold text-primary">{stats.avg}%</span>
                        </div>
                        <div className="h-8 w-px bg-border"></div>

                        <div className="flex flex-col group relative cursor-help">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                                {t('report.similarity')} {selectedComparison.firstSubmission}
                            </span>
                            <span className="text-sm font-bold text-danger">{stats.simA}%</span>
                            <div className="invisible group-hover:visible absolute top-full left-0 mt-2 w-64 bg-gray-800 text-white text-xs p-3 rounded shadow-xl z-50">
                                {t('report.tooltipCodeFrom')} {selectedComparison.firstSubmission}, {t('report.tooltipFoundIn')} {selectedComparison.secondSubmission}.<br/><br/>{t('report.tooltipAsymmetry')}
                            </div>
                        </div>

                        <div className="h-8 w-px bg-border"></div>

                        <div className="flex flex-col group relative cursor-help">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                                {t('report.similarity')} {selectedComparison.secondSubmission}
                            </span>
                            <span className="text-sm font-bold text-danger">{stats.simB}%</span>
                            <div className="invisible group-hover:visible absolute top-full right-0 mt-2 w-64 bg-gray-800 text-white text-xs p-3 rounded shadow-xl z-50">
                                {t('report.tooltipCodeFrom')} {selectedComparison.secondSubmission}, {t('report.tooltipFoundIn')} {selectedComparison.firstSubmission}.<br/><br/>{t('report.tooltipAsymmetry')}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-base shrink-0 z-0">
                <span className="font-semibold text-primary text-sm whitespace-nowrap bg-surface px-3 py-1.5 rounded-lg border border-border shadow-sm">
                    {t('report.repositories')} ({report.comparisons.length}):
                </span>

                <div className="flex flex-nowrap overflow-x-auto custom-scrollbar gap-2 pb-1 flex-1">
                    {report.comparisons.map((comp, index) => {
                        const isSelected = selectedComparison === comp;
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedComparison(comp)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md shadow-sm transition-all border whitespace-nowrap shrink-0 ${
                                    isSelected
                                        ? 'bg-brand/10 border-brand text-brand font-bold'
                                        : 'bg-surface border-border hover:border-brand/50 hover:bg-active text-secondary'
                                }`}
                            >
                                <User className={`h-3.5 w-3.5 ${isSelected ? 'text-brand' : 'text-secondary'}`} />
                                <span className={`text-sm ${isSelected ? 'text-brand' : 'text-primary'}`}>
                                    {comp.firstSubmission} <span className="text-[10px] text-secondary mx-1 uppercase">vs</span> {comp.secondSubmission}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-base overflow-hidden px-6 pb-6">
                {selectedComparison ? (
                    <SideBySideViewer comparison={selectedComparison} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-secondary">
                        {t('report.selectRepositories')}
                    </div>
                )}
            </div>

        </div>
    );
};

export default TeacherReportDetailsPage;