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
        <aside className="w-64 bg-surface border-r border-border flex flex-col">
            <div>
                <div className="px-6 py-6">
                    <h1 className="text-xl font-bold text-primary">
                        Ronin <span className="text-accent">Log</span>
                    </h1>
                </div>

                <nav className="flex flex-col p-4 gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="px-3 py-2 text-sm font-medium text-muted hover:bg-surface-hover hover:text-accent transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;