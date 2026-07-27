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
        <section className="reviews-content">
            <div className="heading-wrapper">
                <h1>Reviews</h1>
                <button type="button" onClick={() => navigate("new")}>New Review</button>
            </div>
            {loadingReviews ? (
                <p>Loading reviews...</p>
            ) : (
                <div>
                    {error && <p>{error}</p>}
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Media Type</th>
                                <th>Demographic</th>
                                <th>Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review.review_id}>
                                    <td>{review.title}</td>
                                    <td>{review.media_type}</td>
                                    <td>{review.demographic}</td>
                                    <td>{review.score}</td>
                                    <td>{review.published ? "Published" : "Draft"}</td>
                                    <td>
                                        <button 
                                            type="button"
                                            onClick={() => navigate(`${review.review_id}`)}
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            type="button"
                                            onClick={() => navigate(`${review.review_id}/edit`)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            type="button"
                                            onClick={() => handleDelete(review.review_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
};

export default ReviewsPage;