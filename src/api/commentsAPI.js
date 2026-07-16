import apiClient from "./apiClient";

const getCommentsCount = async () => {
    const res = await apiClient.get("/comments?countOnly=true");
    return res.data;
};

export default {
    getCommentsCount
}