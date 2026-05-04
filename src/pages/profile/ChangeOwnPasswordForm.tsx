import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { changeOwnPassword } from '../../services/accountService';
import SubmitButton from '../../shared/components/buttons/SubmitButton';
import { passwordSchema } from '../../shared/validators/passwordSchema';

interface Props {
    version: number;
    onSuccess: () => void;
}

const schema = passwordSchema.shape({
    oldPassword: yup.string().required('validation.required')
});

type FormValues = yup.InferType<typeof schema>;

export const ChangeOwnPasswordForm: React.FC<Props> = ({ version, onSuccess }) => {
    const { t } = useTranslation();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onTouched'
    });

    const onSubmit = async (data: FormValues) => {
        setApiError(null);
        try {
            await changeOwnPassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmPassword
            }, version);
            reset();
            onSuccess();
        } catch (err: any) {
            setApiError('error.changePasswordFailed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
            {apiError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {t(apiError)}
                </div>
            )}

            <div>
                <input
                    type="password"
                    placeholder={t('profile.oldPassword')}
                    className={`w-full border p-2 rounded ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('oldPassword')}
                />
                {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{t(errors.oldPassword.message as string)}</p>}
            </div>

            <div>
                <input
                    type="password"
                    placeholder={t('profile.newPassword')}
                    className={`w-full border p-2 rounded ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('newPassword')}
                />
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{t(errors.newPassword.message as string)}</p>}
            </div>

            <div>
                <input
                    type="password"
                    placeholder={t('profile.confirmNewPassword')}
                    className={`w-full border p-2 rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{t(errors.confirmPassword.message as string)}</p>}
            </div>

            <SubmitButton isLoading={isSubmitting}>
                {t('profile.applyChanges')}
            </SubmitButton>
        </form>
    );
};