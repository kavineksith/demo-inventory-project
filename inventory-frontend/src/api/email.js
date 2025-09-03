import axios from "axios";

const API_URL = "http://localhost:8085/api/v1/email/"; // Fixed port to match your existing APIs

// Send test email
export const sendTestEmail = async (emailData, token) => {
    const res = await axios.post(API_URL + "test", null, {
        params: {
            to: emailData.to,
            subject: emailData.subject,
            message: emailData.message
        },
        headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
};

// Send welcome email
export const sendWelcomeEmail = async (emailData, token) => {
    const res = await axios.post(API_URL + "welcome", null, {
        params: {
            to: emailData.to,
            username: emailData.username
        },
        headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
};