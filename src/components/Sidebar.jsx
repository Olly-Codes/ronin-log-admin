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
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div>
                <div className="px-6 py-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">
                        Ronin <span className="text-red-600">Log</span>
                    </h1>
                </div>

                <nav className="flex flex-col p-4 gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
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