import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subjectService } from '../../services/subjectService';

import type { SubjectDTO } from '../../types/SubjectDTO';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';

export const CreateSubjectPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setDynamicBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setDynamicBreadcrumb('Utwórz Przedmiot');
        return () => setDynamicBreadcrumb(null);
    }, [setDynamicBreadcrumb]);

    const [name, setName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [edition, setEdition] = useState('');
    const [description, setDescription] = useState('');
    const [giteaUrl, setGiteaUrl] = useState('');

    const [usePreset, setUsePreset] = useState<boolean>(false);

    const [templateId, setTemplateId] = useState<string>('');
    const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);

    const [tickets, setTickets] = useState(10);
    const [minTokens, setMinTokens] = useState(0);
    const [normalization, setNormalization] = useState(false);

    const [visibility, setVisibility] = useState('FULL');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // TODO: podpiac ruleService
        // ruleService.getAllTemplates().then(setAvailableTemplates).catch(console.error);

        setAvailableTemplates([
            { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Rygorystyczne (5 Tokenów, z Normalizacją)' },
            { id: '123e4567-e89b-12d3-a456-426614174002', name: 'Luźne (20 Tokenów, bez Normalizacji)' }
        ]);
    }, []);

    const handleSubmit = async () => {
        if (!name.trim() || !organizationName.trim() || !edition.trim() || !giteaUrl.trim()) {
            setError(t('subjectCreate.errorEmpty', 'Wypełnij wszystkie wymagane pola (Nazwa, Organizacja, Edycja, URL).'));
            return;
        }

        if (usePreset && !templateId) {
            setError('Wybierz szablon reguł z listy lub przełącz na konfigurację ręczną.');
            return;
        }

        setIsSubmitting(true);
        setError(null);


        const dto: SubjectDTO = {
            name,
            organizationName,
            edition,
            subjectDescription: description,
            giteaURL: giteaUrl,
            templateId: usePreset ? templateId : null,
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
            navigate('/subjects');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Wystąpił błąd podczas tworzenia przedmiotu.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 animate-fade-in flex flex-col h-full">
            <div className="mb-8">
                <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brand transition-colors mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Wróć
                </button>
                <h1 className="text-3xl font-bold text-primary">Utwórz Nowy Przedmiot</h1>
                <p className="text-secondary mt-2">Wprowadź podstawowe informacje oraz skonfiguruj ustawienia analizy.</p>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm border border-border flex flex-col flex-1">
                <div className="p-6 md:p-8 flex flex-col gap-10">
                    {error && <div className="p-4 bg-danger-subtle text-danger border border-danger-border rounded-lg text-sm">{error}</div>}

                    <section>
                        <h3 className="text-xs font-bold text-secondary tracking-widest mb-5 uppercase">Informacje Ogólne</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-primary mb-2">Nazwa Przedmiotu *</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" placeholder="np. Programowanie Obiektowe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Nazwa Organizacji Gitea *</label>
                                <input type="text" value={organizationName} onChange={e => setOrganizationName(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" placeholder="np. 2026-po-zaoczne" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Edycja (Rok/Semestr) *</label>
                                <input type="text" value={edition} onChange={e => setEdition(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" placeholder="np. 2026L" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-primary mb-2">Opis Przedmiotu</label>
                                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors resize-none" placeholder="Opcjonalny opis zawartości..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-primary mb-2">Adres URL Gitea *</label>
                                <input type="url" value={giteaUrl} onChange={e => setGiteaUrl(e.target.value)} className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" placeholder="https://gitea.com/..." />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xs font-bold text-secondary tracking-widest uppercase">Reguły Oceniania i Analizy</h3>
                        </div>

                        <div className="bg-base p-6 rounded-xl border border-border mb-6">
                            <label className="block text-sm font-semibold text-primary mb-3">Poziom Widoczności Raportu dla Studenta</label>
                            <div className="flex flex-col gap-3">
                                {[
                                    { key: 'FULL', label: 'Pełny Raport - student widzi szczegółowe dopasowania kodu' },
                                    { key: 'SCORE', label: 'Tylko Wynik - student widzi tylko procenty' },
                                    { key: 'HIDDEN', label: 'Ukryty - student nie widzi żadnych wyników analizy' }
                                ].map(level => (
                                    <label key={level.key} className="flex items-center gap-3 cursor-pointer w-fit">
                                        <input type="radio" name="visibility" value={level.key} checked={visibility === level.key} onChange={e => setVisibility(e.target.value)} className="w-4 h-4 accent-brand" />
                                        <span className="text-sm text-primary">{level.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <label className="block text-sm font-semibold text-primary mb-3">Zaawansowane parametry skanera (JPlag)</label>
                        <div className="flex p-1 bg-base border border-border rounded-lg mb-6 w-fit">
                            <button
                                type="button"
                                onClick={() => setUsePreset(false)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${!usePreset ? 'bg-surface text-brand shadow-sm' : 'text-secondary hover:text-primary'}`}
                            >
                                Konfiguracja Ręczna
                            </button>
                            <button
                                type="button"
                                onClick={() => setUsePreset(true)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${usePreset ? 'bg-surface text-brand shadow-sm' : 'text-secondary hover:text-primary'}`}
                            >
                                Użyj Szablonu JPlag
                            </button>
                        </div>

                        {usePreset ? (
                            <div className="bg-base p-6 rounded-xl border border-border animate-fade-in">
                                <label className="block text-sm font-semibold text-primary mb-2">Wybierz zapisany szablon parametrów</label>
                                <select
                                    value={templateId}
                                    onChange={(e) => setTemplateId(e.target.value)}
                                    className="w-full bg-surface border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors"
                                >
                                    <option value="" disabled>-- Wybierz szablon z listy --</option>
                                    {availableTemplates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name || t.id}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-secondary mt-3">
                                    Wybranie szablonu spowoduje automatyczne zaaplikowanie zapisanej w nim liczby tokenów oraz ustawień normalizacji.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 animate-fade-in p-6 bg-base rounded-xl border border-border">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2">Początkowe Tokeny (długość analizowanych bloków)</label>
                                        <input type="number" min="0" value={tickets} onChange={e => setTickets(Number(e.target.value))} className="w-full bg-surface border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary mb-2">Minimalna zgodność tokenów (%)</label>
                                        <input type="number" min="0" value={minTokens} onChange={e => setMinTokens(Number(e.target.value))} className="w-full bg-surface border border-border text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer w-fit">
                                    <input type="checkbox" checked={normalization} onChange={e => setNormalization(e.target.checked)} className="w-5 h-5 accent-brand rounded border-border" />
                                    <span className="text-sm font-semibold text-primary">Włącz normalizację kodu przed skanowaniem</span>
                                </label>
                            </div>
                        )}
                    </section>

                    {/* HARMONOGRAM (ZAŚLEPKA) */}
                    <section>
                        <h3 className="text-xs font-bold text-secondary tracking-widest mb-5 uppercase">Harmonogram Skonowania</h3>
                        <div className="p-8 bg-base border border-border border-dashed rounded-xl flex flex-col items-center justify-center text-center gap-3">
                            <svg className="w-8 h-8 text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="text-primary font-semibold">Zarządzanie Harmonogramem</p>
                            <p className="text-secondary text-sm max-w-sm">
                                Opcje dodawania i konfiguracji automatycznych skanów w harmonogramie zostaną udostępnione w nadchodzących aktualizacjach systemu.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="flex justify-end gap-4 p-6 md:p-8 border-t border-border bg-base/50 rounded-b-2xl mt-auto">
                    <button type="button" onClick={() => navigate(-1)} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-sm font-bold text-secondary border border-border hover:bg-surface transition-colors">
                        Anuluj
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2.5 rounded-lg text-sm font-bold text-white bg-brand hover:bg-brand-hover shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Tworzenie...' : 'Utwórz Przedmiot'}
                    </button>
                </div>
            </div>
        </div>
    );
};