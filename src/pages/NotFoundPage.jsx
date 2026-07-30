import { useNavigate } from "react-router";

const NotFoundPage = () => {

    const navigate = useNavigate();
    return (
        <section className="min-h-[100vh] bg-gray-300 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg text-center max-w-sm">
                <p className="text-sm font-medium text-red-600 mb-2">Page not found</p>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">We could not find that page</h1>
                <p className="text-gray-500 text-sm mb-6">The link may be outdated, mistyped, or no longer available</p>
                <button 
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer hover:bg-red-700 transition-colors duration-300"
                >
                    Go back to dashboard
                </button>
            </div>
        </section>
    );
};

export default NotFoundPage;