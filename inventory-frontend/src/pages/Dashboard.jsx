import { useState, useEffect, useContext } from "react";
import { getAllInventory } from "../api/inventory";
import { getAllUsers } from "../api/user";
import { AuthContext } from "../context/AuthContext";

export const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch inventory data
            const inventoryData = await getAllInventory(user.token);

            const totalItems = inventoryData.length;
            const totalValue = inventoryData.reduce((sum, item) => sum + (item.price * item.QTY), 0);
            const lowStockItems = inventoryData.filter(item => item.QTY < 10).length;

            let totalUsers = 0;

            // Only fetch users if admin
            if (user.user.role === "ADMIN") {
                try {
                    const usersData = await getAllUsers(user.token);
                    totalUsers = usersData.length;
                } catch (err) {
                    console.error("Error fetching users:", err);
                }
            }

            setStats({
                totalItems,
                totalValue,
                lowStockItems,
                totalUsers
            });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Items</h3>
                    <div className="stat-number">{stats.totalItems}</div>
                    <p>Items in inventory</p>
                </div>

                <div className="stat-card">
                    <h3>Total Value</h3>
                    <div className="stat-number">${stats.totalValue.toFixed(2)}</div>
                    <p>Total inventory value</p>
                </div>

                <div className="stat-card warning">
                    <h3>Low Stock</h3>
                    <div className="stat-number">{stats.lowStockItems}</div>
                    <p>Items with quantity &lt; 10</p>
                </div>

                {user.user.role === "ADMIN" && (
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <div className="stat-number">{stats.totalUsers}</div>
                        <p>Registered users</p>
                    </div>
                )}
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <button onClick={() => window.location.reload()} className="refresh-btn">
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
};