import {useState} from "react";
import {Link} from "react-router-dom";
import {Mail, ArrowLeft, CheckCircle2, AlertCircle} from "lucide-react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import {PATHS} from "../../routes/paths.ts";
import {passwordResetService} from "../../services/passwordResetService.ts";
import SubmitButton from "../../shared/components/buttons/SubmitButton.tsx";
import {emailSchema, type EmailFormData} from "../../shared/validators/emailSchema.ts";
import LinkButton from "../../shared/components/buttons/LinkButton.tsx";

export default function PasswordResetInitPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [apiError, setApiError] = useState("");

    const {
        register,
        handleSubmit,
        getValues,
        formState: {errors}
    } = useForm<EmailFormData>({
        resolver: yupResolver(emailSchema)
    });

    const onSubmit = async (data: EmailFormData) => {
        setStatus('loading');
        setApiError("");
        try {
            await passwordResetService.requestReset(data.email);
            setStatus('success');
        } catch (error) {
            console.error("Failed to request password reset", error);
            setStatus('error');
            if (axios.isAxiosError(error)) {
                setApiError(error.response?.data?.message || "An error occurred while sending the reset link.");
            } else {
                setApiError("An unexpected error occurred.");
            }
        }
    };

    if (status === 'success') {
        return (
            <div
                className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="flex justify-center mb-4 text-green-600">
                    <CheckCircle2 size={48}/>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                    We've sent a password reset link to <span
                    className="font-bold text-gray-800">{getValues("email")}</span>.
                    Please check your inbox and spam folder.
                </p>
                <Link
                    to={PATHS.LOGIN}
                    className="inline-block w-full bg-[#7A1014] text-white font-bold py-3 rounded-md hover:bg-red-900 transition-colors shadow-sm"
                >
                    Return to Login
                </Link>
            </div>
        );
    }

    //TODO: i18n
    return (
        <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-sm text-gray-500 mb-8">
                Enter your email address and we'll send you a link to securely reset your password.
            </p>

            {status === 'error' && (
                <div
                    className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0"/>
                    <span>{apiError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
                <div className="mb-8">
                    <label htmlFor="email"
                           className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                            <Mail size={18}/>
                        </div>
                        <input
                            id="email"
                            type="text"
                            placeholder="E.g. Jan_Kowalski@edu.p.lodz.pl"
                            {...register("email")}
                            className={`w-full border-b py-2 pl-8 focus:outline-none transition-colors bg-transparent text-sm text-gray-800 disabled:opacity-50
                                ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#7A1014]'}`}
                            disabled={status === 'loading'}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                <SubmitButton
                    type="submit"
                    isLoading={status === 'loading'}
                >
                    Send Reset Link
                </SubmitButton>
            </form>

            <div className="mt-8 text-center max-w-sm">
                <LinkButton to={PATHS.LOGIN} variant="ghost">
                    <ArrowLeft size={16} className="mr-2"/>
                    Back to Login
                </LinkButton>
            </div>
        </div>
    );
}