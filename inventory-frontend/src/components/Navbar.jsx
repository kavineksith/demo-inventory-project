import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

export const Navbar = ({currentPage, setCurrentPage}) => {
    const {user, logout} = useContext(AuthContext);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout();
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span>Inventory Management System</span>
            </div>

            <div className="navbar-nav">
                <button
                    onClick={() => setCurrentPage("dashboard")}
                    className={currentPage === "dashboard" ? "nav-btn active" : "nav-btn"}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setCurrentPage("inventory")}
                    className={currentPage === "inventory" ? "nav-btn active" : "nav-btn"}
                >
                    Inventory
                </button>
                {user.user.role === "ADMIN" && (
                    <button
                        onClick={() => setCurrentPage("users")}
                        className={currentPage === "users" ? "nav-btn active" : "nav-btn"}
                    >
                        Users
                    </button>
                )}
                {user.user.role === "ADMIN" && (
                    <button
                        onClick={() => setCurrentPage("email")}
                        className={currentPage === "email" ? "nav-btn active" : "nav-btn"}
                    >
                        Email
                    </button>
                )}
            </div>

            <div className="navbar-user">
                <span className="user-info">
                    {user.user.username}
                    <span className={`role-badge ${user.user.role.toLowerCase()}`}>
                        {user.user.role}
                    </span>
                </span>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};