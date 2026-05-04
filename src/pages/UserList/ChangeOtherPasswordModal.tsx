import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { InferType } from 'yup';
import { useTranslation } from 'react-i18next';
import { changeOtherPassword } from '../../services/accountService';
import type { AccountDTO } from '../../types/user.types';
import SubmitButton from '../../shared/components/buttons/SubmitButton';
import { passwordSchema } from '../../shared/validators/passwordSchema';

interface Props {
    user: AccountDTO;
    onClose: () => void;
    onSuccess: () => void;
}

const schema = passwordSchema;
type FormValues = InferType<typeof schema>;

export default function ChangeOtherPasswordModal({ user, onClose, onSuccess }: Props) {
    const { t } = useTranslation();
    const [apiError, setApiError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onTouched'
    });

    const onSubmit = async (data: FormValues) => {
        setApiError(null);
        try {
            await changeOtherPassword(user.id, { newPassword: data.newPassword }, user.version);
            onSuccess();
        } catch (err: any) {
            setApiError('error.changePasswordFailed');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                    {t('userList.changePasswordFor')} <span className="text-[#7A1014]">{user.login}</span>
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {apiError && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">{t(apiError)}</div>}
                    <div>
                        <input
                            type="password"
                            placeholder={t('profile.newPassword')}
                            className={`w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A1014] ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('newPassword')}
                        />
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{t(errors.newPassword.message as string)}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder={t('profile.confirmNewPassword')}
                            className={`w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A1014] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{t(errors.confirmPassword.message as string)}</p>}
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">
                            {t('userList.cancel')}
                        </button>
                        <div className="flex-1">
                            <SubmitButton isLoading={isSubmitting} className="!mt-0">{t('profile.applyChanges')}</SubmitButton>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}