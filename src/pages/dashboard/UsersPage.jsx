import { useEffect, useState } from "react";
import usersAPI from "../../api/usersAPI";

const UsersPage = () => {

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchUsers = async () => {

            try {
                const userData = await usersAPI.getUsers();
                setUsers(userData.users);
                setLoadingUsers(false);
            } catch (err) {
                console.log(err);
                setError("Could not load users");
            }
        };

        fetchUsers();
    }, []);

    return (
        <section className="users-content">
            <div className="heading-wrapper">
                <h1>Users</h1>
            </div>
            <div className="users-wrapper">
                {loadingUsers ? (
                    <p>Loading users...</p>
                ) : (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.user_id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button 
                                                type="button"
                                                onClick={() => navigate(`${user.user_id}`)}
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td>
                                            <button type="button">Edit</button>
                                        </td>
                                        <td>
                                            <button type="button">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
};

export default UsersPage;