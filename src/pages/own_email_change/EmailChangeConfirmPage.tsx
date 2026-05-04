import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {AlertCircle, ArrowLeft, CheckCircle2, Lock, Mail} from "lucide-react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import {PATHS} from "../../routes/paths.ts";
import {emailChangeService} from "../../services/emailChangeService.ts";
import SubmitButton from "../../shared/components/buttons/SubmitButton.tsx";
import LinkButton from "../../shared/components/buttons/LinkButton.tsx";
import {type EmailChangeFormData, emailChangeSchema} from "../../shared/validators/emailChangeSchema.ts";
import {useAuth} from "../../hooks/useAuth.ts";

export default function EmailChangeConfirmPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { logout } = useAuth();

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<EmailChangeFormData>({
        resolver: yupResolver(emailChangeSchema)
    });

    const onSubmit = async (data: EmailChangeFormData) => {
        setStatus('loading');
        setErrorMessage("");

        try {
            await emailChangeService.confirmEmailChange(token!, data.password, data.newEmail);
            setStatus('success');
            logout();
        } catch (error) {
            console.error("Failed to change email", error);
            setStatus('error');
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setErrorMessage("Wrong credentials provided.");
                } else {
                    setErrorMessage(error.response?.data?.message || "The link has expired or is invalid.");
                }
            } else {
                setErrorMessage("Unexpected error.");
            }
        }
    };

    if (!token) {
        return (
            <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="flex justify-center mb-4 text-red-500">
                    <AlertCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Nieprawidłowy link</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                    Link jest nieprawidłowy, spróbuj wykonać akcję zmiany adresu e-mail ponownie.
                </p>
                <LinkButton to={PATHS.OWN_EMAIL_CHANGE_MAIN} className="max-w-sm">
                    Powrót
                </LinkButton>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="flex justify-center mb-4 text-green-600">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">E-mail zmieniony</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                    Adres e-mail został pomyślnie zaaktualizowany.
                </p>
                <LinkButton to={PATHS.USER_LIST} className="max-w-sm">
                    Powrót
                </LinkButton>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Wprowadź nowy adres e-mail</h2>
            <p className="text-sm text-gray-500 mb-8">
                W celu zmiany adresu e-mail wprowadź nowy adres oraz potwierdź operację prawidłowym hasłem do konta.
            </p>

            {status === 'error' && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
                <div className="mb-6">
                    <label htmlFor="newEmail" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Nowy Adres E-mail
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                            <Mail size={18} />
                        </div>
                        <input
                            id="newEmail"
                            type="email"
                            placeholder="6sigma7@edu.p.lodz.pl"
                            {...register("newEmail")}
                            className={`w-full border-b py-2 pl-8 focus:outline-none transition-colors bg-transparent text-sm text-gray-800 disabled:opacity-50 ${errors.newEmail ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#7A1014]'}`}
                            disabled={status === 'loading'}
                        />
                    </div>
                    {errors.newEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.newEmail.message}</p>
                    )}
                </div>

                <div className="mb-8">
                    <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Obecne hasło
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                            <Lock size={18} />
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={`w-full border-b py-2 pl-8 focus:outline-none transition-colors bg-transparent text-sm text-gray-800 disabled:opacity-50 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#7A1014]'}`}
                            disabled={status === 'loading'}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                </div>

                <SubmitButton
                    type="submit"
                    isLoading={status === 'loading'}
                >
                    Potwierdź zmianę adresu e-mail
                </SubmitButton>
            </form>

            <div className="mt-8 text-center max-w-sm">
                <LinkButton to={PATHS.USER_LIST} variant="ghost">
                    <ArrowLeft size={16} className="mr-2" />
                    Powrót
                </LinkButton>
            </div>
        </div>
    );
}