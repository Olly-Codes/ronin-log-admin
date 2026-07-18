import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import reviewsAPI from "../../api/reviewsAPI";

const ReviewsPage = () => {

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchReviews = async () => {

            try {
                const reviews = await reviewsAPI.getReviews();
                setReviews(reviews.reviews);
                setLoadingReviews(false);
            } catch (err) {
                console.log(err);
            }
        };

        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        setError("");

        try {
            await reviewsAPI.deleteReview(id);
            setReviews((prev) => prev.filter((r) => r.review_id !== id));
        } catch (err) {
            setError("Could not delete review");
        }
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
                                        <button type="button">Edit</button>
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