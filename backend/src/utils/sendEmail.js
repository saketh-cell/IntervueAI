const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    console.log("Sending email to:", to);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
    });

    await transporter.verify();
    console.log("SMTP connection ready");

    const info = await transporter.sendMail({
      from: `"IntervueAI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Email error full object:", error);
    console.error("Email error message:", error.message);
    console.error("Email error code:", error.code);
    console.error("Email error command:", error.command);
    throw error;
  }
};

module.exports = sendEmail;