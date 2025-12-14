import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "./api";

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const checkUser = async (token: string) => {
        try {
            const response = await api.api.auth.me.get({
                headers: { authorization: `Bearer ${token}` }
            });

            const data = response.data as { success: boolean; userId?: number; error?: string } | null;

            if (data && data.success && data.userId) {
                setUser({ id: data.userId, email: 'User' });
            } else {
                logout();
            }
        } catch {
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (token: string) => {
        localStorage.setItem('token', token);
        await checkUser(token);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkUser(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}