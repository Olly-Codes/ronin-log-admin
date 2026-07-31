import { useEffect, useState } from "react";
import { capatilize } from "../../utils/capitilizeText";
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

    const actions = [
        { textContent: "View"},
        { textContent: "Edit"},
        { textContent: "Delete"},
    ];

    return (
        <section>
            <h1 className="text-2xl font-bold text-primary mb-6">Users</h1>
                {loadingUsers ? (
                    <p className="bg-surface border border-border p-8 text-muted text-sm">Loading users...</p>
                ) : (
                    <>
                        <div className="hidden md:block bg-surface overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 border border-border">
                                <thead>
                                    <tr>
                                        <th className="text-sm font-medium text-left text-muted px-4 py-2">Username</th>
                                        <th className="text-sm font-medium text-left text-muted px-4 py-2">Email</th>
                                        <th className="text-sm font-medium text-left text-muted px-4 py-2">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr 
                                            key={user.user_id}
                                            className="border-t border-gray-200"
                                        >
                                            <td className="px-4 py-2 text-sm text-primary">{user.username}</td>
                                            <td className="px-4 py-2 text-sm text-primary">{user.email}</td>
                                            <td className="px-4 py-2 text-sm text-primary">{capatilize(user.role)}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex justify-end gap-3">
                                                    <button 
                                                        type="button"
                                                        className="text-sm font-medium text-primary hover:text-muted"
                                                    >
                                                        View
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        className="text-sm font-medium text-muted hover:text-white"
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

                        <div className="md:hidden flex flex-col gap-3">
                            {users.map((user) => (
                                <div
                                    key={user.user_id}
                                    className="bg-surface border border-border p-4"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="text-sm font-semibold text-primary">{user.username}</p>
                                        <span className="text-xs font-medium text-muted bg-surface-hover px-2 py-1">
                                            {capatilize(user.role)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted mb-3">{user.email}</p>

                                    <div className="flex gap-4 pt-2 border-t border-border">
                                        <button 
                                            type="button"
                                            className="text-sm font-medim text-primary hover:text-muted"
                                        >
                                            View
                                        </button>
                                        <button 
                                            type="button"
                                            className="text-sm font-medim text-muted hover:text-white"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            type="button"
                                            className="text-sm font-medim text-accent hover:text-accent-hover"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
        </section>
    )
};

export default UsersPage;