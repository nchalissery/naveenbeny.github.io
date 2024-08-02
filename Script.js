import java.io.IOException;
import java.io.PrintWriter;
import javax.mail.*;
import javax.mail.internet.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Properties;

@WebServlet("/ContactFormServlet")
public class ContactFormServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Set response content type
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Retrieve form data
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String subject = request.getParameter("subject");
        String message = request.getParameter("message");

        // Set up email server properties
        String host = "smtp.example.com"; // Use your SMTP server
        final String username = "your-email@example.com"; // Your email address
        final String password = "your-email-password"; // Your email password
        String to = "recipient@example.com"; // Destination email address

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", "587"); // Use port 587 for TLS

        // Get the Session object
        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            // Create a default MimeMessage object
            Message mimeMessage = new MimeMessage(session);

            // Set From: header field
            mimeMessage.setFrom(new InternetAddress(email));

            // Set To: header field
            mimeMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));

            // Set Subject: header field
            mimeMessage.setSubject(subject);

            // Set the actual message
            mimeMessage.setText("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message);

            // Send message
            Transport.send(mimeMessage);
            out.println("<h2>Thank you for contacting us! We will get back to you shortly.</h2>");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        out.close();
    }
}
