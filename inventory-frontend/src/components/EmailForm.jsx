import { useState, useContext } from "react";
import { sendTestEmail, sendWelcomeEmail } from "../api/email";
import { AuthContext } from "../context/AuthContext";

export const EmailForm = () => {
    const {user} = useContext(AuthContext);
    const [emailType, setEmailType] = useState("test");
    const [form, setForm] = useState({
        to: "",
        subject: "",
        message: "",
        username: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const validateForm = () => {
        const newErrors = {};

        if (!form.to.trim()) {
            newErrors.to = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(form.to)) {
            newErrors.to = "Please enter a valid email address";
        }

        if (emailType === "test") {
            if (!form.subject.trim()) {
                newErrors.subject = "Subject is required";
            }
            if (!form.message.trim()) {
                newErrors.message = "Message is required";
            }
        } else if (emailType === "welcome") {
            if (!form.username.trim()) {
                newErrors.username = "Username is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({...errors, [name]: ""});
        }

        // Clear success message when form changes
        if (success) {
            setSuccess("");
        }
    };

    const handleEmailTypeChange = (e) => {
        setEmailType(e.target.value);
        setForm({
            to: "",
            subject: "",
            message: "",
            username: ""
        });
        setErrors({});
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setSuccess("");

            if (emailType === "test") {
                await sendTestEmail({
                    to: form.to,
                    subject: form.subject,
                    message: form.message
                }, user.token);
                setSuccess("Test email sent successfully!");
            } else if (emailType === "welcome") {
                await sendWelcomeEmail({
                    to: form.to,
                    username: form.username
                }, user.token);
                setSuccess("Welcome email sent successfully!");
            }

            // Reset form after successful send
            setForm({
                to: "",
                subject: "",
                message: "",
                username: ""
            });
        } catch (err) {
            console.error("Error sending email:", err);
            if (err.response?.data) {
                setErrors({general: err.response.data});
            } else {
                setErrors({general: "Failed to send email. Please try again."});
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="email-form-container">
            <h3>Send Email</h3>

            {success && (
                <div className="success-banner">
                    {success}
                </div>
            )}

            {errors.general && (
                <div className="error-banner">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="email-form">
                <div className="form-group">
                    <label htmlFor="email-type">Email Type</label>
                    <select
                        id="email-type"
                        value={emailType}
                        onChange={handleEmailTypeChange}
                        className="email-type-select"
                    >
                        <option value="test">Test Email</option>
                        <option value="welcome">Welcome Email</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="to">To Email Address</label>
                    <input
                        id="to"
                        name="to"
                        type="email"
                        placeholder="recipient@example.com"
                        value={form.to}
                        onChange={handleChange}
                        className={errors.to ? "error" : ""}
                        disabled={loading}
                    />
                    {errors.to && <span className="error-text">{errors.to}</span>}
                </div>

                {emailType === "test" && (
                    <>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                id="subject"
                                name="subject"
                                placeholder="Email subject"
                                value={form.subject}
                                onChange={handleChange}
                                className={errors.subject ? "error" : ""}
                                disabled={loading}
                            />
                            {errors.subject && <span className="error-text">{errors.subject}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Email message..."
                                value={form.message}
                                onChange={handleChange}
                                className={errors.message ? "error" : ""}
                                disabled={loading}
                                rows="6"
                            />
                            {errors.message && <span className="error-text">{errors.message}</span>}
                        </div>
                    </>
                )}

                {emailType === "welcome" && (
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            placeholder="Username for welcome email"
                            value={form.username}
                            onChange={handleChange}
                            className={errors.username ? "error" : ""}
                            disabled={loading}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>
                )}

                <div className="form-buttons">
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send Email"}
                    </button>
                </div>
            </form>
        </div>
    );
};