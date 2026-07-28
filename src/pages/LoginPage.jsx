import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await login(email, password);
            toast.success("Logged in succeffully");
            navigate("/admin/dashboard");
        } catch (err) {
            toast.error("Invalid email or password");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-100">
            <form 
                onSubmit={handleSubmit} 
                className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Ronin <span className="text-red-600">Log</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Sign in to manage reviews</p>
                </div>

                <div className="border-t border-gray-200 mb-6"></div>

                <div className="mb-5">
                    <label 
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email
                    </label>
                    <input
                        id="email" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    />
                </div>

                <div className="mb-6">
                    <label 
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>
                    <input
                        id="password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </section>
    );
};

export default LoginPage;