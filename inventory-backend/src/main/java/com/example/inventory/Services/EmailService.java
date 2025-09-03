package com.example.inventory.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true indicates HTML content

        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String username) {
        String subject = "Welcome to Inventory Management System";
        String htmlContent = buildWelcomeEmailTemplate(username);

        try {
            sendHtmlEmail(to, subject, htmlContent);
        } catch (MessagingException e) {
            // Log the error and fallback to simple email
            System.err.println("Failed to send HTML email, sending simple email instead: " + e.getMessage());
            String simpleContent = String.format(
                    "Welcome to Inventory Management System, %s!\n\n" +
                            "Your account has been successfully created.\n" +
                            "You can now log in using your credentials.\n\n" +
                            "Best regards,\n" +
                            "Inventory Management Team", username);
            sendSimpleEmail(to, subject, simpleContent);
        }
    }

    private String buildWelcomeEmailTemplate(String username) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: white; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #f9f9f9; }" +
                ".footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }" +
                ".btn { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Welcome to Inventory Management System</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + username + "!</h2>" +
                "<p>Your account has been successfully created in our Inventory Management System.</p>" +
                "<p>You can now log in using your credentials and start managing inventory items.</p>" +
                "<p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>" +
                "<p>Thank you for joining us!</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>&copy; 2025 Inventory Management System. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}