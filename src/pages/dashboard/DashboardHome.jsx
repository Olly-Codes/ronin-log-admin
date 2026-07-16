import { useEffect, useState } from "react";
import reviewsAPI from "../../api/reviewsAPI";
import commentsAPI from "../../api/commentsAPI";

const DashboardHome = () => {

    const [totalReviews, setTotalReviews] = useState(0);
    const [totalPublished, setTotalPublished] = useState(0);
    const [totalUnpublished, setTotalUnpublished] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [loadingCounts, setLoadingCounts] = useState(true);

    useEffect(() => {

        const fetchAllCounts = async () => {

            try {
                const [reviewsCount, publishedCount, unPublishedCount, commentsCount] = await Promise.all([
                    reviewsAPI.getReviewsCount(),
                    reviewsAPI.getPublishedReviewsCount(),
                    reviewsAPI.getunPublishedReviewsCount(),
                    commentsAPI.getCommentsCount()
                ]);

                setTotalReviews(reviewsCount.reviewsCount.count);
                setTotalPublished(publishedCount.published.count);
                setTotalUnpublished(unPublishedCount.unpublished.count);
                setTotalComments(commentsCount.commentsCount.count);

                setLoadingCounts(false);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAllCounts()
    }, []);

    return (
        <section className="dashboard-home-content">
            <h1>Overview</h1>
            <div className="overview-counts-wrapper">
                {loadingCounts ? 
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
        </section>
    )
};

export default DashboardHome;