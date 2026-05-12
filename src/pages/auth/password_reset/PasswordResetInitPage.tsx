import {useState} from "react";
import {Link} from "react-router-dom";
import {Mail, ArrowLeft, CheckCircle2, AlertCircle} from "lucide-react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import {useTranslation} from "react-i18next";
import {PATHS} from "../../../routes/paths.ts";
import {passwordResetService} from "../../../services/passwordResetService.ts";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";
import {emailSchema, type EmailFormData} from "../../../shared/validators/emailSchema.ts";
import LinkButton from "../../../shared/components/buttons/LinkButton.tsx";

export default function PasswordResetInitPage() {
    const {t} = useTranslation();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [apiError, setApiError] = useState("");

    const {
        register,
        handleSubmit,
        getValues,
        formState: {errors}
    } = useForm<EmailFormData>({
        resolver: yupResolver(emailSchema)
    });

    const onSubmit = async (data: EmailFormData) => {
        setStatus('loading');
        setApiError("");
        try {
            await passwordResetService.requestReset(data.email);
            setStatus('success');
        } catch (error) {
            console.error("Failed to request password reset", error);
            setStatus('error');
            if (axios.isAxiosError(error)) {
                setApiError(error.response?.data?.message || t("passwordReset.init.errorSend"));
            } else {
                setApiError(t("passwordReset.init.errorUnexpected"));
            }
        }
    };

    if (status === 'success') {
        return (
            <div
                className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="flex justify-center mb-4 text-green-600 dark:text-green-500">
                    <CheckCircle2 size={48}/>
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">{t("passwordReset.init.successTitle")}</h2>
                <p className="text-sm text-secondary mb-8 max-w-sm mx-auto">
                    {t("passwordReset.init.successDesc1")}
                    <span className="font-bold text-primary">{getValues("email")}</span>
                    {t("passwordReset.init.successDesc2")}
                </p>
                <Link
                    to={PATHS.LOGIN}
                    className="inline-block w-full bg-brand text-white font-bold py-3 rounded-md hover:bg-brand-hover transition-colors shadow-sm"
                >
                    {t("passwordReset.init.returnToLogin")}
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-primary mb-2">{t("passwordReset.init.title")}</h2>
            <p className="text-sm text-secondary mb-8">
                {t("passwordReset.init.subtitle")}
            </p>

            {status === 'error' && (
                <div
                    className="mb-6 p-3 bg-danger-subtle text-danger text-sm rounded-md flex items-start gap-2 border border-danger-border">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0"/>
                    <span>{apiError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
                <div className="mb-8">
                    <label htmlFor="email"
                           className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                        {t("passwordReset.init.email")}
                    </label>
                    <div className="relative">
                        <div
                            className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-secondary opacity-70">
                            <Mail size={18}/>
                        </div>
                        <input
                            id="email"
                            type="text"
                            placeholder={t("passwordReset.init.emailPlaceholder", "E.g. Jan_Kowalski@edu.p.lodz.pl")}
                            {...register("email")}
                            className={`w-full border-b py-2 pl-8 focus:outline-none transition-colors bg-transparent text-sm text-primary disabled:opacity-50
                            ${errors.email ? 'border-danger focus:border-danger' : 'border-border focus:border-brand'}`}
                            disabled={status === 'loading'}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-danger text-xs mt-1">{t(errors.email.message as string)}</p>
                    )}
                </div>

                <SubmitButton
                    type="submit"
                    isLoading={status === 'loading'}
                >
                    {t("passwordReset.init.submit")}
                </SubmitButton>
            </form>

            <div className="mt-8 text-center max-w-sm">
                <LinkButton to={PATHS.LOGIN} variant="ghost">
                    <ArrowLeft size={16} className="mr-2"/>
                    {t("passwordReset.init.backToLogin")}
                </LinkButton>
            </div>
        </div>
    )
        ;
}