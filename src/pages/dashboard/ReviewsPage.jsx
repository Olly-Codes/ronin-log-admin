import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import reviewsAPI from "../../api/reviewsAPI";
import LoadingError from "../../components/LoadingError";

const ReviewsPage = () => {

    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [error, setError] = useState(false);

    const fetchReviews = async () => {
        setLoadingReviews(true);
        setError(false);

        try {
            const reviews = await reviewsAPI.getReviews();
            setReviews(reviews.reviews);
            setLoadingReviews(false);
        } catch (err) {
            console.error(err);
            setError(true);
            setLoadingReviews(false);
            toast.error("Failed to load data. Please try again");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        try {
            await reviewsAPI.deleteReview(id);
            toast.success("Review deleted successfully");
            setReviews((prev) => prev.filter((r) => r.review_id !== id));
        } catch (err) {
            toast.error("Could not delete review");
        }
    };

    if (error && !loadingReviews) {
        return (
            <LoadingError
                title={"Reviews"}
                errorMessage={"Could not load reviews"}
                fetchData={fetchReviews}
            />
        );
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                <button 
                    type="button" 
                    onClick={() => navigate("new")}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 cursor-pointer"
                    >
                        New Review
                    </button>
            </div>

            {loadingReviews ? (
                <p className="text-gray-500 text-sm">Loading reviews...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between"
                        >
                            <div>
                                <div className="aspect-[16/9] bg-gray-200 overflow-hidden">
                                    {review.cover_image_url ? (
                                        <img 
                                            src={review.cover_image_url}
                                            alt={review.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h2 className="font-semibold text-gray-900">{review.title}</h2>
                                        {review.published ? (
                                            <span className="text-green-600 font-medium text-sm shrink-0 ml-2">Published</span>
                                        ) : (
                                            <span className="text-gray-500 font-semibold text-sm">Draft</span>
                                        )}
                                    </div>

                                    <p className="text-gray-600 text-sm mb-1">{review.media_type} &bull; {review.demographic}</p>
                                    <p className="text-gray-600 text-sm mb-4">Score: <span className="font-semibold text-gray-900">{review.score}</span></p>
                                </div>
                            </div>
                            

                            <div className="flex gap-2 pt-2 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate(`${review.review_id}`)}
                                    className="flex-1 text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
                                >
                                    View
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(`${review.review_id}/edit`)}
                                    className="flex-1 text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(review.review_id)}
                                    className="flex-1 text-sm font-medium text-gray-600 hover:text-red-900 py-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
};

export default ReviewsPage;