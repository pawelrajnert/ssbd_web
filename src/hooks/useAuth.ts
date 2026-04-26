import { createContext, useContext } from "react";

export interface JwtPayload {
    sub: string;
    role: string;
    exp: number;
}

export interface AuthContextType {
    token: string | null;
    refreshToken: string | null;
    setTokens: (accessToken: string | null, refreshToken: string | null) => void;
    userRole: string | null;
    userLogin: string | null;
    isAuthenticated: boolean;
    logout: () => void;
}

// 1. Create the Context
export const AuthContext = createContext<AuthContextType | null>(null);

// 2. Export the Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};