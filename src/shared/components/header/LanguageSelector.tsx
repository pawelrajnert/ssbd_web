import { useTranslation } from 'react-i18next';
import {changeLanguage} from "../../../services/accountService.ts";

export const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = async (newLangCode: string) => {
        try {
            await i18n.changeLanguage(newLangCode);

            if (sessionStorage.getItem('access_token')) {
                await changeLanguage(newLangCode);
            }
        } catch (error) {
            console.error("Failed to sync language with the backend", error);
        }
    };

    return (
        <div className="relative inline-block w-36">
            <select
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-primary border-b border-border py-2 outline-none cursor-pointer hover:border-brand transition-colors appearance-none dark:bg-surface"
            >
                <option value="en">🇺🇸 English (US)</option>
                <option value="pl">🇵🇱 Polish (PL)</option>
                <option value="uk">🇺🇦 Ukrainian (UK)</option>
            </select>

            {/* Custom arrow to replace the default one hidden by `appearance-none` */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};