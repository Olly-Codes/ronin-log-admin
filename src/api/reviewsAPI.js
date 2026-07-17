import apiClient from "./apiClient";

const getReviews = async () => {
    const res = await apiClient.get("/admin/reviews");
    return res.data;
};

const getReviewsCount = async () => {
    const res = await apiClient.get("/admin/reviews?countOnly=true");
    return res.data;
};

const getPublishedReviewsCount = async () => {
    const res = await apiClient.get("/admin/reviews?publishedCount=true");
    return res.data;
};

const getunPublishedReviewsCount = async () => {
    const res = await apiClient.get("/admin/reviews?unpublishedCount=true");
    return res.data;
};

const getSortedReviews = async (sort) => {
    const res = await apiClient.get(`/admin/reviews?sort=${sort}`);
    return res.data;
};

export default {
    getReviews,
    getReviewsCount,
    getPublishedReviewsCount,
    getunPublishedReviewsCount,
    getSortedReviews
}