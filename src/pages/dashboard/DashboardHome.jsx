import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import reviewsAPI from "../../api/reviewsAPI";
import commentsAPI from "../../api/commentsAPI";
import LoadingError from "../../components/LoadingError";


const DashboardHome = () => {

    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPublished, setTotalPublished] = useState(0);
    const [totalUnpublished, setTotalUnpublished] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        setLoadingData(true);
        setError(false);

        try {
            
            const [
                reviewsCount, 
                publishedCount, 
                unPublishedCount, 
                commentsCount,
                sortedReviews
            ] = await Promise.all([
                reviewsAPI.getReviewsCount(),
                reviewsAPI.getPublishedReviewsCount(),
                reviewsAPI.getunPublishedReviewsCount(),
                commentsAPI.getCommentsCount(),
                reviewsAPI.getSortedReviews("DESC")
            ]);

            setTotalReviews(reviewsCount.reviewsCount.count);
            setTotalPublished(publishedCount.published.count);
            setTotalUnpublished(unPublishedCount.unpublished.count);
            setTotalComments(commentsCount.commentsCount.count);
            setSortedReviews(sortedReviews.sortedReviews);

            setLoadingData(false);
        } catch (err) {
            console.error(err);
            setError(true);
            setLoadingData(false);
            toast.error("Failed to load data. Please try again");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (error && !loadingData) {
        return (
            <LoadingError
                title={"Dashboard"}
                errorMessage={"Could not load dashboard metrics"}
                fetchData={fetchData}
            />
        );
    };

    return (
        <section className="dashboard-home-content">
            <div className="heading-wrapper">
                <h1>Dashboard</h1>
            </div>
            <div className="overview-counts-wrapper">
                {loadingData ? 
                    (<p>Loading counts...</p>) : 
                    (
                        <div>
                            <p>Total Reviews: {totalReviews}</p>
                            <p>Published: {totalPublished}</p>
                            <p>Drafts: {totalUnpublished}</p>
                            <p>Total Comments: {totalComments}</p>
                        </div>
                    )
                }
            </div>

            <div className="recent-content-wrapper">
                <div className="recent-reviews">
                    <h2>Recent Reviews</h2>
                        {loadingData ? (
                            <p>Loading reviews...</p>
                        ) : (
                            <ul>
                                {sortedReviews.map((review) => (
                                    <li key={review.review_id}>
                                        <p>{review.title}</p>
                                        <p>{review.published ? "Published" : "Draft"}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                </div>
            </div>
        </section>
    )
};

export default DashboardHome;