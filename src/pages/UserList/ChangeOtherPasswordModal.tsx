import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { InferType } from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import type { AccountDTO } from '../../types/user.types';
import SubmitButton from '../../shared/components/buttons/SubmitButton';
import { passwordSchema } from '../../shared/validators/passwordSchema';
import ConfirmationModal from '../../shared/components/modals/ConfirmationPopup.tsx';
import {changeOtherPassword} from "../../services/accountService.ts";

interface Props {
    isOpen: boolean;
    user: AccountDTO;
    onClose: () => void;
    onSuccess: () => void;
}

const schema = passwordSchema;
type FormValues = InferType<typeof schema>;

export default function ChangeOtherPasswordModal({ isOpen, user, onClose, onSuccess }: Props) {
    const { t } = useTranslation();

    const [apiError, setApiError] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingData, setPendingData] = useState<FormValues | null>(null);
    const [isSubmittingApi, setIsSubmittingApi] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onTouched'
    });

    if (!isOpen) return null;

    const onFormSubmit = (data: FormValues) => {
        setPendingData(data);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmChange = async () => {
        if (!pendingData) return;

        setApiError(null);
        setIsSubmittingApi(true);

        try {
            await changeOtherPassword(user.id, { newPassword: pendingData.newPassword }, user.versionHash);
            reset();
            setIsConfirmModalOpen(false);
            onSuccess();
        } catch (err: any) {
            console.error("Failed to change password for user", err);
            if (axios.isAxiosError(err)) {
                setApiError(err.response?.data?.message || err.response?.data || t('error.changePasswordFailed'));
            } else {
                setApiError(t('error.changePasswordFailed'));
            }
            setIsConfirmModalOpen(false);
        } finally {
            setIsSubmittingApi(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                    {t('userList.changePasswordFor', 'Change password for')} <span className="text-[#7A1014]">{user.login}</span>
                </h2>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    {apiError && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                            {apiError}
                        </div>
                    )}

                    <div>
                        <input
                            type="password"
                            placeholder={t('profile.newPassword')}
                            className={`w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A1014] ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('newPassword')}
                            disabled={isSubmittingApi}
                        />
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{t(errors.newPassword.message as string)}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder={t('profile.confirmNewPassword')}
                            className={`w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A1014] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('confirmPassword')}
                            disabled={isSubmittingApi}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{t(errors.confirmPassword.message as string)}</p>}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmittingApi}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {t('profile.cancel', 'Cancel')}
                        </button>
                        <div className="flex-1">
                            <SubmitButton isLoading={isSubmittingApi} className="!mt-0">
                                {t('profile.applyChanges')}
                            </SubmitButton>
                        </div>
                    </div>
                </form>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                title={t('common.confirmPasswordChangeTitle', 'Change User Password?')}
                description={t('common.confirmPasswordChangeAdminDesc', `Are you sure you want to forcibly change the password for ${user.login}? They will lose access using their current credentials.`)}
                confirmText={t('profile.applyChanges')}
                onConfirm={handleConfirmChange}
                onCancel={() => setIsConfirmModalOpen(false)}
                isLoading={isSubmittingApi}
            />
        </div>
    );
}