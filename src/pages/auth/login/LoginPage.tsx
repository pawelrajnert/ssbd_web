import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {User, Lock, CheckSquare, Square} from "lucide-react";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import {GoogleLogin} from '@react-oauth/google';

import {getDashboardPath, PATHS} from "../../../routes/paths.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import {authService, loginWithGoogle} from "../../../services/authService.ts";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";
import {loginSchema, type LoginFormData} from "../../../shared/validators/loginSchema.ts";
import {jwtDecode} from "jwt-decode";
import type { JwtPayload } from "../../../hooks/useAuth.ts";

export default function LoginPage() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const {setTokens} = useAuth();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {register, handleSubmit, control, formState: {errors}} = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        defaultValues: {login: "", password: "", rememberMe: false}
    });

    const onSubmit = async (data: LoginFormData) => {
        setGlobalError(null);
        setIsLoading(true);
        try {
            const {response, status} = await authService.login(data.login, data.password);
            if (response?.message === "mfa.required") {
                navigate(PATHS._2FA_VERIFY, {
                    state: {
                        login: data.login,
                        from: location.state?.from
                    }
                });
            // } else if (response?.token) {
            //     setTokens(response.token, response.refreshToken);
            //     const decoded = jwtDecode<JwtPayload>(response.token);
            //     const newRole = decoded.roles?.includes("ADMIN") ? "ADMIN" : decoded.roles?.[0];
            //
            //     const targetPath = location.state?.from?.pathname || getDashboardPath(newRole);
            //     navigate(targetPath, {replace: true});
                //to w sumie nigdy nie wystąpi bo mamy 2fa
            } else {
                if (status === 202) {
                    setGlobalError(t('auth.login.errorInvalid'));
                } else if (typeof response === 'string') {
                    setGlobalError(response);
                } else {
                    setGlobalError(t('auth.login.errorInvalid'));
                }
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 202) {
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

                const decoded = jwtDecode<JwtPayload>(response.token);
                const newRole = decoded.roles?.includes("ADMIN") ? "ADMIN" : decoded.roles?.[0];

                const targetPath = location.state?.from?.pathname || getDashboardPath(newRole);
                navigate(targetPath, {replace: true});
            }
        } catch {
            setGlobalError(t('auth.login.errorGoogle'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full px-4 animate-in fade-in duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">
                {t('auth.login.heading')}
            </h2>
            <p className="text-sm text-secondary mb-10">
                {t('auth.login.subheading')}
            </p>

            {globalError && (
                <div className="mb-6 p-3 bg-danger-subtle text-danger text-sm rounded-md border border-danger-border">
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                        {t('auth.login.loginLabel')}
                    </label>
                    <div className="relative border-b border-border focus-within:border-brand transition-colors pb-2">
                        <User className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary opacity-70" size={18}/>
                        <input
                            type="text"
                            placeholder={t('auth.login.loginPlaceholder')}
                            className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.login ? "text-danger" : "text-primary"}`}
                            {...register("login")}
                        />
                    </div>
                    {errors.login?.message && <p className="text-danger text-[10px] mt-1">{t(errors.login.message)}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                        {t('auth.login.passwordLabel')}
                    </label>
                    <div className="relative border-b border-border focus-within:border-brand transition-colors pb-2">
                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary opacity-70" size={18}/>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full pl-8 py-1 outline-none text-sm bg-transparent tracking-widest ${errors.password ? "text-danger" : "text-primary"}`}
                            {...register("password")}
                        />
                    </div>
                    {errors.password?.message &&
                        <p className="text-danger text-[10px] mt-1">{t(errors.password.message)}</p>}
                </div>

                <div className="flex items-center justify-between pt-2 pb-2">
                    <Controller
                        name="rememberMe"
                        control={control}
                        render={({field}) => (
                            <div
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => field.onChange(!field.value)}
                            >
                                <div
                                    className={field.value ? "text-brand" : "text-secondary opacity-50 group-hover:opacity-100 transition-opacity"}>
                                    {field.value ? <CheckSquare size={18}/> : <Square size={18}/>}
                                </div>
                                <p className="text-xs text-secondary font-medium select-none">
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
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-base text-secondary transition-colors duration-300">
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
                    <Link to={PATHS.FORGOT_PASSWORD}
                          className="text-xs font-bold text-brand hover:text-brand-hover transition-colors hover:underline">
                        {t('auth.login.forgotPassword')}
                    </Link>
                </div>

                <div className="text-center mt-10">
                    <p className="text-xs text-secondary mb-1">
                        {t('auth.login.noAccount')}
                    </p>
                    <Link to={PATHS.REGISTER}
                          className="text-brand hover:text-brand-hover transition-colors text-sm font-bold tracking-wide hover:underline">
                        {t('auth.login.createAccount')}
                    </Link>
                </div>
            </form>
        </div>
    );
}