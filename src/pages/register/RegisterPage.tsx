import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { User, Mail, Lock, CheckSquare, Square, IdCard, MailCheck } from "lucide-react";
import { PATHS } from "../../routes/paths.ts";
import axiosInstance from "../../api/auth/middleware.ts";

export default function RegisterPage() {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        login: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // NOWY STAN

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!termsAccepted) {
            setError("You must accept the terms and conditions.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post("/account/register", formData);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data || "An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center text-center w-full px-4 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-red-50 text-[#7A1014] rounded-full flex items-center justify-center mb-6">
                    <MailCheck size={32} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                    {t('auth.register.successHeading')}
                </h2>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {t('auth.register.successText')}
                </p>
                <p className="text-xs text-gray-400 mb-8 italic">
                    {t('auth.register.spamNote')}
                </p>
                <Link
                    to={PATHS.LOGIN}
                    className="w-full py-3 bg-[#8a151b] hover:bg-[#6b1014] text-white text-xs font-bold tracking-widest uppercase transition-colors block text-center"
                >
                    {t('auth.register.backToLogin')}
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full px-4">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {t('auth.register.heading')}
            </h2>
            <p className="text-sm text-gray-500 mb-8">
                {t('auth.register.subheading')}
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-[#7A1014] text-sm rounded-md border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                            {t('auth.register.firstName')}
                        </label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                            <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Jan"
                                className="w-full pl-8 py-1 outline-none text-sm text-gray-800 bg-transparent"
                                required
                                minLength={3}
                            />
                        </div>
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                            {t('auth.register.lastName')}
                        </label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Kowalski"
                                className="w-full pl-2 py-1 outline-none text-sm text-gray-800 bg-transparent"
                                required
                                minLength={3}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                        {t('auth.register.login')}
                    </label>
                    <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                        <IdCard className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            placeholder="jkowalski"
                            className="w-full pl-8 py-1 outline-none text-sm text-gray-800 bg-transparent"
                            required
                            minLength={3}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                        {t('auth.register.email')}
                    </label>
                    <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@p.lodz.pl"
                            className="w-full pl-8 py-1 outline-none text-sm text-gray-800 bg-transparent"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                            {t('auth.register.password')}
                        </label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                className="w-full pl-8 py-1 outline-none text-sm text-gray-800 bg-transparent"
                                required
                                minLength={8}
                                pattern="^(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$"
                                title="Minimum 8 characters, 1 uppercase, 1 symbol"
                            />
                        </div>
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
                            {t('auth.register.confirmPassword')}
                        </label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#7A1014] transition-colors pb-1">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                className="w-full pl-8 py-1 outline-none text-sm text-gray-800 bg-transparent"
                                required
                                minLength={8}
                                pattern="^(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$"
                            />
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-gray-400 -mt-4">
                    {t('auth.register.passwordHelper')}
                </p>

                <div
                    className="flex items-start gap-3 mt-6 cursor-pointer"
                    onClick={() => setTermsAccepted(!termsAccepted)}
                >
                    <div className="mt-0.5 text-red-800">
                        {termsAccepted ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-300" />}
                    </div>
                    <p className="text-xs text-gray-600 leading-tight select-none">
                        {t('auth.register.terms')}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-8 bg-[#8a151b] hover:bg-[#6b1014] text-white text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                    {isLoading ? "Processing..." : t('auth.register.button')}
                </button>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        {t('auth.register.haveAccount')}{' '}
                        <Link to={PATHS.LOGIN} className="text-[#8a151b] font-bold tracking-wider uppercase hover:underline">
                            {t('auth.register.loginLink')}
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}