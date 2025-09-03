import { EmailForm } from "../components/EmailForm";

export const EmailPage = () => {
    return (
        <div className="email-page">
            <div className="email-header">
                <h2>Email Management</h2>
                <p>Send test emails and welcome emails to users</p>
            </div>
            <EmailForm/>
        </div>
    );
};