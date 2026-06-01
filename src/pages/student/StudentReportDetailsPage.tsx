import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SafeCodeViewer from "../../shared/components/code_viewer/SafeCodeViewer";
import {
    ArrowLeft,
    ShieldAlert,
    FileText,
    Activity,
    Maximize,
    Hash,
    ChevronDown,
    ChevronUp,
    Code2
} from "lucide-react";
import { reportService } from "../../services/reportService";
import type { StudentOwnReportDetailsDTO } from "../../types/report.types";

export default function StudentReportDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [reportDetails, setReportDetails] = useState<StudentOwnReportDetailsDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedMatchIndex, setExpandedMatchIndex] = useState<number | null>(null);

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const data = await reportService.getMyReportDetails(id);
                setReportDetails(data);
            } catch (err: any) {
                console.error("Failed to fetch report details", err);
                if (err.response?.status === 403 || err.response?.status === 404) {
                    setError(t("studentReportDetails.error.accessDenied"));
                } else {
                    setError(t("studentReportDetails.error.general"));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id, t]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString(i18n.language, {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    if (error || !reportDetails) {
        return (
            <div className="min-h-screen bg-base p-8">
                <div className="max-w-4xl mx-auto text-center py-16 bg-surface rounded-2xl border border-border shadow-sm">
                    <ShieldAlert size={48} className="mx-auto text-danger mb-4 opacity-80" />
                    <h2 className="text-xl font-bold text-primary mb-2">{error}</h2>
                    <button
                        onClick={() => navigate('/student/reports')}
                        className="mt-6 px-4 py-2 bg-brand text-white rounded-md font-bold hover:bg-brand-dark transition-colors"
                    >
                        {t("studentReportDetails.back")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base p-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/student/reports')}
                    className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-semibold mb-6"
                >
                    <ArrowLeft size={18} />
                    {t("studentReportDetails.back")}
                </button>

                <div className="bg-surface rounded-2xl shadow-sm border border-border p-6 md:p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-brand-subtle text-brand rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <h1 className="text-2xl font-bold text-primary">
                                    {reportDetails.subjectName}
                                </h1>
                            </div>
                            <p className="text-secondary text-sm flex items-center gap-2">
                                <span className="font-semibold text-primary px-2 py-0.5 bg-base border border-border rounded-md">
                                    Tag: {reportDetails.tag}
                                </span>
                                • {formatDate(reportDetails.createdAt)}
                            </p>
                        </div>

                        <div className="bg-success-subtle text-success px-4 py-3 rounded-lg border border-success/20 flex items-center gap-3 max-w-sm">
                            <ShieldAlert size={20} className="shrink-0" />
                            <p className="text-xs font-medium leading-relaxed">
                                {t("studentReportDetails.privacyNotice")}
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-primary mb-4">
                    {t("studentReportDetails.matchesTitle")}
                </h2>

                {reportDetails.matches.length === 0 ? (
                    <div className="bg-surface rounded-xl border border-border p-12 text-center">
                        <Activity size={40} className="mx-auto text-secondary opacity-50 mb-3" />
                        <h3 className="text-lg font-bold text-primary mb-1">
                            {t("studentReportDetails.noMatches")}
                        </h3>
                        <p className="text-secondary text-sm">
                            {t("studentReportDetails.noMatchesSub")}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {reportDetails.matches.map((match, index) => {
                            const isExpanded = expandedMatchIndex === index;

                            return (
                                <div key={index} className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-all">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                                            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                                                {t("studentReportDetails.comparedWith")}
                                                <span className="bg-base px-3 py-1 rounded-md text-secondary border border-border italic text-sm">
                                                    {match.matchedWith === "ANONYMIZED"
                                                        ? t("studentReportDetails.anonymized")
                                                        : match.matchedWith}
                                                </span>
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                            {match.maxSimilarity !== null && match.maxSimilarity !== undefined && (
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                                        <Activity size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">
                                                            {t("studentReportDetails.metrics.max")}
                                                        </p>
                                                        <p className="text-2xl font-bold text-primary">{(match.maxSimilarity * 100).toFixed(1)}%</p>
                                                    </div>
                                                </div>
                                            )}

                                            {match.averageSimilarity !== null && match.averageSimilarity !== undefined && (
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                        <Hash size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">
                                                            {t("studentReportDetails.metrics.average")}
                                                        </p>
                                                        <p className="text-2xl font-bold text-primary">{(match.averageSimilarity * 100).toFixed(1)}%</p>
                                                    </div>
                                                </div>
                                            )}

                                            {match.longestMatch !== null && match.longestMatch !== undefined && (
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                                        <Maximize size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">
                                                            {t("studentReportDetails.metrics.longest")}
                                                        </p>
                                                        <p className="text-2xl font-bold text-primary">
                                                            {match.longestMatch} {t("studentReportDetails.metrics.tokens")}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {match.studentCode && match.studentFile && (
                                            <div className="mt-6 pt-4 border-t border-border flex justify-end">
                                                <button
                                                    onClick={() => setExpandedMatchIndex(isExpanded ? null : index)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-base border border-border hover:bg-active rounded-md text-sm font-bold text-primary transition-colors"
                                                >
                                                    <Code2 size={16} />
                                                    {isExpanded ? t("studentReportDetails.code.hide") : t("studentReportDetails.code.show")}
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {isExpanded && match.studentCode && (
                                        <div className="bg-base p-6 border-t border-border">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                                                    {t("studentReportDetails.code.file")} <span className="font-mono text-brand bg-brand-subtle px-2 py-0.5 rounded">{match.studentFile}</span>
                                                </h4>
                                                <span className="text-xs font-semibold text-danger bg-danger-subtle px-2 py-1 rounded">
                                                    {t("studentReportDetails.code.flaggedLines")} {match.matchedLines?.length || 0}
                                                </span>
                                            </div>
                                            <SafeCodeViewer
                                                code={match.studentCode}
                                                flaggedLines={match.matchedLines}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}