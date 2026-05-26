import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { createSubjectSchema, type CreateSubjectFormData } from '../../shared/validators/createSubjectSchema';
import { subjectService } from '../../services/subjectService.ts';
import SubmitButton from '../../shared/components/buttons/SubmitButton';
import { PATHS } from '../../routes/paths';

const CreateSubjectPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateSubjectFormData>({
        resolver: yupResolver(createSubjectSchema),
        mode: 'onTouched',
    });

    const onSubmit: SubmitHandler<CreateSubjectFormData> = async (data) => {
        setServerError(null);
        try {
            await subjectService.createSubject({
                name: data.name,
                organizationName: data.organizationName,
                edition: data.edition,
                giteaURL: data.giteaURL,
                subjectDescription: data.subjectDescription
            });
            navigate(PATHS.TEACHER_SUBJECT_LIST);
        } catch (error: any) {
            console.error("Błąd podczas tworzenia przedmiotu", error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    setServerError(t('error.validation.failed', 'Błąd walidacji - sprawdź wprowadzone dane.'));
                } else if (error.response?.status === 403) {
                    setServerError(t('error.unauthorized', 'Brak uprawnień.'));
                } else if (error.response?.status === 409) {
                    setServerError(t('error.subject.exists', 'Naruszenie unikalności danych. Taki wpis już istnieje w bazie.'));
                } else {
                    setServerError(t('error.server.internal', 'Błąd serwera.'));
                }
            } else {
                setServerError(t('error.server.internal', 'Nieoczekiwany błąd.'));
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 w-full animate-in fade-in duration-500">
            <div className="w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-sm p-8">
                <h1 className="text-3xl font-extrabold text-primary mb-2">
                    {t('subject.create.title', 'Utwórz nowy przedmiot')}
                </h1>
                <p className="text-sm text-secondary mb-8">
                    {t('subject.create.subtitle', 'Wprowadź dane przedmiotu, aby dodać go do bazy.')}
                </p>

                {serverError && (
                    <div className="mb-6 p-4 bg-danger-subtle text-danger border border-danger-border rounded-md text-sm font-semibold">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NAZWA PRZEDMIOTU */}
                        <div>
                            <label htmlFor="name" className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                                {t('subject.name', 'Nazwa przedmiotu')}
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                className={`w-full bg-base border rounded-md p-3 text-sm font-medium text-primary outline-none transition-colors ${
                                    errors.name ? 'border-danger focus:border-danger' : 'border-border focus:border-brand'
                                }`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-[10px] text-danger font-semibold">{t(errors.name.message as string)}</p>
                            )}
                        </div>

                        {/* NAZWA ORGANIZACJI */}
                        <div>
                            <label htmlFor="organizationName" className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                                {t('subject.organizationName', 'Nazwa organizacji (Gitea)')}
                            </label>
                            <input
                                id="organizationName"
                                type="text"
                                {...register('organizationName')}
                                className={`w-full bg-base border rounded-md p-3 text-sm font-medium text-primary outline-none transition-colors ${
                                    errors.organizationName ? 'border-danger focus:border-danger' : 'border-border focus:border-brand'
                                }`}
                            />
                            {errors.organizationName && (
                                <p className="mt-1 text-[10px] text-danger font-semibold">{t(errors.organizationName.message as string)}</p>
                            )}
                        </div>

                        {/* EDYCJA (ROK) */}
                        <div>
                            <label htmlFor="edition" className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                                {t('subject.edition', 'Edycja (np. 2026)')}
                            </label>
                            <input
                                id="edition"
                                type="text"
                                {...register('edition')}
                                className={`w-full bg-base border rounded-md p-3 text-sm font-medium text-primary outline-none transition-colors ${
                                    errors.edition ? 'border-danger focus:border-danger' : 'border-border focus:border-brand'
                                }`}
                            />
                            {errors.edition && (
                                <p className="mt-1 text-[10px] text-danger font-semibold">{t(errors.edition.message as string)}</p>
                            )}
                        </div>

                        {/* GITEA URL */}
                        <div>
                            <label htmlFor="giteaURL" className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                                {t('subject.giteaURL', 'URL repozytorium Gitea')}
                            </label>
                            <input
                                id="giteaURL"
                                type="text"
                                placeholder="https://gitea.it.p.lodz.pl/..."
                                {...register('giteaURL')}
                                className={`w-full bg-base border rounded-md p-3 text-sm font-medium text-primary outline-none transition-colors ${
                                    errors.giteaURL ? 'border-danger focus:border-danger' : 'border-border focus:border-brand'
                                }`}
                            />
                            {errors.giteaURL && (
                                <p className="mt-1 text-[10px] text-danger font-semibold">{t(errors.giteaURL.message as string)}</p>
                            )}
                        </div>
                    </div>

                    {/* OPIS */}
                    <div>
                        <label htmlFor="subjectDescription" className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                            {t('subject.description', 'Opis przedmiotu (opcjonalny)')}
                        </label>
                        <textarea
                            id="subjectDescription"
                            rows={4}
                            {...register('subjectDescription')}
                            className={`w-full bg-base border rounded-md p-3 text-sm font-medium text-primary outline-none transition-colors resize-y ${
                                errors.subjectDescription ? 'border-danger focus:border-danger' : 'border-border focus:border-brand'
                            }`}
                        />
                        {errors.subjectDescription && (
                            <p className="mt-1 text-[10px] text-danger font-semibold">{t(errors.subjectDescription.message as string)}</p>
                        )}
                    </div>

                    <hr className="border-border my-6" />

                    <div className="flex items-center justify-end gap-4 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate(PATHS.TEACHER_SUBJECT_LIST)}
                            className="px-6 py-3 text-xs font-bold text-secondary tracking-widest uppercase hover:text-primary transition-colors disabled:opacity-50"
                        >
                            {t('common.cancel', 'Anuluj')}
                        </button>
                        <SubmitButton
                            type="submit"
                            isLoading={isSubmitting}
                            className="w-auto mt-0 px-8 py-3 text-xs tracking-widest uppercase"
                        >
                            {t('subject.create.submitButton', 'Utwórz przedmiot')}
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSubjectPage;