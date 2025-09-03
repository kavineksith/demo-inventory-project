import { useState, useContext, useEffect } from "react";
import { createUser, updateUser } from "../api/user";
import { AuthContext } from "../context/AuthContext";

export const UserForm = ({ selectedUser, onSaved, onCancel }) => {
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "USER"
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedUser) {
            setForm({
                username: selectedUser.username,
                email: selectedUser.email,
                password: "", // Don't pre-fill password for security
                role: selectedUser.role
            });
        } else {
            setForm({
                username: "",
                email: "",
                password: "",
                role: "USER"
            });
        }
        setErrors({});
    }, [selectedUser]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!selectedUser && !form.password.trim()) {
            newErrors.password = "Password is required";
        }

        if (selectedUser && form.password && form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!selectedUser && form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const userData = { ...form };

            // Don't send empty password for updates
            if (selectedUser && !userData.password) {
                delete userData.password;
            }

            if (selectedUser) {
                await updateUser(selectedUser.id, userData, user.token);
            } else {
                await createUser(userData, user.token);
            }

            onSaved();
            setForm({ username: "", email: "", password: "", role: "USER" });
            setErrors({});
        } catch (err) {
            console.error("Error saving user:", err);
            if (err.response?.data?.message) {
                alert(`Error: ${err.response.data.message}`);
            } else {
                alert("Error saving user. Please try again.");
            }
        }
    };

    return (
        <div className="user-form-container">
            <h3>{selectedUser ? "Edit User" : "Add New User"}</h3>
            <form onSubmit={handleSubmit} className="user-form">
                <div className="form-group">
                    <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className={errors.username ? "error" : ""}
                    />
                    {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

                <div className="form-group">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <input
                        name="password"
                        type="password"
                        placeholder={selectedUser ? "New Password (leave blank to keep current)" : "Password"}
                        value={form.password}
                        onChange={handleChange}
                        className={errors.password ? "error" : ""}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-group">
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="save-btn">
                        {selectedUser ? "Update User" : "Create User"}
                    </button>
                    {selectedUser && (
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};