import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subjectService } from '../../services/subjectService';
import { ruleService } from '../../services/ruleService';
import type { SubjectDTO, TeacherAssignmentDTO } from '../../types/SubjectDTO';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';
import { TeacherAssignmentManager } from '../subject/TeacherAssignmentManager';
import { PATHS } from '../../routes/paths';

export const CreateSubjectPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setDynamicBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setDynamicBreadcrumb('subjectCreate.breadcrumb');
        return () => setDynamicBreadcrumb(null);
    }, [setDynamicBreadcrumb]);

    const [name, setName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [edition, setEdition] = useState('');
    const [description, setDescription] = useState('');

    const [usePreset, setUsePreset] = useState<boolean>(false);
    const [templateId, setTemplateId] = useState<string>('');
    const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);

    const [tickets, setTickets] = useState(10);
    const [minTokens, setMinTokens] = useState(0);
    const [normalization, setNormalization] = useState(false);

    const [visibility, setVisibility] = useState('ONLY_PERCENTAGES');

    const [teachers, setTeachers] = useState<TeacherAssignmentDTO[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        ruleService.getRulePresetsTemplates()
            .then((response: any) => {
                const templates = response.content ? response.content : response;
                const actualPresets = templates.filter((t: any) => t.isPreset === true);
                setAvailableTemplates(actualPresets.length > 0 ? actualPresets : templates);
            })
            .catch(() => {
                setAvailableTemplates([]);
            });
    }, []);

    const handlePreSubmit = () => {
        if (!name.trim() || !organizationName.trim() || !edition.trim()) {
            setError(t('subjectCreate.errorEmpty', 'Wypełnij wszystkie wymagane pola (Nazwa, Organizacja, Edycja).'));
            return;
        }

        if (usePreset && !templateId) {
            setError(t('subjectCreate.errorTemplate', 'Wybierz szablon reguł z listy.'));
            return;
        }

        setError(null);
        setShowConfirmModal(true);
    };

    const executeSubmit = async () => {
        setShowConfirmModal(false);
        setIsSubmitting(true);

        const dto: SubjectDTO = {
            name,
            organizationName,
            edition,
            subjectDescription: description,
            templateId: usePreset ? templateId : null,
            teachers: teachers,
            manualRules: {
                id: null as any,
                raportLevelName: visibility,
                studentTicketCount: usePreset ? 0 : tickets,
                minimumTokensMatch: usePreset ? 0 : minTokens,
                enableNormalization: usePreset ? false : normalization
            }
        };

        try {
            await subjectService.createSubject(dto);
            navigate(PATHS.TEACHER_SUBJECT_LIST);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Wystąpił błąd podczas tworzenia przedmiotu.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 animate-fade-in flex flex-col h-full">
            <div className="mb-8">
                <button type="button" onClick={() => navigate(PATHS.TEACHER_SUBJECT_LIST)} className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('common.cancel', 'Wróć')}
                </button>
                <h1 className="text-3xl font-bold text-primary">{t('subjectCreate.title', 'Utwórz Nowy Przedmiot')}</h1>
                <p className="text-secondary mt-2">{t('subjectCreate.subtitle', 'Wprowadź podstawowe informacje oraz skonfiguruj ustawienia analizy.')}</p>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm border border-border flex flex-col flex-1">
                <div className="p-6 md:p-8 flex flex-col gap-10">
                    {error && <div className="p-4 bg-danger-subtle text-danger border border-danger-border rounded-lg text-sm">{error}</div>}

                    <section>
                        <h3 className="text-xs font-bold text-secondary tracking-widest mb-5 uppercase">{t('subjectCreate.generalInfo', 'Informacje Ogólne')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-primary mb-2">{t('subjectCreate.nameLabel', 'Nazwa Przedmiotu *')}</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">{t('subjectCreate.orgLabel', 'Nazwa Organizacji Gitea *')}</label>
                                <input type="text" value={organizationName} onChange={e => setOrganizationName(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">{t('subjectCreate.editionLabel', 'Edycja (Rok/Semestr) *')}</label>
                                <input type="text" value={edition} onChange={e => setEdition(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-primary mb-2">{t('subjectCreate.descLabel', 'Opis Przedmiotu')}</label>
                                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors resize-none" />
                            </div>
                        </div>
                    </section>

                    <section className="bg-base p-6 rounded-xl border border-border">
                        <TeacherAssignmentManager teachers={teachers} setTeachers={setTeachers} />
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xs font-bold text-secondary tracking-widest uppercase">{t('subjectCreate.rulesSection', 'Reguły Oceniania i Analizy')}</h3>
                        </div>

                        <div className="bg-base p-6 rounded-xl border border-border mb-6">
                            <label className="block text-sm font-semibold text-primary mb-3">{t('subjectCreate.visibilityLabel', 'Poziom Widoczności Raportu')}</label>
                            <div className="flex flex-col gap-3">
                                {[
                                    { key: 'ONLY_PERCENTAGES', label: t('subjectCreate.visibilityScore', 'Tylko Wyniki Procentowe - student widzi jedynie procentowe dopasowanie') },
                                    { key: 'ONLY_HIGHEST_PERCENT', label: t('subjectCreate.visibilityHighest', 'Tylko Najwyższy Procent - student widzi tylko najwyższy wynik z całego raportu') },
                                    { key: 'NOTHING', label: t('subjectCreate.visibilityHidden', 'Ukryty - student nie widzi żadnych wyników analizy') }
                                ].map(level => (
                                    <label key={level.key} className="flex items-center gap-3 cursor-pointer w-fit">
                                        <input type="radio" name="visibility" value={level.key} checked={visibility === level.key} onChange={e => setVisibility(e.target.value)} className="w-4 h-4 accent-brand" />
                                        <span className="text-sm text-primary">{level.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <label className="block text-sm font-semibold text-primary mb-3">{t('subjectCreate.jplagSettings', 'Zaawansowane parametry skanera (JPlag)')}</label>
                        <div className="flex p-1 bg-base border border-border rounded-lg mb-6 w-fit">
                            <button type="button" onClick={() => setUsePreset(false)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${!usePreset ? 'bg-surface text-brand shadow-sm' : 'text-secondary hover:text-primary'}`}>
                                {t('subjectCreate.modeManual', 'Konfiguracja Ręczna')}
                            </button>
                            <button type="button" onClick={() => setUsePreset(true)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${usePreset ? 'bg-surface text-brand shadow-sm' : 'text-secondary hover:text-primary'}`}>
                                {t('subjectCreate.modeTemplate', 'Użyj Szablonu JPlag')}
                            </button>
                        </div>

                        {usePreset ? (
                            <div className="bg-base p-6 rounded-xl border border-border animate-fade-in">
                                {availableTemplates.length === 0 ? (
                                    <div className="text-center p-4">
                                        <p className="text-secondary text-sm font-medium">Brak zapisanych szablonów w bazie. Skonfiguruj reguły ręcznie.</p>
                                    </div>
                                ) : (
                                    <>
                                        <label className="block text-sm font-semibold text-primary mb-2">{t('subjectCreate.templateSelect', 'Wybierz zapisany szablon parametrów')}</label>
                                        <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full bg-surface border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors">
                                            <option value="" disabled>{t('subjectCreate.templateDefault', '-- Wybierz szablon z listy --')}</option>
                                            {availableTemplates.map(t => (
                                                <option key={t.id} value={t.id}>
                                                    Szablon: {t.studentTicketCount} tokenów (Dopasowanie: {t.minimumTokensMatch}%)
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-secondary mt-3">{t('subjectCreate.templateHelp', 'Wybranie szablonu spowoduje automatyczne zaaplikowanie zapisanej w nim liczby tokenów oraz ustawień normalizacji.')}</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 animate-fade-in p-6 bg-base rounded-xl border border-border">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2 min-h-[40px] flex items-end">{t('subjectCreate.tokensLabel', 'Początkowe Tokeny')}</label>
                                        <input type="number" min="0" value={tickets} onChange={e => setTickets(Number(e.target.value))} className="w-full bg-surface border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2 min-h-[40px] flex items-end">{t('subjectCreate.minTokensLabel', 'Minimalna zgodność tokenów (%)')}</label>
                                        <input type="number" min="0" value={minTokens} onChange={e => setMinTokens(Number(e.target.value))} className="w-full bg-surface border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer w-fit">
                                    <input type="checkbox" checked={normalization} onChange={e => setNormalization(e.target.checked)} className="w-5 h-5 accent-brand rounded border-border" />
                                    <span className="text-sm font-semibold text-primary">{t('subjectCreate.normalizationLabel', 'Włącz normalizację kodu przed skanowaniem')}</span>
                                </label>
                            </div>
                        )}
                    </section>
                </div>

                <div className="flex justify-end gap-4 p-6 md:p-8 border-t border-border bg-base/50 rounded-b-2xl mt-auto">
                    <button type="button" onClick={() => navigate(PATHS.TEACHER_SUBJECT_LIST)} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-sm font-bold text-secondary border border-border hover:bg-surface transition-colors">
                        {t('common.cancel', 'Anuluj')}
                    </button>
                    <button type="button" onClick={handlePreSubmit} disabled={isSubmitting} className="px-8 py-2.5 rounded-lg text-sm font-bold text-white bg-brand hover:bg-brand-hover shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ? t('subjectCreate.submitCreating', 'Tworzenie...') : t('subjectCreate.submitButton', 'Utwórz Przedmiot')}
                    </button>
                </div>
            </div>
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-primary">
                                {t('subjectCreate.confirmTitle', 'Potwierdź utworzenie przedmiotu')}
                            </h3>
                            <p className="text-sm text-secondary mt-2">
                                {t('subjectCreate.confirmMessage', 'Czy na pewno chcesz utworzyć ten przedmiot? Akcja spowoduje nieodwracalne zapisanie nowych struktur biznesowych w relacyjnej bazie danych.')}
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-secondary border border-border hover:bg-base transition-colors"
                            >
                                {t('common.cancel', 'Anuluj')}
                            </button>
                            <button
                                type="button"
                                onClick={executeSubmit}
                                className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-brand hover:bg-brand-hover shadow-md transition-colors"
                            >
                                {t('common.confirmAction', 'Potwierdzam')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};