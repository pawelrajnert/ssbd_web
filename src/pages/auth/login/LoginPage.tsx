import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Lock, CheckSquare, Square } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';

import { PATHS } from "../../../routes/paths.ts";
import { useAuth } from "../../../hooks/useAuth.ts";
import {authService, loginWithGoogle} from "../../../services/authService.ts";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";
import { loginSchema, type LoginFormData } from "../../../shared/validators/loginSchema.ts";

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, setTokens } = useAuth();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(PATHS.USER_LIST, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const { register, handleSubmit, control, formState: { errors } } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        defaultValues: { login: "", password: "", rememberMe: false }
    });

    const onSubmit = async (data: LoginFormData) => {
        setGlobalError(null);
        setIsLoading(true);
        try {
            const response = await authService.login(data.login, data.password);

            if (response?.message === "mfa.required") {
                navigate(PATHS._2FA_VERIFY, {
                    state: {
                        login: data.login,
                        from: location.state?.from
                    }
                });
            } else if (response?.token) {
                setTokens(response.token, response.refreshToken);
                const from = location.state?.from?.pathname || PATHS.PROFILE;
                navigate(from, { replace: true });
            } else {
                if (typeof response === 'string') {
                    setGlobalError(response);
                } else {
                    setGlobalError(t('auth.login.errorInvalid'));
                }
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setGlobalError(t('auth.login.errorInvalid'));
                } else if (err.response?.status === 409) {
                    setGlobalError(t('auth.login.errorBlocked'));
                } else {
                    setGlobalError(err.response?.data?.message || t('auth.login.errorGeneric'));
                }
            } else {
                setGlobalError(t('auth.login.errorGeneric'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credential: string) => {
        setGlobalError(null);
        setIsLoading(true);
        try {
            const response = await loginWithGoogle(credential);
            if (response?.token) {
                setTokens(response.token, response.refreshToken);
                const from = location.state?.from?.pathname || PATHS.PROFILE;
                navigate(from, { replace: true });
            }
        } catch {
            setGlobalError(t('auth.login.errorGoogle'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full px-4 animate-in fade-in duration-500">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {t('auth.login.heading')}
            </h2>
            <p className="text-sm text-gray-500 mb-10">
                {t('auth.login.subheading')}
            </p>

            {globalError && (
                <div className="mb-6 p-3 bg-red-50 text-[#7A1014] text-sm rounded-md border border-red-200">
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                        {t('auth.login.loginLabel')}
                    </label>
                    <div className="relative border-b border-gray-200 focus-within:border-[#7A1014] transition-colors pb-2">
                        <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('auth.login.loginPlaceholder')}
                            className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.login ? "text-red-500" : "text-gray-800"}`}
                            {...register("login")}
                        />
                    </div>
                    {errors.login?.message && <p className="text-red-500 text-[10px] mt-1">{t(errors.login.message)}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                        {t('auth.login.passwordLabel')}
                    </label>
                    <div className="relative border-b border-gray-200 focus-within:border-[#7A1014] transition-colors pb-2">
                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full pl-8 py-1 outline-none text-sm bg-transparent tracking-widest ${errors.password ? "text-red-500" : "text-gray-800"}`}
                            {...register("password")}
                        />
                    </div>
                    {errors.password?.message && <p className="text-red-500 text-[10px] mt-1">{t(errors.password.message)}</p>}
                </div>

                <div className="flex items-center justify-between pt-2 pb-2">
                    <Controller
                        name="rememberMe"
                        control={control}
                        render={({ field }) => (
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => field.onChange(!field.value)}
                            >
                                <div className="text-red-800">
                                    {field.value ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-300" />}
                                </div>
                                <p className="text-xs text-gray-600 font-medium select-none">
                                    {t('auth.login.rememberMe')}
                                </p>
                            </div>
                        )}
                    />
                </div>

                <SubmitButton type="submit" isLoading={isLoading} className="mt-2 tracking-wide">
                    {t('auth.login.button')}
                </SubmitButton>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                {t('auth.login.orLoginWith')}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                if (credentialResponse.credential) {
                                    handleGoogleLogin(credentialResponse.credential);
                                }
                            }}
                            onError={() => {
                                setGlobalError(t('auth.login.errorGoogle'));
                            }}
                            useOneTap
                            shape="pill"
                            theme="outline"
                        />
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link to={PATHS.FORGOT_PASSWORD} className="text-xs font-bold text-[#7A1014] hover:underline">
                        {t('auth.login.forgotPassword')}
                    </Link>
                </div>

                <div className="text-center mt-10">
                    <p className="text-xs text-gray-500 mb-1">
                        {t('auth.login.noAccount')}
                    </p>
                    <Link to={PATHS.REGISTER} className="text-[#8a151b] text-sm font-bold tracking-wide hover:underline">
                        {t('auth.login.createAccount')}
                    </Link>
                </div>
            </form>
        </div>
    );
}