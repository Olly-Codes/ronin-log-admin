import { useEffect, useState } from "react";
import commentsAPI from "../../api/commentsAPI";

const CommentsPage = () => {

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);

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

    return (
        <section className="comments-content">
            <h1>Comments</h1>
            {loadingComments ? (
                <p>Loading Comments...</p>
            ) : (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.comment_id}>
                            <p>{comment.created_at}</p>
                            <p>{comment.content}</p>
                            <p>Made by {comment.username} in {comment.title}</p>
                            <button type="button">Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
};

export default CommentsPage;