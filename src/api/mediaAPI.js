import apiClient from "./apiClient";

const getMediaTypes = async () => {
    const res = await apiClient.get("/media-types");
    return res.data;
};

export default {
    getMediaTypes,
}