import { useEffect, useState, useContext } from "react";
import { getAllInventory, deleteInventory, exportInventoryPdf } from "../api/inventory";
import { InventoryForm } from "./InventoryForm";
import { AuthContext } from "../context/AuthContext";

export const InventoryList = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await getAllInventory(user.token);
            setItems(data);
        } catch (err) {
            console.error("Error fetching inventory:", err);
            alert("Error loading inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (plu, itemName) => {
        if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
            try {
                await deleteInventory(plu, user.token);
                fetchItems();
            } catch (err) {
                console.error("Error deleting item:", err);
                alert("Error deleting item");
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleItemSaved = () => {
        fetchItems();
        setEditingItem(null);
        setShowForm(false);
    };

    const handleCancel = () => {
        setEditingItem(null);
        setShowForm(false);
    };

    const handleExportPdf = async () => {
        try {
            const pdfBlob = await exportInventoryPdf(user.token);
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `inventory_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error exporting PDF:", err);
            alert("Error exporting PDF");
        }
    };

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.PLU.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventory-container">
            <div className="inventory-header">
                <h2>Inventory Management</h2>
                <div className="header-actions">
                    <button onClick={handleExportPdf} className="export-btn">
                        Export PDF
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="add-item-btn"
                    >
                        {showForm ? "Cancel" : "Add New Item"}
                    </button>
                </div>
            </div>

            {showForm && (
                <InventoryForm
                    selectedItem={editingItem}
                    onSaved={handleItemSaved}
                    onCancel={handleCancel}
                />
            )}

            <div className="inventory-controls">
                <input
                    type="text"
                    placeholder="Search by item name or PLU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading ? (
                <div className="loading">Loading inventory...</div>
            ) : (
                <div className="inventory-table-container">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>PLU</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total Value</th>
                                {user.user.role === "ADMIN" && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={user.user.role === "ADMIN" ? "6" : "5"} className="no-data">
                                        {searchTerm ? "No items match your search" : "No inventory items found"}
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item.PLU} className={item.QTY < 10 ? "low-stock" : ""}>
                                        <td>{item.PLU}</td>
                                        <td>
                                            {item.itemName}
                                            {item.QTY < 10 && <span className="low-stock-badge">Low Stock</span>}
                                        </td>
                                        <td>{item.QTY}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>${(item.price * item.QTY).toFixed(2)}</td>
                                        {user.user.role === "ADMIN" && (
                                            <td>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="edit-btn"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.PLU, item.itemName)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
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