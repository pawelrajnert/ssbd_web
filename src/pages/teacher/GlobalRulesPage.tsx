import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ruleService } from "../../services/ruleService";
import type { CreateRulePresetDTO, RulePresetDTO } from "../../types/rule.types";
import { RefreshCw, AlertCircle, Plus, X } from "lucide-react";

export default function GlobalRulesPage() {
    const { t } = useTranslation();
    const [rules, setRules] = useState<RulePresetDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [creationError, setCreationError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<CreateRulePresetDTO>({
        raportLevelName: 'NOTHING',
        studentTicketCount: 0,
        minimumTokensMatch: 1,
        enableNormalization: false
    });

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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreationError(null);

        if (formData.minimumTokensMatch < 1) {
            setCreationError(t('globalRules.error.invalidTokens'));
            return;
        }

        try {
            await ruleService.createRulePreset(formData);
            setShowModal(false);
            fetchRules();
            setFormData({
                raportLevelName: 'NOTHING',
                studentTicketCount: 0,
                minimumTokensMatch: 1,
                enableNormalization: false
            });
        } catch {
            setCreationError(t('globalRules.error.createFailed'));
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
                    <div className="flex gap-4">
                        <button
                            onClick={fetchRules}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-active rounded-md text-sm font-bold text-primary transition-colors"
                        >
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            {t('common.refresh')}
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-md text-sm font-bold text-white transition-colors"
                        >
                            <Plus size={16} />
                            {t('globalRules.add.title')}
                        </button>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <form onSubmit={handleCreate} className="bg-surface p-6 rounded-xl w-full max-w-md border border-border shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-primary">{t('globalRules.add.title')}</h2>
                                <button type="button" onClick={() => { setShowModal(false); setCreationError(null); }} className="text-secondary hover:text-primary">
                                    <X size={20}/>
                                </button>
                            </div>

                            {creationError && (
                                <div className="mb-4 p-3 bg-danger-subtle border border-danger text-danger rounded-md text-sm flex items-center gap-2 font-semibold">
                                    <AlertCircle size={16} />
                                    {creationError}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">
                                        {t('globalRules.form.raportLevelLabel')}
                                    </label>
                                    <select
                                        className="w-full p-2 border border-border rounded bg-surface text-primary"
                                        value={formData.raportLevelName}
                                        onChange={e => setFormData({...formData, raportLevelName: e.target.value})}
                                        required
                                    >
                                        <option value="NOTHING">{t('globalRules.levels.NOTHING')}</option>
                                        <option value="ONLY_PERCENTAGES">{t('globalRules.levels.ONLY_PERCENTAGES')}</option>
                                        <option value="FULL_VIEW">{t('globalRules.levels.FULL_VIEW')}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">
                                        {t('globalRules.form.studentTicketsLabel')}
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-border rounded bg-surface text-primary"
                                        value={formData.studentTicketCount}
                                        onChange={e => setFormData({...formData, studentTicketCount: Number(e.target.value)})}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">
                                        {t('globalRules.form.minTokensLabel')}
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full p-2 border border-border rounded bg-surface text-primary"
                                        value={formData.minimumTokensMatch}
                                        onChange={e => setFormData({...formData, minimumTokensMatch: Number(e.target.value)})}
                                        required
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-primary cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-border"
                                        checked={formData.enableNormalization}
                                        onChange={e => setFormData({...formData, enableNormalization: e.target.checked})}
                                    />
                                    <span className="text-sm font-medium">{t('globalRules.form.normalizationLabel')}</span>
                                </label>
                            </div>

                            <button type="submit" className="w-full mt-6 bg-primary text-white py-2 rounded font-bold hover:bg-primary-dark transition-colors">
                                {t('globalRules.add.submit')}
                            </button>
                        </form>
                    </div>
                )}

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
                                        {t(`globalRules.levels.${rule.raportLevelName.toUpperCase().replace(/\s+/g, '_')}`, rule.raportLevelName.replace(/_/g, ' '))}
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