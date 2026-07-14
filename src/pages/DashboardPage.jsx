import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import reviewsAPI from "../api/reviewsAPI";

const DashboardPage = () => {

    const { user, logout } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState("");
    const [loadingReviews, setLoadingReviews] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {

            try {
                const reviewsData = await reviewsAPI.getReviews();
                setReviews(reviewsData.reviews);
            } catch (err) {
                setError("Could not load reviews");
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, []);

    if (loadingReviews) return <p>Loading Reviews...</p>

    return (
        <section className="dashboard-content">
            <h1>Welcome, {user.username}!</h1>
            <button onClick={logout}>Logout</button>

            {error && <p>{error}</p>}

            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <p>{review.title}</p>
                    </li>
                ))};
            </ul>
        </section>
    );
};

export default DashboardPage;