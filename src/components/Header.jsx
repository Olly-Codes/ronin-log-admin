import { useAuth } from "../context/AuthContext";
import { MdMenu } from "react-icons/md";

const Header = ({ onMenuClick }) => {

    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between lg:justify-end px-4 sm:px-8">
            <button
                onClick={onMenuClick}
                className="lg:hidden text-primary text-2xl"
            >
                <MdMenu />
            </button>

            <div className="flex items-center">
                <p className="font-medium text-primary hidden sm:block">
                    <span className="font-bold text-primary">{user.username}</span>
                </p>
                <button 
                    onClick={logout}
                    className="px-2 ml-4 cursor-pointer bg-red-600 text-white font-semibold py-2 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        Logout
                </button>
            </div>
        </header>
    );
};

export default Header;