import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { createSubjectSchema } from "../../shared/validators/createSubjectSchema";
import { subjectService } from "../../services/subjectService";
import { ruleService } from "../../services/ruleService";

import type { CreateSubjectFormData } from "../../shared/validators/createSubjectSchema";
import type { RulePresetDTO } from "../../types/rule.types";

interface FormValues extends Omit<CreateSubjectFormData, "manualRules"> {
    manualRules?: {
        studentTicketCount: number;
        minimumTokensMatch: number;
        enableNormalization: boolean;
    } | null;
}

export const CreateSubjectPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [templates, setTemplates] = useState<RulePresetDTO[]>([]);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fetchingTemplates, setFetchingTemplates] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        resolver: yupResolver(createSubjectSchema) as any,
        defaultValues: {
            name: "",
            organizationName: "",
            edition: "",
            subjectDescription: null,
            giteaURL: "",
            templateId: null,
            manualRules: null
        }
    });

    const selectedTemplateId = watch("templateId");

    useEffect(() => {
        ruleService.getRulePresetsTemplates()
            .then((data: RulePresetDTO[]) => {
                setTemplates(data);
            })
            .catch((err: unknown) => {
                console.error("Nie udało się pobrać szablonów reguł:", err);
            })
            .finally(() => {
                setFetchingTemplates(false);
            });
    }, []);

    useEffect(() => {
        if (selectedTemplateId) {
            setValue("manualRules", null);
            clearErrors("manualRules");
        }
    }, [selectedTemplateId, setValue, clearErrors]);

    const preventInvalidNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["-", "+", "e", "E", ".", ","].includes(e.key)) {
            e.preventDefault();
        }
    };

    const onSubmit = async (data: FormValues) => {
        try {
            setGlobalError(null);

            const payload = { ...data };

            // Jeśli wybrano szablon, usuwamy ręczne reguły, aby backend nie walidował pustych pól
            if (payload.templateId) {
                delete payload.manualRules;
            }

            await subjectService.createSubject(payload as any);
            navigate("/teacher/subjects");
        } catch (err: any) {
            setGlobalError(err?.response?.data?.message || "error.generic");
        }
    };

    const inputClasses = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600";

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {t("globalRules.subject.create.title")}
            </h2>

            {globalError && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded border border-red-200 dark:border-red-800">
                    {t(globalError)}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("globalRules.subject.name")}</label>
                    <input type="text" {...register("name")} className={inputClasses} />
                    {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(errors.name.message || "")}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("globalRules.subject.organizationName")}</label>
                    <input type="text" {...register("organizationName")} className={inputClasses} />
                    {errors.organizationName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(errors.organizationName.message || "")}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("globalRules.subject.edition")}</label>
                        <input type="text" {...register("edition")} className={inputClasses} />
                        {errors.edition && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(errors.edition.message || "")}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("globalRules.subject.giteaURL")}</label>
                        <input type="text" {...register("giteaURL")} className={inputClasses} />
                        {errors.giteaURL && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(errors.giteaURL.message || "")}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("globalRules.subject.subjectDescription")}</label>
                    <textarea {...register("subjectDescription")} rows={3} className={inputClasses} />
                    {errors.subjectDescription && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(errors.subjectDescription.message || "")}</p>}
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("globalRules.subject.templateId")}
                    </label>
                    <select {...register("templateId")} className={inputClasses} disabled={fetchingTemplates}>
                        <option value="">{t("globalRules.subject.template.none")}</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.raportLevelName} (Zgłoszenia: {template.studentTicketCount})
                            </option>
                        ))}
                    </select>
                    {errors.templateId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(errors.templateId.message || "")}</p>}
                </div>

                {!selectedTemplateId ? (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {t("globalRules.subject.manualRules.title")}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("globalRules.subject.rules.studentTicketCount")}
                                </label>
                                <input type="number" min="1" onKeyDown={preventInvalidNumberInput} {...register("manualRules.studentTicketCount")} className={inputClasses} />
                                {errors.manualRules?.studentTicketCount && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(errors.manualRules.studentTicketCount.message || "")}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("globalRules.subject.rules.minimumTokensMatch")}
                                </label>
                                <input type="number" min="1" onKeyDown={preventInvalidNumberInput} {...register("manualRules.minimumTokensMatch")} className={inputClasses} />
                                {errors.manualRules?.minimumTokensMatch && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t(errors.manualRules.minimumTokensMatch.message || "")}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input id="enableNormalization" type="checkbox" {...register("manualRules.enableNormalization")} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="enableNormalization" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                {t("globalRules.subject.rules.enableNormalization")}
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
                        {t("globalRules.subject.info.templateActive")}
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => navigate("/teacher/subjects")} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                        {t("common.cancel")}
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {isSubmitting ? t("common.saving") : t("common.create")}
                    </button>
                </div>
            </form>
        </div>
    );
};