import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth, type JwtPayload } from "../../../hooks/useAuth";

const WARNING_TIME = 60 * 1000; // 60s przed

export const SessionExpirationModal = () => {
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
        <div>
        </div>
    );
};