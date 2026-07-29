import { useAuth } from "../context/AuthContext";

const Header = () => {

    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
            <p className="font-medium text-gray-900">
                <span className="font-bold text-gray-900">{user.username}</span>
            </p>
            <button 
                onClick={logout}
                className="px-2 ml-4 cursor-pointer bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    Logout
            </button>
        </header>
    );
};

export default Header;