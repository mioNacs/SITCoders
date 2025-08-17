import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, // true for 465, false for 587/25
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Optionally verify transport on startup (non-blocking)
transporter.verify().then(() => {
  console.log("SMTP transporter configured successfully");
}).catch((err) => {
  console.warn("SMTP transporter verification failed:", err?.message || err);
});

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_HOST) {
      console.warn("SMTP credentials are missing. Skipping email send.");
      return false;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.warn(`Error sending email to ${to}:`, error?.message || error);
    // Do not throw to avoid breaking user flows; return false
    return false;
  }
};

export { transporter, sendEmail };
