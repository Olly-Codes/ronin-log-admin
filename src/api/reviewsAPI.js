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

const getReviewById = async (id) => {
    const res = await apiClient.get(`/admin/reviews/${id}`);
    return res.data;
};

const postCreateReview = async (reviewData) => {
    const res = await apiClient.post("/reviews", reviewData);
    return res.data;
};

const deleteReview = async (id) => {
    const res = await apiClient.delete(`/reviews/${id}`);
    return res.data;
};

export default {
    getReviews,
    getReviewsCount,
    getPublishedReviewsCount,
    getunPublishedReviewsCount,
    getSortedReviews,
    getReviewById,
    postCreateReview,
    deleteReview
}