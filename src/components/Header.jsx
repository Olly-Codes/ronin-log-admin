import { useAuth } from "../context/AuthContext";

const Header = () => {

    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
            <p className="font-medium text-gray-900">
                Welcome, <span className="font-bold text-gray-900">{user.username}</span>
            </p>
        </header>
    );
};

export default Header;