import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft,
    FileCode2,
    Percent,
    ChevronDown,
    ChevronUp,
    User,
    Calendar,
    Hash,
    AlertTriangle,
    FileText
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import type { TeacherReportDetails } from '../../types/report.types';
import SafeCodeViewer from '../../shared/components/code_viewer/SafeCodeViewer';

const TeacherReportDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const { id: reportId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [report, setReport] = useState<TeacherReportDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedMatchIndex, setExpandedMatchIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!reportId) return;

        const fetchReport = async () => {
            try {
                setLoading(true);
                const data = await reportService.getTeacherReportDetails(reportId);
                setReport(data);
            } catch (err: any) {
                if (err.response?.data?.message === 'error.report.file' || err.response?.status === 500) {
                    setError(t('report.fileError'));
                } else if (err.response?.status === 403) {
                    setError(t('report.accessDenied'));
                } else if (err.response?.status === 404) {
                    setError(t('report.notFound'));
                } else {
                    setError(t('report.fetchError'));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [reportId, t]);

    const toggleMatch = (index: number) => {
        setExpandedMatchIndex(prev => (prev === index ? null : index));
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-base">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center p-8 text-center bg-base">
                <AlertTriangle className="mb-4 h-16 w-16 text-danger" />
                <h2 className="mb-2 text-2xl font-bold text-primary">{error || t('report.notFound')}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 flex items-center rounded-md bg-brand px-6 py-2 text-white transition-colors hover:bg-brand-hover"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    {t('common.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-8 bg-base min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-sm font-medium text-brand transition-colors hover:text-brand-hover"
                    >
                        <ArrowLeft className="mr-1 h-5 w-5" />
                        {t('common.back')}
                    </button>
                    <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                        {t('report.teacherDetailsTitle')}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center rounded-xl bg-surface p-5 shadow-sm border border-border">
                    <div className="mr-4 rounded-full bg-brand/10 p-3">
                        <FileCode2 className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-secondary">{t('report.subject')}</p>
                        <p className="text-lg font-bold text-primary truncate max-w-[150px]">{report.subjectName}</p>
                    </div>
                </div>
                <div className="flex items-center rounded-xl bg-surface p-5 shadow-sm border border-border">
                    <div className="mr-4 rounded-full bg-purple-500/10 p-3">
                        <Hash className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-secondary">{t('report.tag')}</p>
                        <p className="text-lg font-bold text-primary">{report.tag}</p>
                    </div>
                </div>
                <div className="flex items-center rounded-xl bg-surface p-5 shadow-sm border border-border">
                    <div className="mr-4 rounded-full bg-green-500/10 p-3">
                        <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-secondary">{t('report.createdAt')}</p>
                        <p className="text-lg font-bold text-primary">
                            {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center rounded-xl bg-surface p-5 shadow-sm border border-border">
                    <div className="mr-4 rounded-full bg-danger/10 p-3">
                        <Percent className="h-6 w-6 text-danger" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-secondary">{t('report.averageSimilarity')}</p>
                        <p className="text-lg font-bold text-danger">{report.averageSimilarity.toFixed(2)}%</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <h2 className="text-xl font-bold text-primary">{t('report.comparisonsList')}</h2>
                {report.comparisons.length === 0 ? (
                    <div className="rounded-xl bg-surface p-8 text-center shadow-sm border border-border">
                        <p className="text-secondary">{t('report.noComparisons')}</p>
                    </div>
                ) : (
                    report.comparisons.map((comp, index) => {
                        const isExpanded = expandedMatchIndex === index;

                        return (
                            <div key={index} className="flex flex-col rounded-xl bg-surface shadow-sm border border-border overflow-hidden transition-all">
                                <div
                                    className="flex cursor-pointer items-center justify-between p-5 hover:bg-active transition-colors"
                                    onClick={() => toggleMatch(index)}
                                >
                                    <div className="flex flex-1 flex-wrap items-center gap-4 lg:gap-8">
                                        <div className="flex items-center gap-2 rounded-lg bg-base border border-border px-3 py-1.5 shadow-sm">
                                            <User className="h-4 w-4 text-brand" />
                                            <span className="font-semibold text-primary">{comp.firstSubmission}</span>
                                        </div>
                                        <span className="text-sm font-bold text-secondary">VS</span>
                                        <div className="flex items-center gap-2 rounded-lg bg-base border border-border px-3 py-1.5 shadow-sm">
                                            <User className="h-4 w-4 text-brand" />
                                            <span className="font-semibold text-primary">{comp.secondSubmission}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 lg:gap-8">
                                        <div className="hidden sm:flex flex-col text-right">
                                            <span className="text-[11px] uppercase tracking-wider text-secondary">{t('report.longestMatch')}</span>
                                            <span className="font-medium text-primary">{comp.longestMatch}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[11px] uppercase tracking-wider text-secondary">{t('report.avgSimilarity')}</span>
                                            <span className="font-semibold text-orange-500">{comp.averageSimilarity.toFixed(2)}%</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[11px] uppercase tracking-wider text-secondary">{t('report.maxSimilarity')}</span>
                                            <span className="font-bold text-danger">{comp.maxSimilarity.toFixed(2)}%</span>
                                        </div>
                                        <div className="ml-2 rounded-full p-1 bg-base border border-border">
                                            {isExpanded ? <ChevronUp className="h-5 w-5 text-secondary" /> : <ChevronDown className="h-5 w-5 text-secondary" />}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-border bg-base p-5">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm">
                                                <div className="flex items-center justify-between border-b border-border pb-3">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <div className="h-2 w-2 shrink-0 rounded-full bg-brand"></div>
                                                        <h3 className="font-semibold text-primary truncate">
                                                            {comp.firstSubmission}
                                                        </h3>
                                                    </div>
                                                    {comp.fileA && (
                                                        <div className="flex shrink-0 items-center gap-1 text-xs text-secondary bg-base px-2 py-1 rounded border border-border">
                                                            <FileText className="h-3 w-3" />
                                                            <span className="truncate max-w-[150px]">{comp.fileA}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-h-[500px] overflow-y-auto overflow-x-hidden rounded bg-[#1e1e1e] border border-border shadow-inner custom-scrollbar">
                                                    <SafeCodeViewer
                                                        code={comp.codeA || t('report.noCodeAvailable')}
                                                        language="java"
                                                        flaggedLines={comp.matchedLinesA}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm">
                                                <div className="flex items-center justify-between border-b border-border pb-3">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500"></div>
                                                        <h3 className="font-semibold text-primary truncate">
                                                            {comp.secondSubmission}
                                                        </h3>
                                                    </div>
                                                    {comp.fileB && (
                                                        <div className="flex shrink-0 items-center gap-1 text-xs text-secondary bg-base px-2 py-1 rounded border border-border">
                                                            <FileText className="h-3 w-3" />
                                                            <span className="truncate max-w-[150px]">{comp.fileB}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-h-[500px] overflow-y-auto overflow-x-hidden rounded bg-[#1e1e1e] border border-border shadow-inner custom-scrollbar">
                                                    <SafeCodeViewer
                                                        code={comp.codeB || t('report.noCodeAvailable')}
                                                        language="java"
                                                        flaggedLines={comp.matchedLinesA}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TeacherReportDetailsPage;