import apiClient from "./apiClient";

const getUsers = async () => {
    const res = await apiClient.get("/admin/users");
    return res.data;
};

export default {
    getUsers,
}