import { useNavigate } from "react-router";

const NotFoundPage = () => {

    const navigate = useNavigate();
    return (
        <section className="not-found-content">
            <div className="not-found-wrapper">
                <p>Page not found</p>
                <h1>We could not find that page</h1>
                <p>The link may be outdated, mistyped, or no longer available</p>
                <button 
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}>Go back to dashboard</button>
            </div>
        </section>
    );
};

export default NotFoundPage;