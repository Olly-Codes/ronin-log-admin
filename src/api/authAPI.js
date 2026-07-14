import apiClient from "./apiClient";

const login = async (email, password) => {
    const res = await apiClient.post(
        "/auth/login",
        { email, password },
        { skipAuthRedirect: true }
    );
    return res.data;
};

const logout = () => {
    localStorage.removeItem("token");
};

export default {
    login,
    logout
}