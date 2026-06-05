import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SubjectDTO, UpdateSubjectDTO, TeacherAssignmentDTO } from '../../types/SubjectDTO';
import { updateSubject, subjectService } from '../../services/subjectService';
import { TeacherAssignmentManager } from './TeacherAssignmentManager';

interface EditSubjectModalProps {
    subject: SubjectDTO;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditSubjectModal: React.FC<EditSubjectModalProps> = ({ subject, onClose, onSuccess }) => {
    const { t } = useTranslation();

    const [name, setName] = useState(subject.name || '');
    const [description, setDescription] = useState(subject.subjectDescription || '');
    const [giteaUrl, setGiteaUrl] = useState(subject.giteaURL || '');

    const [tickets, setTickets] = useState(subject.manualRules?.studentTicketCount || 10);
    const [minTokens, setMinTokens] = useState(subject.manualRules?.minimumTokensMatch || 0);
    const [normalization, setNormalization] = useState(subject.manualRules?.enableNormalization || false);
    const [visibility, setVisibility] = useState(subject.manualRules?.raportLevelName || 'FULL');

    const [teachers, setTeachers] = useState<TeacherAssignmentDTO[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (subject.id) {
            subjectService.getSubjectUsers(subject.id)
                .then((data) => {
                    setTeachers(data);
                })
                .catch((err) => {
                    console.error("Błąd pobierania kadry: ", err);
                });
        }
    }, [subject.id]);

    const handleSubmit = async () => {
        if (!name.trim() || !giteaUrl.trim()) {
            setError(t('subjectEdit.errorEmpty', 'Nazwa i URL nie mogą być puste.'));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const dto: UpdateSubjectDTO = {
            name,
            subjectDescription: description,
            teachers,
            rules: {
                raportLevelName: visibility,
                studentTicketCount: tickets,
                minimumTokensMatch: minTokens,
                enableNormalization: normalization
            }
        };

        try {
            await updateSubject(subject.id!, dto, subject.versionHash!);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Wystąpił błąd podczas zapisu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-surface w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-border">

                <div className="flex justify-between items-center p-6 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">{t('subjectEdit.title', 'Edytuj Przedmiot')}</h2>
                        <p className="text-sm text-secondary mt-1">{t('subjectEdit.subtitle', 'Zaktualizuj metadane przedmiotu i parametry analizy.')}</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-secondary hover:text-danger p-2 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex flex-col gap-8">
                    {error && <div className="p-4 bg-danger-subtle text-danger border border-danger-border rounded-lg text-sm">{error}</div>}

                    <section>
                        <h3 className="text-xs font-bold text-secondary tracking-widest mb-4 uppercase">{t('subjectEdit.generalInfo', 'INFORMACJE OGÓLNE')}</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">{t('subjectEdit.nameLabel', 'Nazwa Przedmiotu')}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2 focus:outline-none focus:border-brand transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">{t('subjectEdit.descLabel', 'Opis')}</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2 focus:outline-none focus:border-brand transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-base p-6 rounded-xl border border-border">
                        <TeacherAssignmentManager teachers={teachers} setTeachers={setTeachers} />
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-secondary tracking-widest mb-4 uppercase">{t('subjectEdit.giteaAnalysis', 'GITEA I ANALIZA')}</h3>
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">{t('subjectEdit.giteaUrl', 'Adres URL Organizacji Gitea')}</label>
                                <input
                                    type="url"
                                    value={giteaUrl}
                                    onChange={e => setGiteaUrl(e.target.value)}
                                    className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2 focus:outline-none focus:border-brand transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">{t('subjectEdit.tokens', 'Tokeny dla Studentów')}</label>
                                    <input
                                        type="number" min="0"
                                        value={tickets}
                                        onChange={e => setTickets(Number(e.target.value))}
                                        className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2 focus:outline-none focus:border-brand"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">{t('subjectEdit.minTokens', 'Minimalna zgodność tokenów')}</label>
                                    <input
                                        type="number" min="0"
                                        value={minTokens}
                                        onChange={e => setMinTokens(Number(e.target.value))}
                                        className="w-full bg-base border border-border text-primary rounded-lg px-4 py-2 focus:outline-none focus:border-brand"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={normalization}
                                    onChange={e => setNormalization(e.target.checked)}
                                    className="w-5 h-5 accent-brand rounded border-border"
                                />
                                <span className="text-sm font-semibold text-primary">{t('subjectEdit.normalization', 'Włącz normalizację (Normalization)')}</span>
                            </label>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-3">{t('subjectEdit.visibility', 'Poziom Widoczności Raportu')}</label>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { key: 'FULL', label: 'Pełny Raport' },
                                        { key: 'SCORE', label: 'Tylko Wynik' },
                                        { key: 'HIDDEN', label: 'Ukryty' }
                                    ].map(level => (
                                        <label key={level.key} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value={level.key}
                                                checked={visibility === level.key}
                                                onChange={e => setVisibility(e.target.value)}
                                                className="w-4 h-4 accent-brand"
                                            />
                                            <span className="text-sm text-primary">{level.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="flex justify-end gap-4 p-6 border-t border-border bg-base rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-secondary border border-border hover:bg-surface transition-colors"
                    >
                        {t('subjectEdit.cancel', 'Anuluj')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-brand hover:bg-brand-hover shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t('subjectEdit.loading', 'Zapisywanie...') : t('subjectEdit.apply', 'Zastosuj Zmiany')}
                    </button>
                </div>
            </div>
        </div>
    );
}