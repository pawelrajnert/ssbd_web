import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { User, Mail, Lock,  IdCard, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { PATHS } from "../../../routes/paths.ts";
import axiosInstance from "../../../api/auth/middleware.ts";
import LinkButton from "../../../shared/components/buttons/LinkButton.tsx";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";

import { registerSchema, type RegisterFormData } from "../../../shared/validators/registerSchema.ts";

export default function RegisterPage() {
    const { t } = useTranslation();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            name: "",
            surname: "",
            login: "",
            email: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setGlobalError(null);
        setIsLoading(true);

        try {
            const {...payload } = data;

            await axiosInstance.post("/account/register", payload);
            setIsSuccess(true);
        } catch (err: any) {
            const errorData = err.response?.data;

            if (errorData?.violations) {
                const messages = errorData.violations.map((v: any) => v.message).join(", ");
                setGlobalError(messages);
            } else {
                setGlobalError("An unexpected error occurred.");
            }
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center text-center w-full px-4 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-red-50 text-[#7A1014] rounded-full flex items-center justify-center mb-6">
                    <MailCheck size={32} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                    {t('auth.register.successHeading')}
                </h2>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {t('auth.register.successText')}
                </p>
                <p className="text-xs text-gray-400 mb-8 italic">
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
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {t('auth.register.heading')}
            </h2>
            <p className="text-sm text-gray-500 mb-8">
                {t('auth.register.subheading')}
            </p>

            {globalError && (
                <div className="mb-4 p-3 bg-red-50 text-[#7A1014] text-sm rounded-md border border-red-200">
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                            {t('auth.register.name')}
                        </label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                            <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Jan"
                                className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.name ? "text-red-500" : "text-gray-800"}`}
                                {...register("name")}
                            />
                        </div>
                        {errors.name?.message && <p className="text-red-500 text-[10px] mt-1">{t(errors.name.message)}</p>}
                    </div>

                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                            {t('auth.register.surname')}
                        </label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                            <input
                                type="text"
                                placeholder="Kowalski"
                                className={`w-full pl-2 py-1 outline-none text-sm bg-transparent ${errors.surname ? "text-red-500" : "text-gray-800"}`}
                                {...register("surname")}
                            />
                        </div>
                        {errors.surname?.message && <p className="text-red-500 text-[10px] mt-1">{t(errors.surname.message)}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                        {t('auth.register.login')}
                    </label>
                    <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                        <IdCard className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="jkowalski"
                            className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.login ? "text-red-500" : "text-gray-800"}`}
                            {...register("login")}
                        />
                    </div>
                    {errors.login?.message && <p className="text-red-500 text-[10px] mt-1">{t(errors.login.message)}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                        {t('auth.register.email')}
                    </label>
                    <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            placeholder="name@p.lodz.pl"
                            className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.email ? "text-red-500" : "text-gray-800"}`}
                            {...register("email")}
                        />
                    </div>
                    {errors.email?.message && <p className="text-red-500 text-[10px] mt-1">{t(errors.email.message)}</p>}
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                            {t('auth.register.password')}
                        </label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.password ? "text-red-500" : "text-gray-800"}`}
                                {...register("password")}
                            />
                        </div>
                        {errors.password?.message ?
                            <p className="text-red-500 text-[10px] mt-1">{t(errors.password.message)}</p> :
                            <p className="text-[10px] text-gray-400 mt-1">{t('auth.register.passwordHelper')}</p>
                        }
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                            {t('auth.register.confirmPassword')}
                        </label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className={`w-full pl-8 py-1 outline-none text-sm bg-transparent ${errors.confirmPassword ? "text-red-500" : "text-gray-800"}`}
                                {...register("confirmPassword")}
                            />
                        </div>
                        {errors.confirmPassword?.message && <p className="text-red-500 text-[10px] mt-1">{t(errors.confirmPassword.message)}</p>}
                    </div>
                </div>

                {/*<div className="mt-6">*/}
                {/*    <Controller*/}
                {/*        name="termsAccepted"*/}
                {/*        control={control}*/}
                {/*        render={({ field }) => (*/}
                {/*            <div>*/}
                {/*                <div*/}
                {/*                    className="flex items-start gap-3 cursor-pointer"*/}
                {/*                    onClick={() => field.onChange(!field.value)}*/}
                {/*                >*/}
                {/*                    <div className="mt-0.5 text-red-800">*/}
                {/*                        {field.value ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-300" />}*/}
                {/*                    </div>*/}
                {/*                    <p className="text-xs text-gray-600 leading-tight select-none">*/}
                {/*                        {t('auth.register.terms')}*/}
                {/*                    </p>*/}
                {/*                </div>*/}
                {/*                {errors.termsAccepted?.message && <p className="text-red-500 text-[10px] mt-1">{(errors.termsAccepted.message)}</p>}*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    />*/}
                {/*</div>*/}

                <SubmitButton
                    type="submit"
                    isLoading={isLoading}
                    className="mt-6 text-xs tracking-widest uppercase"
                >
                    {t('auth.register.button')}
                </SubmitButton>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        {t('auth.register.haveAccount')}{' '}
                        <Link to={PATHS.LOGIN} className="text-[#8a151b] font-bold tracking-wider uppercase hover:underline">
                            {t('auth.register.loginLink')}
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}