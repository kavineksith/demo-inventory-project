import { useState, useContext } from "react";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";

export const Login = () => {
    const { login: setLogin } = useContext(AuthContext);
    const [form, setForm] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const data = await login(form.username, form.password);
            setLogin(data);
        } catch (err) {
            console.error("Login error:", err);
            if (err.response?.status === 401) {
                setErrors({ general: "Invalid username or password" });
            } else {
                setErrors({ general: "Login failed. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login to Inventory System</h2>

                {errors.general && (
                    <div className="error-banner">
                        {errors.general}
                    </div>
                )}

                <div className="form-group">
                    <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className={errors.username ? "error" : ""}
                        disabled={loading}
                    />
                    {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

                <div className="form-group">
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className={errors.password ? "error" : ""}
                        disabled={loading}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};