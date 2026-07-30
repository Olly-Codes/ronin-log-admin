import { useNavigate } from "react-router";

const NotFoundPage = () => {

    const navigate = useNavigate();
    return (
        <section className="min-h-[100vh] bg-background flex items-center justify-center">
            <div className="bg-surface p-8 text-center max-w-md">
                <p className="text-sm font-medium text-accent mb-2">Page not found</p>
                <h1 className="text-2xl font-bold text-primary mb-2">We could not find that page</h1>
                <p className="text-gray-500 text-sm mb-6">The link may be outdated, mistyped, or no longer available</p>
                <button 
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="bg-red-600 text-white font-semibold py-2 px-4 cursor-pointer hover:bg-red-700 transition-colors duration-300"
                >
                    Go back to dashboard
                </button>
            </div>
        </section>
    );
};

export default NotFoundPage;