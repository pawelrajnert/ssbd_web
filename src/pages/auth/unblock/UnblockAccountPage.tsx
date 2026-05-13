import {useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {CheckCircle, Loader2, Unlock, XCircle} from "lucide-react";
import {useTranslation} from "react-i18next";
import {PATHS} from "../../../routes/paths.ts";
import axiosInstance from "../../../api/auth/middleware.ts";

export default function UnblockAccountPage() {
    const {t} = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleUnblock = async () => {
        if (!token) {
            setStatus("error");
            return;
        }

        setStatus("loading");
        try {
            await axiosInstance.post(`/account/unblock-inactive?token=${token}`);
            setStatus("success");
        } catch (error) {
            console.error("Unblock error:", error);
            setStatus("error");
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center text-center space-y-6 w-full px-4 animate-in fade-in duration-500">
            {status === "idle" && (
                <>
                    <Unlock className="text-brand" size={64}/>
                    <h2 className="text-2xl font-bold text-primary">{t('auth.unblock.heading')}</h2>
                    <p className="text-secondary text-sm mb-4">{t('auth.unblock.description')}</p>
                    <button
                        onClick={handleUnblock}
                        className="px-8 py-3 bg-brand hover:bg-brand-hover text-white text-xs font-bold tracking-widest uppercase transition-colors block text-center rounded-md"
                    >
                        {t('auth.unblock.button')}
                    </button>
                </>
            )}

            {status === "loading" && (
                <>
                    <Loader2 className="animate-spin text-brand" size={64}/>
                    <h2 className="text-2xl font-bold text-primary">{t('auth.unblock.loading')}</h2>
                    <p className="text-secondary text-sm">{t('auth.unblock.loadingSub')}</p>
                </>
            )}

            {status === "success" && (
                <>
                    <CheckCircle className="text-green-600 dark:text-green-500" size={64}/>
                    <h2 className="text-2xl font-bold text-primary">{t('auth.unblock.success')}</h2>
                    <p className="text-secondary text-sm mb-4">{t('auth.unblock.successSub')}</p>
                    <Link
                        to={PATHS.LOGIN}
                        className="px-8 py-3 bg-brand hover:bg-brand-hover text-white text-xs font-bold tracking-widest uppercase transition-colors block text-center rounded-md"
                    >
                        {t('auth.unblock.proceed')}
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <XCircle className="text-danger" size={64}/>
                    <h2 className="text-2xl font-bold text-primary">{t('auth.unblock.error')}</h2>
                    <p className="text-secondary text-sm mb-4">
                        {t('auth.unblock.errorSub')}
                    </p>
                    <Link
                        to={PATHS.LOGIN}
                        className="px-8 py-3 bg-surface border border-border hover:bg-base text-primary text-xs font-bold tracking-widest uppercase transition-colors block text-center rounded-md"
                    >
                        {t('auth.unblock.back')}
                    </Link>
                </>
            )}
        </div>
    );
}