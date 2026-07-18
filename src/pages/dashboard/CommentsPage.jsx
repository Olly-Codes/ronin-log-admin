import { useEffect, useState } from "react";
import commentsAPI from "../../api/commentsAPI";

const CommentsPage = () => {

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchComments = async () => {

            try {
                const comments = await commentsAPI.getComments();
                setComments(comments.comments);
                setLoadingComments(false);
            } catch (err) {
                console.log(err);
            }
        };

        fetchComments();
    }, []);

    const handleDelete = async (id) => {
        setError("");

        try {
            await commentsAPI.deleteComment(id);
            setComments((prev) => prev.filter((c) => c.comment_id !== id));
        } catch (err) {
            setError("Could not delete comment");
        }
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