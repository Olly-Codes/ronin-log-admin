import { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/authAPI";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const userData = await authAPI.login(email, password);
        localStorage.setItem("token", userData.token);
        setUser({ token: userData.token });
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);