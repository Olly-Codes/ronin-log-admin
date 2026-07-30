import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import commentsAPI from "../../api/commentsAPI";
import LoadingError from "../../components/LoadingError";

const CommentsPage = () => {

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [error, setError] = useState(false);

    const fetchComments = async () => {
        setLoadingComments(true);
        setError(false);

        try {
            const comments = await commentsAPI.getComments();
            setComments(comments.comments);
            setLoadingComments(false);
        } catch (err) {
            console.log(err);
            setError(true);
            setLoadingComments(false);
            toast.error("Failed to load comments. Please try again");
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDelete = async (id) => {

        try {
            await commentsAPI.deleteComment(id);
            toast.success("Comment deleted successfully");
            setComments((prev) => prev.filter((c) => c.comment_id !== id));
        } catch (err) {
            console.log(err);
            toast.error("Could not delete comment");
        }
    };

    if (error && !loadingComments) {
        return (
            <LoadingError
                title={"Comments"}
                errorMessage={"Could not load comments"}
                fetchData={fetchComments}
            />
        );
    };

    return (
        <section>
            <h1 className="text-2xl font-bold text-primary mb-6">Comments</h1>
            <div className="bg-surface border border-border p-4">
                {loadingComments ? (
                    <p className="text-muted text-sm">Loading Comments...</p>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {comments.map((comment) => (
                            <div 
                                key={comment.comment_id}
                                className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                            >
                                <div>
                                    <p className="text-xs text-muted mb-1">{comment.created_at}</p>
                                    <p className="text-sm text-primary mb-1">{comment.content}</p>
                                    <p className="text-sm text-muted">
                                        Made by <span className="font-medium text-primary">{comment.username}</span> in {"" }
                                        <span className="font-medium text-primary">{comment.title}</span>
                                    </p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleDelete(comment.comment_id)}
                                    className="px-2 ml-4 cursor-pointer bg-red-600 text-white font-semibold py-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
};

export default CommentsPage;