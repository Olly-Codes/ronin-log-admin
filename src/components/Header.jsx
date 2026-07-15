import { useAuth } from "../context/AuthContext";

const Header = () => {

    const { user } = useAuth();

    return (
        <header className="header-content">
            <p>Welcome, {user.username}!</p>
        </header>
    );
};

export default Header;