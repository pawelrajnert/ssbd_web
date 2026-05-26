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
        } catch (err) {
            setError(t('globalRules.error', 'Nie udało się pobrać globalnych reguł'));
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
                        {t('sidebar.globalRules', 'Globalne reguły')}
                    </h1>
                    <button
                        onClick={fetchRules}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-active disabled:opacity-50 rounded-md text-sm font-bold text-primary transition-colors"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        {t('common.refresh', 'Odśwież')}
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
                            <th className="py-5 px-8 text-xs font-bold text-secondary uppercase">{t('globalRules.table.raportLevel', 'Poziom raportu')}</th>
                            <th className="py-5 px-8 text-xs font-bold text-secondary uppercase">{t('globalRules.table.studentTickets', 'Ilość zgłoszeń na studenta')}</th>
                            <th className="py-5 px-8 text-xs font-bold text-secondary uppercase">{t('globalRules.table.minTokens', 'Min. dopasowanie tokenów')}</th>
                            <th className="py-5 px-8 text-xs font-bold text-secondary uppercase">{t('globalRules.table.normalization', 'Normalizacja')}</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {isLoading && rules.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-secondary">{t('common.loading', 'Ładowanie...')}</td>
                            </tr>
                        ) : rules.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-secondary">{t('globalRules.noResults', 'Brak globalnych reguł')}</td>
                            </tr>
                        ) : (
                            rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-base/40 transition-colors">
                                    <td className="py-4 px-8 text-sm text-primary font-semibold">{rule.raportLevelName}</td>
                                    <td className="py-4 px-8 text-sm text-primary">{rule.studentTicketCount}</td>
                                    <td className="py-4 px-8 text-sm text-primary">{rule.minimumTokensMatch}</td>
                                    <td className="py-4 px-8 text-sm text-primary">{rule.enableNormalization ? "Tak" : "Nie"}</td>
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