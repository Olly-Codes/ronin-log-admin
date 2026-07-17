import apiClient from "./apiClient";

const getGenres = async () => {
    const res = await apiClient.get("/genres");
    return res.data;
};

export default {
    getGenres,
}