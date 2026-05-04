import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import { PATHS } from "../../routes/paths.ts";
import { emailChangeService } from "../../services/emailChangeService.ts";
import SubmitButton from "../../shared/components/buttons/SubmitButton.tsx";
import LinkButton from "../../shared/components/buttons/LinkButton.tsx";

export default function EmailChangeMainPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [apiError, setApiError] = useState("");

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
                setApiError(error.response?.data?.message || "Error while trying to change email");
            } else {
                setApiError("Unexpected error");
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="flex justify-center mb-4 text-green-600">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sprawdź swoją skrzynkę mailową</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                    Na Twój obecny adres e-mail został wysłany link do zmiany adresu na inny.
                    Kliknij w niego w celu dokończenia akcji, link jest ważny 10 minut.
                </p>
                <Link
                    to={PATHS.USER_LIST}
                    className="inline-block w-full bg-[#7A1014] text-white font-bold py-3 rounded-md hover:bg-red-900 transition-colors shadow-sm"
                >
                    Powrót
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Zmień swój adres e-mail</h2>
            <p className="text-sm text-gray-500 mb-8">
                Zmiana adresu e-mail wymaga dodatkowego potwierdzenia akcji.
                Kliknij przycisk poniżej w celu wysłania linku do zmiany adresu.
            </p>

            {status === 'error' && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{apiError}</span>
                </div>
            )}

            <div className="w-full max-w-sm">
                <SubmitButton
                    onClick={handleRequestChange}
                    isLoading={status === 'loading'}
                >
                    Wyślij link do zmiany adresu e-mail
                </SubmitButton>
            </div>

            <div className="mt-8 text-center max-w-sm">
                <LinkButton to={PATHS.USER_LIST} variant="ghost">
                    <ArrowLeft size={16} className="mr-2" />
                    Powrót
                </LinkButton>
            </div>
        </div>
    );
}