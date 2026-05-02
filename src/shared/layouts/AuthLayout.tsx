import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next"

export default function AuthLayout() {
    const { t } = useTranslation();
    return (
        <div className="flex min-h-screen bg-white relative">
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