import axios from "axios";

const API_URL = "http://localhost:8085/api/v1/users"; // no trailing slash

// Get all users
export const getAllUsers = async (token) => {
    const res = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Create new user
export const createUser = async (userData, token) => {
    const res = await axios.post(`${API_URL}/create`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    return res.data;
};

// Update existing user (by username)
export const updateUser = async (username, userData, token) => {
    const res = await axios.put(`${API_URL}/modify/${username}`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    return res.data;
};

// Delete user (by username)
export const deleteUser = async (username, token) => {
    return await axios.delete(`${API_URL}/destroy/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Find user (by username)
export const getUserByUsername = async (username, token) => {
    const res = await axios.get(`${API_URL}/find/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
