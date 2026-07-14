import apiClient from "./apiClient";

const getReviews = async () => {
    const res = await apiClient.get("/admin/reviews");
    return res.data;
};

export default {
    getReviews
}