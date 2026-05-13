import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { passwordSchema } from '../../../shared/validators/passwordSchema.ts';
import { changeOwnPassword, getAccountByLogin } from '../../../services/accountService.ts';
import SubmitButton from '../../../shared/components/buttons/SubmitButton.tsx';
import { useAuth } from '../../../hooks/useAuth.ts';

const forcePasswordSchema = yup.object({
    oldPassword: yup.string().required("validation.required")
}).concat(passwordSchema);

const ForcePasswordChangePage = () => {
    const { t } = useTranslation();
    const [serverError, setServerError] = useState<string | null>(null);
    const auth = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(forcePasswordSchema),
    });

    const onSubmit = async (data: any) => {
        setServerError(null);
        try {
            const login = auth.userLogin;

            if (!login) {
                throw new Error("Hook useAuth nie zwrócił loginu. Sprawdź stan w konsoli.");
            }

            const freshAccountResponse = await getAccountByLogin(login);
            const responseData = freshAccountResponse?.data ? freshAccountResponse.data : freshAccountResponse;
            const actualAccountData = responseData?.account || responseData;
            const version = actualAccountData?.version ?? actualAccountData?.versionHash ?? "";

            await changeOwnPassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            }, String(version));


            if (auth && auth.logout) {
                auth.logout();
            } else {
                localStorage.clear();
            }

            window.location.href = '/';

        } catch (err: any) {
            console.error("BŁĄD ZMIANY HASŁA", err);

            if (err.response) {
                const status = err.response.status;
                const responseData = err.response.data;

                if (status === 400) {
                    if (typeof responseData === 'object') {
                        if (responseData.errors) {
                            const msgs = Object.values(responseData.errors).map(msg => t(String(msg)));
                            setServerError(`Błąd walidacji: ${msgs.join(' | ')}`);
                        } else if (responseData.message) {
                            setServerError(t(String(responseData.message)));
                        } else {
                            setServerError(`Odrzucone: Upewnij się, że nowe hasło ma MINIMUM 12 ZNAKÓW i spełnia wymogi bezpieczeństwa.`);
                        }
                    } else {
                        setServerError(`Odrzucone: ${responseData}`);
                    }
                }
                else if (status === 409) {
                    const backendMessage = responseData?.message || responseData;
                    if (backendMessage === 'error.concurrent.update') {
                        setServerError(t('error.concurrent.update', 'Błąd wersji. Odśwież stronę i spróbuj ponownie.'));
                    } else if (backendMessage === 'error.password.same.as.old') {
                        setServerError(t('error.password.same.as.old', 'Nowe hasło nie może być takie samo jak stare!'));
                    } else {
                        setServerError(t(String(backendMessage)) || t('error.changePasswordFailed'));
                    }
                }
                else {
                    const backendMessage = responseData?.message || responseData;
                    if (typeof backendMessage === 'string') {
                        setServerError(t(backendMessage));
                    } else {
                        setServerError(t('error.changePasswordFailed', 'Nie udało się zmienić hasła.'));
                    }
                }
            } else {
                setServerError("Błąd komunikacji: " + err.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {t('force_password_change.title')}
                    </h2>
                    <p className="mt-3 text-sm text-gray-500">
                        {t('force_password_change.description')}
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {serverError && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-bold">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('password.old')}
                            </label>
                            <input
                                {...register('oldPassword')}
                                type="password"
                                className={`block w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.oldPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                            {errors.oldPassword && (
                                <p className="mt-1 text-xs text-red-500">{t(errors.oldPassword.message as string)}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('password.new')}
                            </label>
                            <input
                                {...register('newPassword')}
                                type="password"
                                className={`block w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                            {errors.newPassword && (
                                <p className="mt-1 text-xs text-red-500">{t(errors.newPassword.message as string)}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('password.confirm')}
                            </label>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                className={`block w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">{t(errors.confirmPassword.message as string)}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <SubmitButton isLoading={isSubmitting}>
                            {t('password.change_button')}
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForcePasswordChangePage;