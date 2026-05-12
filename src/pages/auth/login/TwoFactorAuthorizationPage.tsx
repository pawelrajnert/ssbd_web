import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { ShieldCheck, KeyRound, AlertCircle, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import {getDashboardPath, PATHS} from "../../../routes/paths.ts";
import {type JwtPayload, useAuth} from "../../../hooks/useAuth.ts";
import {authService} from "../../../services/authService.ts";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";
import {_2faSchema, type _2faFormData} from "../../../shared/validators/2FASchema.ts";
import {jwtDecode} from "jwt-decode";

export default function TwoFactorVerifyPage() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const {setTokens} = useAuth();

    const userLogin = location.state?.login;

    const [globalError, setGlobalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const {register, handleSubmit, formState: {errors}} = useForm<_2faFormData>({
        resolver: yupResolver(_2faSchema),
        defaultValues: {auth2F: ""}
    });

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    if (!userLogin) {
        return <Navigate to={PATHS.LOGIN} replace/>;
    }

    const onSubmit = async (data: _2faFormData) => {
        setGlobalError(null);
        setSuccessMessage(null);
        setIsLoading(true);
        try {
            const response = await authService.verify2FA(userLogin, data.auth2F);
            setTokens(response.token, response.refreshToken);
            const decoded = jwtDecode<JwtPayload>(response.token);
            const newRole = decoded.roles?.includes("ADMIN") ? "ADMIN" : decoded.roles?.[0];
            const targetPath = location.state?.from?.pathname || getDashboardPath(newRole);
            navigate(targetPath, {replace: true});
        }catch (err) {
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
            setCountdown(60);
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
                <div className="w-10 h-10 bg-active text-brand rounded-full flex items-center justify-center shadow-sm">
                    <ShieldCheck size={20}/>
                </div>
                <h2 className="text-3xl font-extrabold text-primary">
                    {t("auth.2fa.heading")}
                </h2>
            </div>
            <p className="text-sm text-secondary mb-8">
                {t("auth.2fa.description")}
            </p>

            {globalError && (
                <div
                    className="mb-6 p-3 bg-danger-subtle text-danger text-sm rounded-md flex items-start gap-3 border border-danger-border">
                    <AlertCircle size={18} className="mt-0.5 shrink-0"/>
                    <span>{globalError}</span>
                </div>
            )}

            {successMessage && (
                <div
                    className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm rounded-md border border-green-200 dark:border-green-900/50">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                        {t("auth.2fa.inputLabel")}
                    </label>
                    <div className="relative border-b border-border focus-within:border-brand transition-colors pb-2">
                        <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary opacity-70"
                                  size={18}/>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="00000000"
                            maxLength={8}
                            pattern="[0-9]*"
                            autoComplete="one-time-code"
                            className={`w-full pl-8 py-1 outline-none text-xl tracking-[0.3em] font-mono bg-transparent ${errors.auth2F ? "text-danger" : "text-primary"}`}
                            {...register("auth2F", {
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }
                            })}
                        />
                    </div>
                    {errors.auth2F && <p className="text-danger text-[10px] mt-1">{errors.auth2F.message}</p>}
                </div>

                <SubmitButton type="submit" isLoading={isLoading} className="mt-6 tracking-wide w-full">
                    {t("auth.2fa.submit")}
                </SubmitButton>

                <div className="flex flex-col items-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isResending || countdown > 0}
                        className="text-sm font-semibold text-secondary hover:text-brand transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-secondary"
                    >
                        <RefreshCw size={14} className={isResending ? "animate-spin" : ""}/>
                        {countdown > 0 ? `${t("auth.2fa.resend")} (${countdown}s)` : t("auth.2fa.resend")}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(PATHS.LOGIN)}
                        className="text-xs font-bold text-secondary opacity-70 hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
                    >
                        {t("auth.2fa.cancel")}
                    </button>
                </div>
            </form>
        </div>
    );
}