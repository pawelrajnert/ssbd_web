import {Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Globe, Moon, Sun, Factory} from "lucide-react";
import {useTheme} from "../../hooks/useTheme.ts";

export default function AuthLayout() {
    const {t, i18n} = useTranslation();
    const {theme, setTheme} = useTheme();

    return (
        <div className="flex min-h-screen bg-base relative transition-colors duration-300">

            <div className="absolute top-6 right-8 z-10 flex items-center gap-4">
                <div className="flex items-center bg-base border border-border rounded-lg p-1 h-10 shadow-sm">
                    <button onClick={() => setTheme('light')}
                            className={`flex items-center justify-center gap-2 h-full px-3 text-sm font-semibold rounded-md transition-all ${theme === 'light' ? 'bg-surface shadow-sm text-primary border border-border' : 'text-secondary hover:text-primary'}`}
                    >
                        <Sun size={16}/> Light
                    </button>
                    <button onClick={() => setTheme('dark')}
                            className={`flex items-center justify-center gap-2 h-full px-3 text-sm font-semibold rounded-md transition-all ${theme === 'dark' ? 'bg-surface shadow-sm text-primary border border-border' : 'text-secondary hover:text-primary'}`}
                    >
                        <Moon size={16}/> Dark
                    </button>
                </div>

                <div className="relative flex items-center group bg-base border border-border hover:border-brand rounded-lg h-10 pl-3 pr-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-brand/20">
                    <Globe size={16} className="text-secondary group-hover:text-brand transition-colors shrink-0"/>

                    <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="bg-transparent text-sm font-bold text-primary outline-none cursor-pointer appearance-none pl-2 pr-6 h-full w-full dark:bg-base"
                    >
                        <option value="en">EN</option>
                        <option value="pl">PL</option>
                        <option value="uk">UK</option>
                    </select>

                    <div className="absolute right-2 pointer-events-none text-secondary group-hover:text-brand transition-colors h-full flex items-center">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                </div>

            </div>

            <div className="hidden md:flex md:w-1/3 bg-[#7A1014] text-white p-12 flex-col justify-between">
                <div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight whitespace-pre-line">
                        {t('auth.title')}
                    </h1>
                    <p className="text-white/80 text-lg max-w-md">
                        {t('auth.subtitle')}
                    </p>
                </div>

                <div className="flex items-center gap-4 opacity-80">
                    <div className="w-8 h-8 bg-white/20 rounded flex items-center">
                       <Factory className="ml-1"/>
                    </div>
                    <p className="text-sm font-semibold tracking-widest uppercase">
                        {t('auth.founded')}
                    </p>
                </div>
            </div>

            <div className="w-full md:w-2/3 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}