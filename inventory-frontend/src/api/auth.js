import axios from "axios";

const API_URL = "http://localhost:8085/api/v1/auth/"; // Fixed port

export const login = async (username, password) => {
    const res = await axios.post(API_URL + "login", { username, password });
    return res.data;
};

export const register = async (userData) => {
    const res = await axios.post(API_URL + "register", userData);
    return res.data;
};