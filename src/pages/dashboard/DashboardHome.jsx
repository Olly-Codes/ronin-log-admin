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

    const stats = [
        { label: "Total Reviews", value: totalReviews },
        { label: "Published", value: totalPublished },
        { label: "Drafts", value: totalUnpublished },
        { label: "Total Comments", value: totalComments }
    ];

    return (
        <section>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {loadingData ? 
                (<p className="text-gray-500 text-sm">Loading stats...</p>) : 
                (
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {stats.map((stat) => (
                            <div 
                                key={stat.label}
                                className="bg-white border border-gray-200 rounded-lg p-4"
                            >
                                <h2 className="text-sm text-gray-500 mb-1">{stat.label}</h2>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )
            }

            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                {loadingData ? (
                    <p className="text-gray-500 text-sm">Loading reviews...</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {sortedReviews.map((review) => (
                                <li 
                                    key={review.review_id}
                                    className="flex items-center justify-between py-4"
                                >
                                    <p className="text-sm font-medium">{review.title}</p>
                                    {review.published ? (
                                        <span className="text-sm font-medium text-green-600">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-gray-500">
                                            Draft
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )
                }
            </div>
        </section>
    )
};

export default DashboardHome;