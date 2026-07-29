import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import reviewsAPI from "../../api/reviewsAPI";
import commentsAPI from "../../api/commentsAPI";
import LoadingError from "../../components/LoadingError";
import bannerImg from "../../Assets/illustrations/undraw_banner.svg";


const DashboardHome = () => {

    const { user } = useAuth();

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
        <section className="grid grid-cols-[minmax(0,1fr)_minmax(240px,300px)] gap-8">
            <div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between overflow-hidden">
                    <div className="flex-1">
                        <h1>Welcome Back, <span className="font-bold">{user.username}</span>!</h1>
                        {totalUnpublished > 0 ? (
                            <>
                                <p className="text-gray-600 mb-4">You have {totalUnpublished} draft{totalUnpublished !== 1 ? 's' : ''} waiting to be published.</p>
                                <button className="p-4 bg-red-600 text-white font-semibold py-2 rounded-md cursor-pointer hover:bg-red-700 transition-colors duration-300">
                                    View Reviews
                                </button>
                            </>
                        ) : (
                            <>
                                <p>You are all caught up. You can start a new review at any time.</p>
                                <button className="p-4 bg-red-600 text-white font-semibold py-2 rounded-md cursor-pointer hover:bg-red-700 transition-colors duration-300">
                                    Write a Review
                                </button>
                            </>
                        )}
                    </div>
                    <img src={bannerImg} alt="Banner" className="hidden sm:block w-60 shrink-0" />
                    
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                    {loadingData ? (
                        <p className="text-gray-500 text-sm">Loading reviews...</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="text-sm font-medium text-left text-gray-500 px-4 py-2">Title</th>
                                        <th className="text-sm font-medium text-left text-gray-500 px-4 py-2">Updated on</th>
                                        <th className="text-sm font-medium text-left text-gray-500 px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedReviews.map((review) => (
                                        <tr key={review.review_id} className="border-t border-gray-200">
                                            <td className="px-4 py-2">{review.title}</td>
                                            <td className="px-4 py-2">{review.updated_at}</td>
                                            <td className=" px-4 py-2">
                                                {review.published ? (
                                                    <span className="text-sm font-medium text-green-600">Published</span>
                                                ) : (
                                                    <span className="text-sm font-medium text-gray-500">Draft</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    }
                </div>
            </div>

            <div>
                {loadingData ? 
                    (<p className="text-gray-500 text-sm">Loading stats...</p>) : 
                    (
                        <div className="grid grid-rows-4 gap-4 mb-8">
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
            </div>
        </section>
    )
};

export default DashboardHome;