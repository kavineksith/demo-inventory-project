import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user data on app start
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const userData = JSON.parse(stored);

                // Basic validation of stored data
                if (userData.token && userData.user) {
                    setUser(userData);
                } else {
                    localStorage.removeItem("user");
                }
            }
        } catch (error) {
            console.error("Error reading stored user data:", error);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        try {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Error storing user data:", error);
        }
    };

    const logout = () => {
        setUser(null);
        try {
            localStorage.removeItem("user");
        } catch (error) {
            console.error("Error clearing user data:", error);
        }
    };

    const updateUserData = (newUserData) => {
        const updatedUser = { ...user, user: { ...user.user, ...newUserData } };
        setUser(updatedUser);
        try {
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    if (loading) {
        return (
            <div className="loading-app">
                <div className="loading-spinner"></div>
                <p>Loading application...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            updateUserData,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };