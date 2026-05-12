import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth, type JwtPayload } from "../../../hooks/useAuth";
import { useTranslation } from "react-i18next";

const WARNING_TIME = 60 * 1000; // 60s przed

export const SessionExpirationModal = () => {
    const { t } = useTranslation();
    const { token, extendSession, logout, isAuthenticated } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            setShowModal(false);
            return;
        }

        const checkExpiration = () => {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                if (!decoded.exp) return;

                const expirationTime = decoded.exp * 1000;
                const currentTime = Date.now();
                const timeRemaining = expirationTime - currentTime;

                if (timeRemaining <= 0) {
                    logout();
                    setShowModal(false);
                } else if (timeRemaining <= WARNING_TIME) {
                    setShowModal(true);
                    setTimeLeft(Math.floor(timeRemaining / 1000));
                } else {
                    setShowModal(false);
                }
            } catch (error) {
                console.error("Error decoding token for expiration check", error);
            }
        };

        const interval = setInterval(checkExpiration, 1000);
        checkExpiration();

        return () => clearInterval(interval);
    }, [token, isAuthenticated, logout]);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[9999] transition-opacity animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all flex flex-col items-center text-center animate-in zoom-in-95 duration-300">

                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-100">
                    <svg
                        className="w-8 h-8 text-[#7A1014]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {t("sessionModal.title")}
                </h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    {t("sessionModal.desc1")}
                    <strong className="text-[#7A1014] font-bold text-lg">{timeLeft}</strong>
                    {t("sessionModal.desc2")}
                </p>

                <div className="flex w-full gap-3 sm:flex-row flex-col-reverse">
                    <button
                        onClick={logout}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors focus:ring-2 focus:ring-gray-200 outline-none"
                    >
                        {t("sessionModal.logout")}
                    </button>
                    <button
                        onClick={extendSession}
                        className="flex-1 px-4 py-2.5 bg-[#7A1014] text-white font-bold rounded-md hover:bg-red-900 transition-colors shadow-sm focus:ring-2 focus:ring-red-200 outline-none"
                    >
                        {t("sessionModal.extend")}
                    </button>
                </div>
            </div>
        </div>
    );
};