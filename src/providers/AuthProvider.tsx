import {createContext, type ReactNode, useMemo, useState} from "react";
import { jwtDecode } from "jwt-decode";
import type {AuthContextType, JwtPayload} from "../hooks/useAuth.ts";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
    const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem("refresh_token"));

    const { userRole, userLogin } = useMemo(() => {
        if (token && token !== "undefined" && token !== "null") {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                return { userRole: decoded.role, userLogin: decoded.sub };
            } catch (e) {
                console.error("JWT Decode Error:", e);
                return { userRole: null, userLogin: null };
            }
        }
        return { userRole: null, userLogin: null };
    }, [token]);

    const setTokens = (accessToken: string | null, rToken: string | null) => {
        if (accessToken) {
            sessionStorage.setItem('access_token', accessToken);
        } else {
            sessionStorage.removeItem('access_token');
        }
        setToken(accessToken);

        //TODO: Zastanowić się czy nie przechowywać refresh token w cookies, task najprawdopodobniej dla Karola :)
        if (rToken) {
            sessionStorage.setItem('refresh_token', rToken);
        } else {
            sessionStorage.removeItem('refresh_token');
        }
        setRefreshToken(rToken);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setRefreshToken(null);
    };

    const contextValue = useMemo(() => ({
        token,
        refreshToken,
        setTokens,
        userRole,
        userLogin,
        isAuthenticated: !!token,
        logout,
    }), [token, refreshToken, userRole, userLogin]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};


export default AuthProvider;