import {useEffect, useState, useRef} from "react";
import {useSearchParams, Link} from "react-router-dom";
import {CheckCircle, XCircle, Loader2} from "lucide-react";
import {useTranslation} from "react-i18next";
import {PATHS} from "../../../routes/paths.ts";
import axiosInstance from "../../../api/auth/middleware.ts";

export default function ActivatePage() {
    const {t} = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const hasAttempted = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        if (hasAttempted.current) return;
        hasAttempted.current = true;

        const activateAccount = async () => {
            try {
                await axiosInstance.post(`/account/activate?token=${token}`);
                setStatus("success");
            } catch (error) {
                console.error("Activation error:", error);
                setStatus("error");
            }
        };

        activateAccount();
    }, [token]);

    return (
        <div
            className="flex flex-col items-center justify-center text-center space-y-6 w-full px-4 animate-in fade-in duration-500">
            {status === "loading" && (
                <>
                    <Loader2 className="animate-spin text-brand" size={64}/>
                    <h2 className="text-2xl font-bold text-primary">{t('auth.activate.loading')}</h2>
                    <p className="text-secondary text-sm">{t('auth.activate.loadingSub')}</p>
                </>
            )}

            {status === "success" && (
                <>
                    <CheckCircle className="text-green-600 dark:text-green-500" size={64}/>
                    <h2 className="text-2xl font-bold text-primary">{t('auth.activate.success')}</h2>
                    <p className="text-secondary text-sm mb-4">{t('auth.activate.successSub')}</p>
                    <Link
                        to={PATHS.LOGIN}
                        className="px-8 py-3 bg-brand hover:bg-brand-hover text-white text-xs font-bold tracking-widest uppercase transition-colors block text-center rounded-md"
                    >
                        {t('auth.activate.proceed')}
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <XCircle className="text-danger" size={64}/>
                    <h2 className="text-2xl font-bold text-primary">{t('auth.activate.error')}</h2>
                    <p className="text-secondary text-sm mb-4">
                        {t('auth.activate.errorSub')}
                    </p>
                    <Link
                        to={PATHS.LOGIN}
                        className="px-8 py-3 bg-surface border border-border hover:bg-base text-primary text-xs font-bold tracking-widest uppercase transition-colors block text-center rounded-md"
                    >
                        {t('auth.activate.back')}
                    </Link>
                </>
            )}
        </div>
    );
}
