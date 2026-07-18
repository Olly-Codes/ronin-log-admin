import apiClient from "./apiClient";

const getComments = async () => {
    const res = await apiClient.get("/comments");
    return res.data;
};

const getCommentsCount = async () => {
    const res = await apiClient.get("/comments?countOnly=true");
    return res.data;
};

const deleteComment = async (id) => {
    const res = await apiClient.delete(`/comments/${id}`);
    return res.data;
};

export default {
    getComments,
    getCommentsCount,
    deleteComment
}