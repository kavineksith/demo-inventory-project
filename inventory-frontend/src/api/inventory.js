import axios from "axios";

const API_URL = "http://localhost:8085/api/v1/inventory/"; // Fixed port

// Get all inventory items
export const getAllInventory = async (token) => {
    const res = await axios.get(API_URL + "list", { // Fixed endpoint
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Get inventory by PLU code
export const getInventoryByPLU = async (plu, token) => {
    const res = await axios.get(`${API_URL}search?pluCode=${plu}`, { // Fixed endpoint
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Create inventory (with or without image)
export const createInventory = async (data, token) => {
    if (data.image) {
        // Use form-data for images
        const formData = new FormData();
        formData.append("itemName", data.itemName);
        formData.append("QTY", data.QTY);
        formData.append("price", data.price);
        formData.append("PLU", data.PLU);
        formData.append("image", data.image); // Fixed parameter name

        const res = await axios.post(API_URL + "create/", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Don't set Content-Type - let axios set it automatically for FormData
            }
        });
        return res.data;
    } 
    // else {
    //     // Use JSON for no images
    //     const res = await axios.post(API_URL + "create", {
    //         PLU: data.PLU,
    //         itemName: data.itemName,
    //         QTY: data.QTY,
    //         price: data.price
    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-Type": "application/json"
    //         }
    //     });
    //     return res.data;
    // }
};

// Update inventory (with or without image)
export const updateInventory = async (plu, data, token) => {
    if (data.image) {
        // Use form-data for images
        const formData = new FormData();
        formData.append("itemName", data.itemName);
        formData.append("QTY", data.QTY);
        formData.append("price", data.price);
        formData.append("image", data.image); // Fixed parameter name

        const res = await axios.put(`${API_URL}update/${plu}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Don't set Content-Type for FormData
            }
        });
        return res.data;
    } 
    // else {
    //     // Use JSON for no images
    //     const res = await axios.put(`${API_URL}update/${plu}`, {
    //         itemName: data.itemName,
    //         QTY: data.QTY,
    //         price: data.price
    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-Type": "application/json"
    //         }
    //     });
    //     return res.data;
    // }
};

// Delete inventory
export const deleteInventory = async (plu, token) => {
    return await axios.delete(`${API_URL}delete/${plu}`, { // Fixed endpoint
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Export inventory PDF (all items)
export const exportInventoryPdf = async (token) => {
    const res = await axios.get(`${API_URL}pdf/report`, { // Fixed endpoint
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
    });
    return res.data;
};

// Export single item PDF
export const exportInventoryItemPdf = async (plu, token) => {
    const res = await axios.get(`${API_URL}pdf/item/${plu}`, { // New endpoint
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
    });
    return res.data;
};