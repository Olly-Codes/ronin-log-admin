import { useEffect, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import reviewsAPI from "../../api/reviewsAPI";
import commentsAPI from "../../api/commentsAPI";
import LoadingError from "../../components/LoadingError";

const ReviewDetailsPage = () => {

    const { id } = useParams();
    const [review, setReview] = useState([]);
    const [comments, setComments] = useState([]);
    const [loadingReview, setLoadingReview] = useState(true);
    const [error, setError] = useState(false);

    const fetchReview = async () => {
        setLoadingReview(true);
        setError(false);

        try {
            const reviewData = await reviewsAPI.getReviewById(id);
            setReview(reviewData.review);
            setComments(reviewData.comments);

            setLoadingReview(false);
        } catch (err) {
            console.error(err);
            setError(true);
            setLoadingReview(false);
            toast.error("Could not load review data. Please try again");
        }
    };

    useEffect(() => {
        fetchReview();
    }, [id]);

    const handleDelete = async (id) => {

        try {
            await commentsAPI.deleteComment(id);
            toast.success("Comment deleted succeffully");
            setComments((prev) => prev.filter((c) => c.comment_id !== id));
        } catch (err) {
            toast.error("Could not delete comment");
        }
    };

    if (loadingReview) return <p>Loading review...</p>

    if (error && !loadingReview) {
        return (
            <LoadingError
                title={"Error"}
                errorMessage={"Could not load review data. Please try again"}
                fetchData={fetchReview}
            />
        );
    };

    return (
        <section className="review-detail-content">
            <div className="review-img-wrapper">
                <img src={review.cover_image_url} alt={review.title} />
            </div>
            <div className="review-heading-wrapper">
                <p>{review.media_type} &bull; {review.demographic} &bull; {review.published ? "Published" : "Draft"}</p>
                <h1>{review.title}</h1>
                <p>Reviewed on {review.created_at}</p>
            </div>
            <div className="review-body-wrapper">
                <Markdown>{review.body}</Markdown>
            </div>
            <div className="review-extra-details-wrapper">
                <div className="review-score-wrapper">
                    <p>Score</p>
                    <p>{review.score}</p>
                </div>
                <div className="review-genres-wrapper">
                    <p>Genres</p>
                    <ul>
                        {review.genres.map((genre) => (
                            <li key={genre}>{genre}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="revire-comments-section">
                <h2>Comments ({comments.length})</h2>
                {comments.length > 0 ? (
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.comment_id}>
                                <p>{comment.content}</p>
                                <p>{comment.username}</p>
                                <button 
                                    type="button"
                                    onClick={() => handleDelete(comment.comment_id)}    
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No comments yet,</p>
                )}
            </div>
        </section>
    );
};

export default ReviewDetailsPage;