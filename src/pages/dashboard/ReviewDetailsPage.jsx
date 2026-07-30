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

    if (loadingReview) return <p className="bg-surface border border-border p-8 text-muted text-sm">Loading review...</p>

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
        <section>
            <div className="aspect-[21/9] bg-surface-hover overflow-hidden mb-4 text-primary">
                {review.cover_image_url ? (
                    <img
                        src={review.cover_image_url}
                        alt={review.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-surface-hover flex items-center justify-center">
                        No Image
                    </div>
                )}
                
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] gap-4">
                <div className="bg-surface border border-border p-4">
                    <p className="text-sm text-muted mb-1">
                        {review.media_type} &bull; {review.demographic} &bull;{" "}
                        {review.published ? (
                            <span className="text-green-600 font-medium">Published</span>
                        ) : (
                            <span className="text-gray-500 font-medium">Draft</span>
                        )}
                    </p>
                    <h1 className="text-2xl font-bold text-primary">{review.title}</h1>
                    <p className="text-sm text-muted mt-1 mb-4">Reviewed on {review.created_at}</p>

                    <div className="text-primary">
                        <Markdown>{review.body}</Markdown>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <h2 className="text-lg font-semibold text-primary mb-4">Comments ({comments.length})</h2>
                        {comments.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {comments.map((comment) => (
                                    <li key={comment.comment_id} className="py-3 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-primary">{comment.content}</p>
                                            <p className="text-sm text-muted">made by {comment.username}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(comment.comment_id)}
                                            className="px-2 ml-4 cursor-pointer bg-red-600 text-white font-semibold py-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted text-sm">No comments yet.</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-surface border border-border p-4">
                        <h2 className="text-sm text-muted mb-1">Score</h2>
                        <p className="text-2xl font-bold text-primary">{review.score}</p>
                    </div>

                    <div className="bg-surface border border-border p-4">
                        <h2 className="text-sm text-muted mb-2">Genres</h2>
                        <div className="flex flex-wrap gap-2">
                            {review.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="text-sm font-medium bg-red-600 text-white px-3 py-1"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewDetailsPage;