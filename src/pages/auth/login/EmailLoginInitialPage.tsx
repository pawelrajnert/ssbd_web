import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslation } from "react-i18next";

import { PATHS } from "../../../routes/paths.ts";
import { authService } from "../../../services/authService.ts";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";
import LinkButton from "../../../shared/components/buttons/LinkButton.tsx";
import { emailSchema, type EmailFormData } from "../../../shared/validators/emailSchema.ts";

export default function LoginEmailInitialPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<EmailFormData>({
        resolver: yupResolver(emailSchema)
    });

    const onSubmit = async (data: EmailFormData) => {
        setIsLoading(true);
        setApiError("");
        try {
            await authService.loginWithEmail(data.email);
            navigate(PATHS.LOGIN_EMAIL_VERIFY, { state: { email: data.email } });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setApiError(t('auth.emailLogin.errorBlocked'));
                } else if (error.response?.status === 404) {
                    setApiError(t('auth.emailLogin.errorNotFound'));
                } else {
                    setApiError(error.response?.data?.message || t('auth.emailLogin.errorGeneric'));
                }
            } else {
                setApiError(t('auth.emailLogin.errorGeneric'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.emailLogin.heading')}</h2>
            <p className="text-sm text-gray-500 mb-8">
                {t('auth.emailLogin.subheading')}
            </p>

            {apiError && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{apiError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto">
                <div className="mb-8">
                    <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {t('auth.emailLogin.emailLabel')}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                            <Mail size={18} />
                        </div>
                        <input
                            id="email"
                            type="text"
                            placeholder={t('auth.emailLogin.emailPlaceholder')}
                            {...register("email")}
                            className={`w-full border-b py-2 pl-8 focus:outline-none transition-colors bg-transparent text-sm text-gray-800 disabled:opacity-50
                                ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#7A1014]'}`}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{t(errors.email.message as string)}</p>
                    )}
                </div>

                <SubmitButton type="submit" isLoading={isLoading}>
                    {t('auth.emailLogin.submitButton')}
                </SubmitButton>
            </form>

            <div className="mt-8 text-center max-w-sm mx-auto">
                <LinkButton to={PATHS.LOGIN} variant="ghost">
                    <ArrowLeft size={16} className="mr-2" />
                    {t('auth.emailLogin.backToLogin')}
                </LinkButton>
            </div>
        </div>
    );
}