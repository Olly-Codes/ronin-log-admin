import { useEffect, useState } from "react";
import reviewsAPI from "../../api/reviewsAPI";
import commentsAPI from "../../api/commentsAPI";

const DashboardHome = () => {

    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPublished, setTotalPublished] = useState(0);
    const [totalUnpublished, setTotalUnpublished] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [sortedReviews, setSortedReviews] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

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
            }
        };

        fetchData()
    }, []);

    return (
        <section className="dashboard-home-content">
            <h1>Dashboard</h1>
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