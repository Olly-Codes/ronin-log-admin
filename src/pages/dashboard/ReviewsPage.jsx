import { useEffect, useState } from "react";
import reviewsAPI from "../../api/reviewsAPI";

const ReviewsPage = () => {

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

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

    return (
        <section className="reviews-content">
            <div className="heading-wrapper">
                <h1>Reviews</h1>
                <button type="button">New Review</button>
            </div>
            {loadingReviews ? (
                <p>Loading reviews...</p>
            ) : (
                <div>
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
                                        <button>Edit</button>
                                    </td>
                                    <td>
                                        <button>Delete</button>
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