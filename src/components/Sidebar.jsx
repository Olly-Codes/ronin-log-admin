import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {

    const { logout } = useAuth();

    const links = [
        { to: "/admin/dashboard", label: "Overview" },
        { to: "/admin/dashboard/users", label: "Users" },
        { to: "/admin/dashboard/reviews", label: "Reviews" },
        { to: "/admin/dashboard/comments", label: "Comments" },
        { to: "/admin/dashboard/genres", label: "Genres" }
    ];

    return (
        <aside className="dashboard-sidebar">
            <div>
                <div>
                    <h1>Ronin <span>Log</span></h1>
                </div>
            </div>
            
            <nav className="nav">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <button onClick={logout}>Logout</button>
        </aside>
    );
};

export default Sidebar;