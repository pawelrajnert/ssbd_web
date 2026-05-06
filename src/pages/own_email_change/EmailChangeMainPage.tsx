import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AlertCircle, ArrowLeft, CheckCircle2, Mail} from "lucide-react";
import axios from "axios";
import {useTranslation} from "react-i18next";

import {PATHS} from "../../routes/paths.ts";
import {emailChangeService} from "../../services/emailChangeService.ts";
import SubmitButton from "../../shared/components/buttons/SubmitButton.tsx";
import {useBreadcrumb} from "../../contexts/BreadcrumbContext.tsx";

export default function EmailChangeMainPage() {
    const {t} = useTranslation();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate();
    const {setDynamicBreadcrumb} = useBreadcrumb();

    useEffect(() => {
        setDynamicBreadcrumb(t('emailChange.main.breadcrumb'));
        return () => setDynamicBreadcrumb(null);
    }, [setDynamicBreadcrumb, t]);

    const handleRequestChange = async () => {
        setStatus('loading');
        setApiError("");
        try {
            await emailChangeService.requestEmailChange();
            setStatus('success');
        } catch (error) {
            console.error("Failed to request email change", error);
            setStatus('error');
            if (axios.isAxiosError(error)) {
                setApiError(error.response?.data?.message || t('emailChange.main.error.default'));
            } else {
                setApiError(t('emailChange.main.error.unexpected'));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(PATHS.USER_EDIT_ME)}
                    className="flex items-center text-sm font-bold text-gray-500 hover:text-[#7A1014] transition-colors mb-6"
                >
                    <ArrowLeft size={16} className="mr-2"/>
                    {t('emailChange.main.backToProfile')}
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('emailChange.main.title')}</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {status === 'success' ? (
                        <div
                            className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in duration-500">
                            <div
                                className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={32}/>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('emailChange.main.success.title')}</h2>
                            <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                                {t('emailChange.main.success.description')} <br/>
                                <strong>{t('emailChange.main.success.timeLimit')}</strong>
                            </p>
                            <button
                                onClick={() => navigate(PATHS.PROFILE)}
                                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold tracking-widest uppercase rounded-md transition-colors"
                            >
                                {t('emailChange.main.success.backButton')}
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div
                                    className="w-12 h-12 bg-red-50 text-[#7A1014] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail size={24}/>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{t('emailChange.main.form.title')}</h2>
                                    <p className="text-sm text-gray-500">{t('emailChange.main.form.subtitle')}</p>
                                </div>
                            </div>

                            {status === 'error' && (
                                <div
                                    className="mb-6 p-4 bg-red-50 text-[#7A1014] text-sm rounded-md flex items-start gap-3 border border-red-100">
                                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0"/>
                                    <span className="font-medium">{apiError}</span>
                                </div>
                            )}

                            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                                {t('emailChange.main.form.description1')}
                                <strong>{t('emailChange.main.form.descriptionBold')}</strong> {t('emailChange.main.form.description2')}
                            </p>

                            <div className="flex justify-end">
                                <SubmitButton
                                    onClick={handleRequestChange}
                                    isLoading={status === 'loading'}
                                    className="w-auto px-8 py-3 text-xs tracking-widest uppercase mt-0"
                                >
                                    {t('emailChange.main.form.submitButton')}
                                </SubmitButton>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}