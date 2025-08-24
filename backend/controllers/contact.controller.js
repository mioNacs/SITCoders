import { sendEmail } from "../utilities/transporter.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

const sendEmailToAdmin = async (req, res) => {
  try {
    const { adminId, message } = req.body;
    const { email, fullName } = req.user;

    if (!adminId || !message) {
      return res.status(400).json({ 
        message: "Admin ID and message are required" 
      });
    }

    // Get admin details
    const admin = await Admin.findById(adminId).populate({
      path: 'admin',
      select: 'fullName email'
    });

    if (!admin) {
      return res.status(404).json({ 
        message: "Admin not found" 
      });
    }

    const adminUser = admin.admin;

    // Send email to admin
    const emailSent = await sendEmail(
      adminUser.email,
      `Contact Request from ${fullName}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #f97316;">New Contact Request</h2>
          <p><strong>From:</strong> ${fullName} (${email})</p>
          <p style="font-size: 15px; color: #444; margin-bottom: 6px;"><strong>Message:</strong></p>
        <div style="background-color: #fff7ed; padding: 18px; border-radius: 7px; margin: 12px 0; font-size: 15px; color: #222; border: 1px solid #fde68a;">
        ${message.replace(/\n/g, '<br>')}
        </div>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="margin-top: 0; color: #666; font-size: 14px;">
        This message was sent through the <span style="color: #22c55e; font-weight: bold;">SIT Coders</span> contact form.
        </p>
        </div>
      `
    );

    if (!emailSent) {
      return res.status(500).json({ 
        message: "Failed to send email. Please try again later." 
      });
    }

    // Send confirmation email to user
    await sendEmail(
      email,
      "Message Sent Successfully",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background: #f6fff8;">
        <h2 style="color: #22c55e; margin-bottom: 16px;">Message Sent Successfully</h2>
        <p style="font-size: 16px; color: #333;">Dear <span style="font-weight: bold;">${fullName}</span>,</p>
        <p style="font-size: 15px; color: #444;">
        Your message has been sent successfully to 
        <span style="color: #f97316; font-weight: bold;">${adminUser.fullName}</span>.
        </p>
        <p style="font-size: 15px; color: #444;">We'll get back to you as soon as possible.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;">
        <p style="margin-top: 0; color: #666; font-size: 14px;">
        Thank you,<br>
        <span style="color: #2563eb; font-weight: bold;">SIT Coders Team</span>
        </p>
      </div>
      `
    );

    res.status(200).json({ 
      message: "Message sent successfully to admin" 
    });

  } catch (error) {
    console.error("Error sending email to admin:", error);
    res.status(500).json({ 
      message: "Internal server error" 
    });
  }
};

export { sendEmailToAdmin };
