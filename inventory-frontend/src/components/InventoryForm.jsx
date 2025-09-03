import { useState, useContext, useEffect } from "react";
import { createInventory, updateInventory } from "../api/inventory";
import { AuthContext } from "../context/AuthContext";

export const InventoryForm = ({ selectedItem, onSaved, onCancel }) => {
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({
        itemName: "",
        QTY: "",
        price: "",
        PLU: "",
        image: null
    });
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (selectedItem) {
            setForm({
                itemName: selectedItem.itemName,
                QTY: selectedItem.QTY,
                price: selectedItem.price,
                PLU: selectedItem.PLU,
                image: null
            });
        } else {
            setForm({ itemName: "", QTY: "", price: "", PLU: "", image: null });
        }
        setErrors({});
        setPreview(null);
    }, [selectedItem]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.itemName.trim()) {
            newErrors.itemName = "Item name is required";
        }

        if (!form.QTY || form.QTY < 0) {
            newErrors.QTY = "Valid quantity is required";
        }

        if (!form.price || form.price < 0) {
            newErrors.price = "Valid price is required";
        }

        if (!selectedItem && !form.PLU.trim()) {
            newErrors.PLU = "PLU is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];
            setForm({ ...form, [name]: file });

            // Create preview for image
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => setPreview(e.target.result);
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        } else {
            setForm({ ...form, [name]: value });
        }

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
            if (selectedItem && user.user.role === "ADMIN") {
                await updateInventory(selectedItem.PLU, form, user.token);
            } else {
                await createInventory(form, user.token);
            }
            onSaved();
            setForm({ itemName: "", QTY: "", price: "", PLU: "", image: null });
            setErrors({});
            setPreview(null);
        } catch (err) {
            console.error("Error saving inventory:", err);
            if (err.response?.data?.message) {
                alert(`Error: ${err.response.data.message}`);
            } else {
                alert("Error saving inventory item. Please try again.");
            }
        }
    };

    return (
        <div className="inventory-form-container">
            <h3>{selectedItem ? "Edit Item" : "Add New Item"}</h3>
            <form onSubmit={handleSubmit} className="inventory-form">
                <div className="form-row">
                    <div className="form-group">
                        <input
                            name="PLU"
                            placeholder="PLU (Product Lookup Code)"
                            value={form.PLU}
                            onChange={handleChange}
                            disabled={!!selectedItem}
                            className={errors.PLU ? "error" : ""}
                        />
                        {errors.PLU && <span className="error-text">{errors.PLU}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            name="itemName"
                            placeholder="Item Name"
                            value={form.itemName}
                            onChange={handleChange}
                            className={errors.itemName ? "error" : ""}
                        />
                        {errors.itemName && <span className="error-text">{errors.itemName}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <input
                            name="QTY"
                            type="number"
                            min="0"
                            placeholder="Quantity"
                            value={form.QTY}
                            onChange={handleChange}
                            className={errors.QTY ? "error" : ""}
                        />
                        {errors.QTY && <span className="error-text">{errors.QTY}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Price ($)"
                            value={form.price}
                            onChange={handleChange}
                            className={errors.price ? "error" : ""}
                        />
                        {errors.price && <span className="error-text">{errors.price}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="image-upload">Product Image (optional)</label>
                    <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    {preview && (
                        <div className="image-preview">
                            <img src={preview} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="form-buttons">
                    <button type="submit" className="save-btn">
                        {selectedItem ? "Update Item" : "Create Item"}
                    </button>
                    {selectedItem && onCancel && (
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};