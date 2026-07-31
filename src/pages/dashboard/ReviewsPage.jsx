import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { capatilize } from "../../utils/capitilizeText";
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
                <h1 className="text-2xl font-bold text-primary">Reviews</h1>
                <button 
                    type="button" 
                    onClick={() => navigate("new")}
                    className="bg-accent text-white font-semibold py-2 px-4 hover:bg-accent-hover transition-colors duration-300 cursor-pointer"
                    >
                        New Review
                    </button>
            </div>

            {loadingReviews ? (
                <p className="bg-surface border border-border p-8 text-muted text-sm">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <div className="bg-surface border border-border p-8 text-center">
                    <p className="text-primary font-medium mb-1">No reviews yet</p>
                    <p className="text-muted text-sm mb-4">Get started by writing your first review</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="bg-surface border border-border p-4 flex flex-col justify-between"
                        >
                            <div>
                                <div className="aspect-[16/9] bg-surface-hover overflow-hidden text-primary">
                                    {review.cover_image_url ? (
                                        <img 
                                            src={review.cover_image_url}
                                            alt={review.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-surface-hover flex items-center justify-center text-muted">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h2 className="font-semibold text-primary">{review.title}</h2>
                                        {review.published ? (
                                            <span className="text-success font-medium text-sm shrink-0 ml-2">Published</span>
                                        ) : (
                                            <span className="text-muted font-semibold text-sm">Draft</span>
                                        )}
                                    </div>

                                    <p className="text-muted text-sm mb-1">{capatilize(review.media_type)} &bull; {capatilize(review.demographic)}</p>
                                    <p className="text-muted text-sm mb-4">Score: <span className="font-semibold text-primary">{review.score}</span></p>
                                </div>
                            </div>
                            

                            <div className="flex gap-2 pt-2 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => navigate(`${review.review_id}`)}
                                    className="flex-1 text-sm font-medium text-muted hover:text-primary py-1"
                                >
                                    View
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(`${review.review_id}/edit`)}
                                    className="flex-1 text-sm font-medium text-muted hover:text-primary"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(review.review_id)}
                                    className="flex-1 text-sm font-medium text-accent hover:text-accent-hover"
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