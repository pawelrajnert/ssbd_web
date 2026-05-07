import {useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {Lock, ArrowLeft, CheckCircle2, AlertCircle} from "lucide-react";
import {PATHS} from "../../../routes/paths.ts";
import {passwordResetService} from "../../../services/passwordResetService.ts";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {type PasswordFormData, passwordSchema} from "../../../shared/validators/passwordSchema.ts";
import axios from "axios";
import SubmitButton from "../../../shared/components/buttons/SubmitButton.tsx";
import LinkButton from "../../../shared/components/buttons/LinkButton.tsx";
import {useTranslation} from "react-i18next";
import ConfirmationModal from "../../../shared/components/modals/ConfirmationPopup.tsx";

export default function PasswordResetConfirmPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingData, setPendingData] = useState<PasswordFormData | null>(null);
    const {t} = useTranslation();
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<PasswordFormData>({
        resolver: yupResolver(passwordSchema)
    });
    const onFormSubmit = (data: PasswordFormData) => {
        setPendingData(data);
        setIsConfirmModalOpen(true);
    };
    const handleConfirmChange = async () => {
        if (!pendingData) return;

        setStatus('loading');
        setErrorMessage("");

        try {
            await passwordResetService.confirmReset(token!, pendingData.newPassword);
            setStatus('success');
            setIsConfirmModalOpen(false);
        } catch (error) {
            setStatus('error');
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || t("passwordReset.confirm.errorExpired"));
            } else if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(t("passwordReset.confirm.errorUnexpected"));
            }
            setIsConfirmModalOpen(false);
        }
    };
    if (!token) {
        return (
            <div
                className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="flex justify-center mb-4 text-red-500">
                    <AlertCircle size={48}/>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("passwrodReset.confirm.invalidLinkTitle")}</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                    {t("passwrodReset.confirm.invalidLinkDesc")}
                </p>
                <Link
                    to={PATHS.RESET_PASSWORD}
                    className="inline-block w-full max-w-sm bg-[#7A1014] text-white font-bold py-3 rounded-md hover:bg-red-900 transition-colors shadow-sm"
                >
                    {t("passwrodReset.confirm.requestNewLink")}
                </Link>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div
                className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="flex justify-center mb-4 text-green-600">
                    <CheckCircle2 size={48}/>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("passwrodReset.confirm.successTitle")}</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                    {t("passwrodReset.confirm.successDesc")}
                </p>
                <LinkButton to={PATHS.LOGIN} className="max-w-sm">
                    {t("passwrodReset.confirm.returnToLogin")}
                </LinkButton>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("passwrodReset.confirm.title")}</h2>
            <p className="text-sm text-gray-500 mb-8">
                {t("passwrodReset.confirm.subtitle")}
            </p>

            {status === 'error' && (
                <div
                    className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0"/>
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onFormSubmit)} className="w-full max-w-sm">
                <div className="mb-6">
                    <label htmlFor="newPassword"
                           className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {t("passwrodReset.confirm.newPassword")}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                            <Lock size={18}/>
                        </div>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••••••"
                            {...register("newPassword")}
                            className={`w-full border-b py-2 pl-8 focus:outline-none transition-colors bg-transparent text-sm text-gray-800 disabled:opacity-50 ${errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#7A1014]'}`}
                            disabled={status === 'loading'}
                        />
                    </div>
                    {errors.newPassword?.message && (
                        <p className="text-red-500 text-xs mt-1">{t(errors.newPassword.message)}</p>
                    )}
                </div>

                <div className="mb-8">
                    <label htmlFor="confirmPassword"
                           className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {t("passwrodReset.confirm.confirmPassword")}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                            <Lock size={18}/>
                        </div>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••••••"
                            {...register("confirmPassword")}
                            className={`w-full border-b py-2 pl-8 focus:outline-none transition-colors bg-transparent text-sm text-gray-800 disabled:opacity-50 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#7A1014]'}`}
                            disabled={status === 'loading'}
                        />
                    </div>
                    {errors.confirmPassword?.message && (
                        <p className="text-red-500 text-xs mt-1">{t(errors.confirmPassword.message)}</p>
                    )}
                </div>

                <SubmitButton
                    type="submit"
                    isLoading={status === 'loading'}
                >
                    {t("passwrodReset.confirm.submit")}
                </SubmitButton>
            </form>

            <div className="mt-8 text-center max-w-sm">
                <LinkButton to={PATHS.LOGIN} variant="ghost">
                    <ArrowLeft size={16} className="mr-2"/>
                    {t("passwrodReset.confirm.BackToLogin")}
                </LinkButton>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                title={t('common.confirmPasswordResetTitle', 'Confirm Password Reset?')}
                description={t('common.confirmPasswordResetDesc', 'Are you sure you want to change your password? Once changed, you must use the new password to log in.')}
                confirmText={t('passwordReset.confirm.submit')}
                onConfirm={handleConfirmChange}
                onCancel={() => setIsConfirmModalOpen(false)}
                isLoading={status === 'loading'}
            />
        </div>
    );
}