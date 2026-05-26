import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ruleService } from "../../services/ruleService";
import type { RulePresetDTO } from "../../types/rule.types";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function GlobalRulesPage() {
    const { t } = useTranslation();
    const [rules, setRules] = useState<RulePresetDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRules = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ruleService.getRulePresetsTemplates();
            setRules(data);
        } catch {
            setError(t('globalRules.error.fetch'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    return (
        <div className="min-h-screen bg-base p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">
                        {t('sidebar.globalRules')}
                    </h1>
                    <button
                        onClick={fetchRules}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-active disabled:opacity-50 rounded-md text-sm font-bold text-primary transition-colors"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        {t('common.refresh')}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-danger-subtle border border-danger text-danger rounded-xl flex items-center gap-3 text-sm font-semibold">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-border bg-base">
                            <th className="py-5 px-8 text-xs font-bold text-secondary uppercase">{t('globalRules.table.raportLevel')}</th>
                            <th className="py-5 px-8 text-xs font-bold text-secondary uppercase">{t('globalRules.table.studentTickets')}</th>
                            <th className="py-5 px-8 text-xs font-bold text-secondary uppercase">{t('globalRules.table.minTokens')}</th>
                            <th className="py-5 px-8 text-xs font-bold text-secondary uppercase">{t('globalRules.table.normalization')}</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {isLoading && rules.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-secondary">{t('common.loading')}</td>
                            </tr>
                        ) : rules.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-secondary">{t('globalRules.noResults')}</td>
                            </tr>
                        ) : (
                            rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-base/40 transition-colors">
                                    <td className="py-4 px-8 text-sm text-primary font-semibold">
                                        {t(`globalRules.levels.${rule.raportLevelName}`, rule.raportLevelName?.replace(/_/g, ' '))}
                                    </td>
                                    <td className="py-4 px-8 text-sm text-primary">{rule.studentTicketCount}</td>
                                    <td className="py-4 px-8 text-sm text-primary">{rule.minimumTokensMatch}</td>
                                    <td className="py-4 px-8 text-sm text-primary">{rule.enableNormalization ? t('common.yes') : t('common.no')}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}