import { useAuth } from "../context/AuthContext";

const Header = () => {

    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-surface border-b border-border flex items-center justify-end px-8">
            <p className="font-medium text-primary">
                <span className="font-bold text-primary">{user.username}</span>
            </p>
            <button 
                onClick={logout}
                className="px-2 ml-4 cursor-pointer bg-accent text-white font-semibold py-2 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    Logout
            </button>
        </header>
    );
};

export default Header;