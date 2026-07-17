import apiClient from "./apiClient";

const getDemographics = async () => {
    const res = await apiClient.get("/demographics");
    return res.data;
};

export default {
    getDemographics,
}