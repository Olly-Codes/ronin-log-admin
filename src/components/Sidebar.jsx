import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { 
    MdOutlineDashboard, 
    MdOutlinePeople, 
    MdOutlineRateReview, 
    MdOutlineComment, 
    MdOutlineCategory 
} from "react-icons/md";

const Sidebar = () => {

    const { logout } = useAuth();

    const links = [
        { icon: <MdOutlineDashboard />, to: "/admin/dashboard", label: "Overview" },
        { icon: <MdOutlinePeople />, to: "/admin/dashboard/users", label: "Users" },
        { icon: <MdOutlineRateReview />, to: "/admin/dashboard/reviews", label: "Reviews" },
        { icon: <MdOutlineComment />, to: "/admin/dashboard/comments", label: "Comments" },
        { icon: <MdOutlineCategory />, to: "/admin/dashboard/genres", label: "Genres" }
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
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/admin/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive 
                                        ? "bg-surface-hover text-accent" 
                                        : "text-muted hover:bg-surface-hover hover:text-accent"
                                }`
                            }
                        >
                            <span className="inline-block mr-2 text-2xl">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;