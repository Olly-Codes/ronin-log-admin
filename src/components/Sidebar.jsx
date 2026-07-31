import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { 
    MdOutlineDashboard, 
    MdOutlinePeople, 
    MdOutlineRateReview, 
    MdOutlineComment, 
    MdOutlineCategory, 
    MdClose
} from "react-icons/md";

const Sidebar = ({ isOpen, onClose }) => {

    const { logout } = useAuth();

    const links = [
        { icon: <MdOutlineDashboard />, to: "/admin/dashboard", label: "Overview" },
        { icon: <MdOutlinePeople />, to: "/admin/dashboard/users", label: "Users" },
        { icon: <MdOutlineRateReview />, to: "/admin/dashboard/reviews", label: "Reviews" },
        { icon: <MdOutlineComment />, to: "/admin/dashboard/comments", label: "Comments" },
        { icon: <MdOutlineCategory />, to: "/admin/dashboard/genres", label: "Genres" }
    ];

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-40 ld:hidden"
                />
            )}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div>
                    <div className="px-6 py-6 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-primary">
                            Ronin <span className="text-accent">Log</span>
                        </h1>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-muted hover:text-primary text-2xl"
                        >
                            <MdClose />
                        </button>
                    </div>

                    <nav className="flex flex-col p-4 gap-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/admin/dashboard"}
                                onClick={onClose}
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
        </>
        
    );
};

export default Sidebar;