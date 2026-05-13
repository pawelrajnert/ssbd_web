import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { KeyRound, AlertCircle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslation } from "react-i18next";

import { PATHS } from "../../../routes/paths.ts";
import { authService } from "../../../services/authService.ts";
import { useAuth } from "../../../hooks/useAuth.ts";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";
import LinkButton from "../../../shared/components/buttons/LinkButton.tsx";

const tokenSchema = yup.object().shape({
    token: yup.string()
        .required("validation.emailCode.required")
        .length(10, "validation.emailCode.length")
        .matches(/^[A-Za-z0-9]{10}$/, "validation.emailCode.format")
});

export default function LoginEmailVerifyPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { setTokens } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const email = location.state?.email;

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(tokenSchema)
    });

    if (!email) {
        return <Navigate to={PATHS.LOGIN_EMAIL} replace />;
    }

    const onSubmit = async (data: { token: string }) => {
        setIsLoading(true);
        setApiError("");
        try {
            const response = await authService.verifyEmailCode(data.token, email);
            if (response?.token) {
                setTokens(response.token, response.refreshToken);
                navigate(PATHS.PROFILE, { replace: true });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setApiError(t('auth.emailLogin.verify.errorInvalid'));
            } else {
                setApiError(t('auth.emailLogin.verify.errorGeneric'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.emailLogin.verify.heading')}</h2>
            <p className="text-sm text-gray-500 mb-8">
                {t('auth.emailLogin.verify.subheading')} <span className="font-bold text-gray-800">{email}</span>. {t('auth.emailLogin.verify.subheadingTime')}
            </p>

            {apiError && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{apiError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto">
                <div className="mb-8">
                    <label htmlFor="token" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {t('auth.emailLogin.verify.codeLabel')}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                            <KeyRound size={18} />
                        </div>
                        <input
                            id="token"
                            type="text"
                            placeholder={t('auth.emailLogin.verify.codePlaceholder')}
                            maxLength={10}
                            {...register("token")}
                            className={`w-full border-b py-2 pl-8 focus:outline-none transition-colors bg-transparent text-sm text-gray-800 tracking-[0.3em] font-mono disabled:opacity-50
                                ${errors.token ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#7A1014]'}`}
                            disabled={isLoading}
                        />
                    </div>
                    {errors.token && (
                        <p className="text-red-500 text-xs mt-1">{t(errors.token.message as string)}</p>
                    )}
                </div>

                <SubmitButton type="submit" isLoading={isLoading}>
                    {t('auth.emailLogin.verify.submitButton')}
                </SubmitButton>
            </form>

            <div className="mt-8 text-center max-w-sm mx-auto">
                <LinkButton to={PATHS.LOGIN} variant="ghost">
                    <ArrowLeft size={16} className="mr-2" />
                    {t('auth.emailLogin.verify.backToLogin')}
                </LinkButton>
            </div>
        </div>
    );
}