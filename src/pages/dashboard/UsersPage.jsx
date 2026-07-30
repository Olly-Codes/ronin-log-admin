import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import usersAPI from "../../api/usersAPI";
import LoadingError from "../../components/LoadingError";

const UsersPage = () => {

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState(false);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        setError(false);

        try {
            const userData = await usersAPI.getUsers();
            setUsers(userData.users);
            setLoadingUsers(false);
        } catch (err) {
            console.error(err);
            setError(true);
            setLoadingUsers(false);
            toast.error("Failed to load user data. Please try again");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (error && !loadingUsers) {
        return (
            <LoadingError
                title={"Users"}
                errorMessage={"Could not load users"}
                fetchData={fetchUsers}
            />
        );
    };

    return (
        <section>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
                {loadingUsers ? (
                    <p className="text-gray-500 text-sm">Loading users...</p>
                ) : (
                    <div className="bg-white border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="text-sm font-medium text-left text-gray-500 px-4 py-2">Username</th>
                                    <th className="text-sm font-medium text-left text-gray-500 px-4 py-2">Email</th>
                                    <th className="text-sm font-medium text-left text-gray-500 px-4 py-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr 
                                        key={user.user_id}
                                        className="border-t border-gray-200"
                                    >
                                        <td className="px-4 py-2 text-sm text-gray-900">{user.username}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{user.email}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{user.role}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex justify-end gap-3">
                                                <button 
                                                    type="button"
                                                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    type="button"
                                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
        </section>
    )
};

export default UsersPage;