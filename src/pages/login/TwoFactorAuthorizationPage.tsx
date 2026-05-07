import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { ShieldCheck, KeyRound, AlertCircle, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import { PATHS } from "../../routes/paths.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { authService } from "../../services/authService.ts";
import SubmitButton from "../../shared/components/buttons/SubmitButton.tsx";
import { _2faSchema, type _2faFormData } from "../../shared/validators/2FASchema.ts";

export default function TwoFactorVerifyPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { setTokens } = useAuth();

    const userLogin = location.state?.login;

    const [globalError, setGlobalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<_2faFormData>({
        resolver: yupResolver(_2faSchema),
        defaultValues: { Auth2F: "" }
    });

    if (!userLogin) {
        return <Navigate to={PATHS.LOGIN} replace />;
    }

    const onSubmit = async (data: _2faFormData) => {
        setGlobalError(null);
        setSuccessMessage(null);
        setIsLoading(true);
        try {
            const response = await authService.verify2FA(userLogin, data.Auth2F);

            setTokens(response.token, response.refreshToken);

            const from = location.state?.from?.pathname || PATHS.PROFILE;
            navigate(from, { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setGlobalError(t("auth.2fa.code.invalid"));
            } else {
                setGlobalError(t("auth.2fa.code.unexpectedError"));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setGlobalError(null);
        setSuccessMessage(null);
        setIsResending(true);
        try {
            await authService.resend2FA(userLogin);
            setSuccessMessage(t("auth.2fa.code.retry.success"));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setGlobalError(t("auth.2fa.code.retry.fail"));
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex flex-col w-full px-4 animate-in fade-in duration-500 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-50 text-[#7A1014] rounded-full flex items-center justify-center shadow-sm">
                    <ShieldCheck size={20} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                    {t("auth.2fa.heading")}
                </h2>
            </div>
            <p className="text-sm text-gray-500 mb-8">
                {t("auth.2fa.description")}
            </p>

            {globalError && (
                <div className="mb-6 p-3 bg-red-50 text-[#7A1014] text-sm rounded-md flex items-start gap-3 border border-red-200">
                    <AlertCircle size={18} className="mt-0.5 shrink-0"/>
                    <span>{globalError}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-3 bg-green-50 text-green-800 text-sm rounded-md border border-green-200">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                        {t("auth.2fa.inputLabel")}
                    </label>
                    <div className="relative border-b border-gray-200 focus-within:border-[#7A1014] transition-colors pb-2">
                        <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="00000000"
                            maxLength={8}
                            pattern="[0-9]*"
                            autoComplete="one-time-code"
                            className={`w-full pl-8 py-1 outline-none text-xl tracking-[0.3em] font-mono bg-transparent ${errors.Auth2F ? "text-red-500" : "text-gray-800"}`}
                            {...register("Auth2F", {
                                onChange: (e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }
                            })}
                        />
                    </div>
                    {errors.Auth2F && <p className="text-red-500 text-[10px] mt-1">{errors.Auth2F.message}</p>}
                </div>

                <SubmitButton type="submit" isLoading={isLoading} className="mt-6 tracking-wide w-full">
                    {t("auth.2fa.submit")}
                </SubmitButton>

                <div className="flex flex-col items-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isResending}
                        className="text-sm font-semibold text-gray-600 hover:text-[#7A1014] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={isResending ? "animate-spin" : ""} />
                        {t("auth.2fa.resend")}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(PATHS.LOGIN)}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 underline-offset-4 hover:underline"
                    >
                        {t("auth.2fa.cancel")}
                    </button>
                </div>
            </form>
        </div>
    );
}