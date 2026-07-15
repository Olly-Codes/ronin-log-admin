import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {

    const { logout } = useAuth();

    return (
        <aside className="dashboard-sidebar">
            <nav className="nav">
                <Link to={"/admin/dashboard"}>Overview</Link>
                <Link to={"/admin/dashboard/users"}>Users</Link>
                <Link to={"/admin/dashboard/reviews"}>Reviews</Link>
                <Link to={"/admin/dashboard/comments"}>Comments</Link>
                <Link to={"/admin/dashboard/genres"}>Genres</Link>
            </nav>
            <button onClick={logout}>Logout</button>
        </aside>
    );
};

export default Sidebar;