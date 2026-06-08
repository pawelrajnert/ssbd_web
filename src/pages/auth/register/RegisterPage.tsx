import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {User, Mail, Lock, IdCard, MailCheck} from "lucide-react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

import {PATHS} from "../../../routes/paths.ts";
import axiosInstance from "../../../api/auth/middleware.ts";
import LinkButton from "../../../shared/components/buttons/LinkButton.tsx";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";

import {registerSchema, type RegisterFormData} from "../../../shared/validators/registerSchema.ts";

export default function RegisterPage() {
    const {t} = useTranslation();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            name: "",
            surname: "",
            login: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setGlobalError(null);
        setIsLoading(true);

        try {
            const {...payload} = data;

            await axiosInstance.post("/account/register", payload);
            setIsSuccess(true);
        } catch (err: any) {
            const errorData = err.response?.data;
            //TODO: wyświetlać komunikat z backendu zamiast tegp unexpected error
            if (errorData?.violations) {
                const messages = errorData.violations.map((v: any) => v.message).join(", ");
                setGlobalError(messages);
            } else {
                setGlobalError(t('error.unexpected'));
            }
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div
                className="flex flex-col items-center justify-center text-center w-full px-4 animate-in fade-in duration-500">
                {/* CHANGED: bg-red-50 to bg-active, text-[#7A1014] to text-brand */}
                <div className="w-16 h-16 bg-active text-brand rounded-full flex items-center justify-center mb-6">
                    <MailCheck size={32}/>
                </div>
                {/* CHANGED: text-gray-900 to text-primary */}
                <h2 className="text-3xl font-extrabold text-primary mb-4">
                    {t('auth.register.successHeading')}
                </h2>
                {/* CHANGED: text-gray-600 to text-secondary */}
                <p className="text-sm text-secondary mb-2 leading-relaxed">
                    {t('auth.register.successText')}
                </p>
                {/* CHANGED: text-gray-400 to text-secondary opacity-70 */}
                <p className="text-xs text-secondary opacity-70 mb-8 italic">
                    {t('auth.register.spamNote')}
                </p>
                <LinkButton
                    to={PATHS.LOGIN}
                    className="mt-2 text-xs tracking-widest uppercase"
                >
                    {t('auth.register.backToLogin')}
                </LinkButton>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full px-4">
            <h2 className="text-3xl font-extrabold text-primary mb-2">
                {t('auth.register.heading')}
            </h2>
            <p className="text-sm text-secondary mb-8">
                {t('auth.register.subheading')}
            </p>

            {globalError && (
                <div className="mb-4 p-3 bg-danger-subtle text-danger text-sm rounded-md border border-danger-border">
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                            {t('auth.register.name')}
                        </label>
                        <div
                            className="relative border-b border-border focus-within:border-brand transition-colors pb-1">
                            <User className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary opacity-70"
                                  size={18}/>
                            <input
                                type="text"
                                placeholder="Jan"
                                className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.name ? "text-danger" : "text-primary"}`}
                                {...register("name")}
                            />
                        </div>
                        {errors.name?.message &&
                            <p className="text-danger text-[10px] mt-1">{t(errors.name.message)}</p>}
                    </div>

                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                            {t('auth.register.surname')}
                        </label>
                        <div
                            className="relative border-b border-border focus-within:border-brand transition-colors pb-1">
                            <input
                                type="text"
                                placeholder="Kowalski"
                                className={`w-full pl-2 py-1 outline-none text-sm bg-transparent ${errors.surname ? "text-danger" : "text-primary"}`}
                                {...register("surname")}
                            />
                        </div>
                        {errors.surname?.message &&
                            <p className="text-danger text-[10px] mt-1">{t(errors.surname.message)}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                        {t('auth.register.login')}
                    </label>
                    <div className="relative border-b border-border focus-within:border-brand transition-colors pb-1">
                        <IdCard className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary opacity-70"
                                size={18}/>
                        <input
                            type="text"
                            placeholder="jkowalski"
                            className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.login ? "text-danger" : "text-primary"}`}
                            {...register("login")}
                        />
                    </div>
                    {errors.login?.message && <p className="text-danger text-[10px] mt-1">{t(errors.login.message)}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                        {t('auth.register.email')}
                    </label>
                    <div className="relative border-b border-border focus-within:border-brand transition-colors pb-1">
                        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary opacity-70" size={18}/>
                        <input
                            type="email"
                            placeholder="name@p.lodz.pl"
                            className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.email ? "text-danger" : "text-primary"}`}
                            {...register("email")}
                        />
                    </div>
                    {errors.email?.message && <p className="text-danger text-[10px] mt-1">{t(errors.email.message)}</p>}
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                            {t('auth.register.password')}
                        </label>
                        <div
                            className="relative border-b border-border focus-within:border-brand transition-colors pb-1">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary opacity-70"
                                  size={18}/>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.password ? "text-danger" : "text-primary"}`}
                                {...register("password")}
                            />
                        </div>
                        {errors.password?.message ?
                            <p className="text-danger text-[10px] mt-1">{t(errors.password.message)}</p> :
                            <p className="text-[10px] text-secondary opacity-70 mt-1">{t('auth.register.passwordHelper')}</p>
                        }
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-secondary tracking-wider mb-2 uppercase">
                            {t('auth.register.confirmPassword')}
                        </label>
                        <div
                            className="relative border-b border-border focus-within:border-brand transition-colors pb-1">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary opacity-70"
                                  size={18}/>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.confirmPassword ? "text-danger" : "text-primary"}`}
                                {...register("confirmPassword")}
                            />
                        </div>
                        {errors.confirmPassword?.message &&
                            <p className="text-danger text-[10px] mt-1">{t(errors.confirmPassword.message)}</p>}
                    </div>
                </div>

                <SubmitButton
                    type="submit"
                    isLoading={isLoading}
                    className="mt-6 text-xs tracking-widest uppercase"
                >
                    {t('auth.register.button')}
                </SubmitButton>

                <div className="text-center mt-6">
                    <p className="text-xs text-secondary">
                        {t('auth.register.haveAccount')}{' '}
                        <Link to={PATHS.LOGIN}
                              className="text-brand font-bold tracking-wider uppercase hover:text-brand-hover hover:underline transition-colors">
                            {t('auth.register.loginLink')}
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}