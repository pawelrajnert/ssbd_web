import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function AuthLayout() {
    const { t, i18n } = useTranslation();

    return (
        <div className="flex min-h-screen bg-white relative">

            <div className="absolute top-6 right-8 z-10">
                <div className="relative flex items-center gap-2 group bg-gray-50/80 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors border border-gray-100">
                    <Globe size={18} className="text-gray-400 group-hover:text-[#7A1014] transition-colors" />
                    <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer hover:text-[#7A1014] transition-colors appearance-none pr-2"
                    >
                        <option value="en">EN</option>
                        <option value="pl">PL</option>
                        <option value="uk">UK</option>
                    </select>
                    <div className="pointer-events-none text-gray-400 group-hover:text-[#7A1014]">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex md:w-1/3 bg-[#7A1014] text-white p-12 flex-col justify-between">
                <div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight whitespace-pre-line">
                        {t('auth.title')}
                    </h1>
                    <p className="text-red-200 text-lg max-w-md">
                        {t('auth.subtitle')}
                    </p>
                </div>

                <div className="flex items-center gap-4 opacity-80">
                    <div className="w-8 h-8 bg-white/20 rounded">
                        {/* TODO: dodać ikonkę fabryki */}
                    </div>
                    <p className="text-sm font-semibold tracking-widest uppercase">
                        {t('auth.founded')}
                    </p>
                </div>
            </div>

            <div className="w-full md:w-2/3 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}