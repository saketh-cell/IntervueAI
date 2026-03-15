const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing in environment variables");
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error("EMAIL_FROM is missing in environment variables");
    }

    if (!to || !subject || !html) {
      throw new Error("Missing required email fields: to, subject, or html");
    }

    console.log("Sending email to:", to);

    const response = await resend.emails.send({
      from: `"IntervueAI" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", response);

    return response;
  } catch (error) {
    console.error("Resend email error:", error);
    throw error;
  }
};

module.exports = sendEmail;