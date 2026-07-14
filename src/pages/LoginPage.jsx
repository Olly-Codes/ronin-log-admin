import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            navigate("/admin/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="login-content">
            <form onSubmit={handleSubmit}>
                <h1>Ronin Login</h1>

                {error && <p>{error}</p>}

                <label htmlFor="email">Email</label>
                <input
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </section>
    );
};

export default LoginPage;