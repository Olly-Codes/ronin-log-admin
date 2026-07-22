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
        <section className="comments-content">
            <div className="heading-wrapper">
                <h1>Comments</h1>
            </div>
            <div className="comments-wrapper">
                {error && <p>{error}</p>}
                {loadingComments ? (
                    <p>Loading Comments...</p>
                ) : (
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.comment_id}>
                                <p>{comment.created_at}</p>
                                <p>{comment.content}</p>
                                <p>Made by {comment.username} in {comment.title}</p>
                                <button 
                                    type="button"
                                    onClick={() => handleDelete(comment.comment_id)}    
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
};

export default CommentsPage;