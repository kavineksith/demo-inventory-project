import { useEffect, useState, useContext } from "react";
import { getAllUsers, deleteUser } from "../api/user";
import { UserForm } from "../components/UserForm";
import { AuthContext } from "../context/AuthContext";

export const UserList = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers(user.token);
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            alert("Error loading users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id, username) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            try {
                await deleteUser(id, user.token);
                fetchUsers();
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("Error deleting user");
            }
        }
    };

    const handleEdit = (userToEdit) => {
        setEditingUser(userToEdit);
        setShowForm(true);
    };

    const handleUserSaved = () => {
        fetchUsers();
        setEditingUser(null);
        setShowForm(false);
    };

    const handleCancel = () => {
        setEditingUser(null);
        setShowForm(false);
    };

    if (user.user.role !== "ADMIN") {
        return (
            <div className="access-denied">
                <h2>Access Denied</h2>
                <p>You don't have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="users-container">
            <div className="users-header">
                <h2>User Management</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="add-user-btn"
                >
                    {showForm ? "Cancel" : "Add New User"}
                </button>
            </div>

            {showForm && (
                <UserForm
                    selectedUser={editingUser}
                    onSaved={handleUserSaved}
                    onCancel={handleCancel}
                />
            )}

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="no-data">No users found</td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.username}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`role-badge ${u.role.toLowerCase()}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleEdit(u)}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id, u.username)}
                                                className="delete-btn"
                                                disabled={u.id === user.user.id}
                                            >
                                                Delete
                                            </button>
                                            {u.id === user.user.id && (
                                                <span className="current-user">(You)</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};