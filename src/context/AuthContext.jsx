import { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/authAPI";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser({ ...JSON.parse(storedUser), token});
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const userData = await authAPI.login(email, password);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify({
            id: userData.id,
            username: userData.username,
            role: userData.role
        }));
        setUser({
            id: userData.id,
            username: userData.username,
            role: userData.role
        });
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